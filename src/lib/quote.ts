import {
  groceries,
  otherCity,
  placeById,
  placesIn,
  restaurants,
  rideClasses,
  type RideClassId,
  type ServiceKind,
} from "@/data/catalog";

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  distanceKm: number;
  etaMin: number;
  recommended: number;
  minimum: number;
  surge: boolean;
  surgeMultiplier: number;
  lines: QuoteLine[];
  promoOff: number;
  total: number;
  blocked: string | null;
}

export interface QuoteInput {
  service: ServiceKind;
  pickupId: string;
  dropoffId: string;
  rideClass: RideClassId;
  stopId: string | null;
  childSeat: boolean;
  promo: string;
  foodId: string;
  itemId: string;
  groceryIds: string[];
  rentalHours: 4 | 8 | 24;
  rentalClass: "compact" | "suv";
  parcel: "envelope" | "small" | "medium" | "large";
  freight: "bike" | "van" | "truck";
  splitFare: boolean;
}

const parcelFee = { envelope: 800, small: 1500, medium: 2500, large: 4000 };
const freightBase = { bike: 4500, van: 14000, truck: 26000 };

function cityKm(aId: string, bId: string) {
  const a = placeById(aId);
  const b = placeById(bId);
  if (a.city !== b.city) return 712;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.max(1.8, Math.round(Math.hypot(dx, dy) * 0.38 * 10) / 10);
}

function round50(value: number) {
  return Math.max(500, Math.round(value / 50) * 50);
}

export function quoteFor(input: QuoteInput): Quote {
  const pickup = placeById(input.pickupId);
  const dropoff = placeById(input.dropoffId);
  const needsDrop = input.service !== "rental" && input.service !== "food" && input.service !== "grocery";
  let blocked: string | null = null;
  if (needsDrop && input.pickupId === input.dropoffId) {
    blocked = "Choose a destination that is different from the pickup.";
  }
  if (input.service === "intercity" && pickup.city === dropoff.city) {
    blocked = "Intercity runs between Abuja and Lagos. Switch city or destination.";
  }
  if (input.service === "grocery" && input.groceryIds.length === 0) {
    blocked = "Add at least one grocery item.";
  }

  const ride = rideClasses.find((item) => item.id === input.rideClass) ?? rideClasses[0];
  const stopExtra = input.stopId ? 1.6 : 0;
  const distanceKm = input.service === "intercity"
    ? 712
    : input.service === "rental"
      ? 0
      : cityKm(input.pickupId, input.dropoffId) + stopExtra;

  const surge = Boolean(pickup.surge || (needsDrop && dropoff.surge) || input.service === "intercity" && (pickup.surge || dropoff.surge));
  const surgeMultiplier = surge && (input.service === "ride" || input.service === "reserve" || input.service === "intercity") ? 1.35 : 1;

  const lines: QuoteLine[] = [];
  let subtotal = 0;

  if (input.service === "food") {
    const spot = restaurants.find((item) => item.id === input.foodId) ?? restaurants[0];
    const item = spot.items.find((dish) => dish.id === input.itemId) ?? spot.items[0];
    lines.push({ label: item.name, amount: item.price });
    lines.push({ label: "Delivery", amount: 800 });
    lines.push({ label: "Service", amount: 200 });
    subtotal = item.price + 1000;
  } else if (input.service === "grocery") {
    const chosen = groceries.filter((item) => input.groceryIds.includes(item.id));
    chosen.forEach((item) => lines.push({ label: item.name, amount: item.price }));
    lines.push({ label: "Delivery", amount: 900 });
    subtotal = chosen.reduce((sum, item) => sum + item.price, 0) + 900;
  } else if (input.service === "rental") {
    const hourly = input.rentalClass === "suv" ? 6500 : 4200;
    const amount = hourly * input.rentalHours;
    lines.push({ label: `${input.rentalClass === "suv" ? "SUV" : "Compact"} · ${input.rentalHours}h`, amount });
    subtotal = amount;
  } else if (input.service === "courier") {
    const base = parcelFee[input.parcel];
    const distanceFee = round50(distanceKm * 220);
    lines.push({ label: "Parcel", amount: base });
    lines.push({ label: "Distance", amount: distanceFee });
    subtotal = base + distanceFee;
  } else if (input.service === "freight") {
    const base = freightBase[input.freight];
    const distanceFee = round50(distanceKm * (input.freight === "truck" ? 480 : 260));
    lines.push({ label: input.freight === "bike" ? "Bike haul" : input.freight === "van" ? "Van" : "Truck", amount: base });
    lines.push({ label: "Distance", amount: distanceFee });
    subtotal = base + distanceFee;
  } else {
    const base = input.service === "intercity" ? 28000 : 650;
    const perKm = input.service === "intercity" ? 55 : 180;
    const classed = (base + distanceKm * perKm) * ride.multiplier * surgeMultiplier;
    lines.push({ label: input.service === "intercity" ? "Intercity" : ride.label, amount: round50(classed / surgeMultiplier) });
    if (surgeMultiplier > 1) {
      lines.push({ label: "Surge", amount: round50(classed) - round50(classed / surgeMultiplier) });
    }
    if (input.stopId) lines.push({ label: "Extra stop", amount: 400 });
    if (input.childSeat) lines.push({ label: "Child seat", amount: 500 });
    subtotal = round50(classed) + (input.stopId ? 400 : 0) + (input.childSeat ? 500 : 0);
  }

  const code = input.promo.trim().toUpperCase();
  let promoOff = 0;
  if (code === "RYDE") promoOff = 500;
  if (code === "RYDE10") promoOff = Math.min(2000, Math.round(subtotal * 0.1));
  if (promoOff > 0) lines.push({ label: `Promo ${code}`, amount: -promoOff });

  const recommended = Math.max(0, subtotal - promoOff);
  const minimum = round50(recommended * 0.85);
  const etaMin = input.service === "food"
    ? (restaurants.find((item) => item.id === input.foodId)?.eta ?? 30)
    : input.service === "intercity"
      ? 8 * 60
      : input.service === "rental"
        ? 20
        : Math.max(4, Math.round((distanceKm / 26) * 60));

  return {
    distanceKm,
    etaMin,
    recommended,
    minimum: Math.min(minimum, recommended),
    surge: surgeMultiplier > 1,
    surgeMultiplier,
    lines,
    promoOff,
    total: recommended,
    blocked,
  };
}

export function dropoffChoices(service: ServiceKind, city: "abuja" | "lagos") {
  if (service === "intercity") return placesIn(otherCity(city));
  return placesIn(city);
}

export function offerModeAllowed(service: ServiceKind) {
  return service === "ride" || service === "intercity" || service === "courier" || service === "freight";
}
