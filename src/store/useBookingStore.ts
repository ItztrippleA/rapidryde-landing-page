"use client";

import { create } from "zustand";
import { placesIn, sampleDrivers, type CityId, type RideClassId, type ServiceKind } from "@/data/catalog";
import { offerModeAllowed, quoteFor, type QuoteInput } from "@/lib/quote";

export type PayId = "cash" | "card" | "wallet" | "transfer" | "invoice" | "stillplay";
export type Stage = "draft" | "searching" | "offers" | "assigned";

export interface DemoOffer {
  id: string;
  driver: string;
  rating: number;
  trips: number;
  vehicle: string;
  plate: string;
  etaMin: number;
  amount: number;
}

export interface DemoCase {
  id: string;
  kind: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  from: "you" | "driver";
  text: string;
}

export interface HistoryItem {
  id: string;
  label: string;
  amount: number;
}

type BookingState = QuoteInput & {
  city: CityId;
  fareMode: "upfront" | "offer";
  offerNaira: number;
  leaveLater: boolean;
  leaveTime: string;
  payment: PayId;
  forOther: boolean;
  guestName: string;
  quiet: boolean;
  business: boolean;
  costCenter: string;
  stage: Stage;
  offers: DemoOffer[];
  chosenOfferId: string | null;
  pin: string;
  tip: number;
  messages: ChatMessage[];
  cases: DemoCase[];
  history: HistoryItem[];
  error: string | null;
  fuelCode: string | null;
  setCity: (city: CityId) => void;
  setService: (service: ServiceKind) => void;
  patch: (partial: Partial<QuoteInput & { fareMode: "upfront" | "offer"; leaveLater: boolean; forOther: boolean; quiet: boolean; business: boolean; payment: PayId; guestName: string; costCenter: string; leaveTime: string; offerNaira: number }>) => void;
  book: () => void;
  assign: () => void;
  chooseOffer: (id: string) => void;
  reset: () => void;
  sendChat: (text: string) => void;
  openCase: (kind: string) => void;
  setTip: (tip: number) => void;
  issueFuelCode: () => void;
};

const first = (city: CityId) => placesIn(city);

function pin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function caseId() {
  return `RR-${Math.floor(1000 + Math.random() * 9000)}`;
}

const initial = {
  city: "abuja" as CityId,
  service: "ride" as ServiceKind,
  pickupId: first("abuja")[0].id,
  dropoffId: first("abuja")[1].id,
  rideClass: "ryde" as RideClassId,
  stopId: null,
  childSeat: false,
  promo: "",
  foodId: "jabi-grills",
  itemId: "suya",
  groceryIds: ["rice"] as string[],
  rentalHours: 4 as const,
  rentalClass: "compact" as const,
  parcel: "small" as const,
  freight: "van" as const,
  fareMode: "upfront" as const,
  offerNaira: 0,
  leaveLater: false,
  leaveTime: "08:30",
  payment: "cash" as PayId,
  forOther: false,
  guestName: "",
  quiet: false,
  business: false,
  costCenter: "",
  stage: "draft" as Stage,
  offers: [] as DemoOffer[],
  chosenOfferId: null as string | null,
  pin: "",
  tip: 0,
  messages: [] as ChatMessage[],
  cases: [] as DemoCase[],
  history: [] as HistoryItem[],
  error: null as string | null,
  fuelCode: null as string | null,
};

function snapshot(state: BookingState): QuoteInput {
  return {
    service: state.service,
    pickupId: state.pickupId,
    dropoffId: state.dropoffId,
    rideClass: state.rideClass,
    stopId: state.stopId,
    childSeat: state.childSeat,
    promo: state.promo,
    foodId: state.foodId,
    itemId: state.itemId,
    groceryIds: state.groceryIds,
    rentalHours: state.rentalHours,
    rentalClass: state.rentalClass,
    parcel: state.parcel,
    freight: state.freight,
    splitFare: state.splitFare,
  };
}

function labelFor(state: BookingState) {
  const names: Record<ServiceKind, string> = {
    ride: "City ride",
    intercity: "Intercity",
    courier: "Courier",
    freight: "Freight",
    food: "Food",
    grocery: "Grocery",
    rental: "Self-drive hire",
    reserve: "Reserved ride",
  };
  return names[state.service];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initial,
  splitFare: false,
  setCity: (city) =>
    set((state) => {
      const local = placesIn(city);
      const dropCity = state.service === "intercity" ? (city === "abuja" ? "lagos" : "abuja") : city;
      const drops = placesIn(dropCity);
      const food = city === "abuja" ? "jabi-grills" : "ikeja-kitchen";
      const item = city === "abuja" ? "suya" : "amala";
      return {
        city,
        pickupId: local[0].id,
        dropoffId: drops[Math.min(1, drops.length - 1)].id,
        foodId: food,
        itemId: item,
        stage: "draft",
        error: null,
      };
    }),
  setService: (service) =>
    set((state) => {
      const dropCity = service === "intercity" ? (state.city === "abuja" ? "lagos" : "abuja") : state.city;
      const drops = placesIn(dropCity);
      const local = placesIn(state.city);
      return {
        service,
        pickupId: local.some((place) => place.id === state.pickupId) ? state.pickupId : local[0].id,
        dropoffId: drops[Math.min(1, drops.length - 1)].id,
        fareMode: offerModeAllowed(service) ? state.fareMode : "upfront",
        leaveLater: service === "reserve" ? true : state.leaveLater,
        stage: "draft",
        offers: [],
        chosenOfferId: null,
        error: null,
      };
    }),
  patch: (partial) => set({ ...partial, error: null }),
  book: () => {
    const state = get();
    const quote = quoteFor(snapshot(state));
    if (quote.blocked) {
      set({ error: quote.blocked });
      return;
    }
    if (state.fareMode === "offer" && offerModeAllowed(state.service)) {
      const base = Math.max(quote.minimum, state.offerNaira || quote.recommended);
      const offers = sampleDrivers.slice(0, 3).map((driver, index) => {
        const bump = [0, 0.08, -0.06][index];
        const amount = Math.max(quote.minimum, Math.round((base * (1 + bump)) / 50) * 50);
        return {
          id: `offer-${index}`,
          driver: driver.name,
          rating: driver.rating,
          trips: driver.trips,
          vehicle: driver.vehicle,
          plate: driver.plate,
          etaMin: quote.etaMin + index * 2,
          amount,
        };
      });
      set({ stage: "offers", offers, error: null, chosenOfferId: null, pin: "" });
      return;
    }
    set({ stage: "searching", offers: [], error: null, chosenOfferId: null, pin: "" });
  },
  assign: () =>
    set((state) => {
      const quote = quoteFor(snapshot(state));
      const driver = sampleDrivers[0];
      const nextPin = pin();
      const offer: DemoOffer = {
        id: "direct",
        driver: driver.name,
        rating: driver.rating,
        trips: driver.trips,
        vehicle: driver.vehicle,
        plate: driver.plate,
        etaMin: quote.etaMin,
        amount: quote.total,
      };
      return {
        stage: "assigned",
        pin: nextPin,
        offers: [offer],
        chosenOfferId: offer.id,
        tip: 0,
        messages: [{ id: "hello", from: "driver", text: "On my way. I will follow the landmark note." }],
        history: [{ id: nextPin, label: labelFor(state), amount: quote.total }, ...state.history].slice(0, 4),
      };
    }),
  chooseOffer: (id) =>
    set((state) => {
      const offer = state.offers.find((item) => item.id === id);
      if (!offer) return {};
      const nextPin = pin();
      return {
        stage: "assigned",
        chosenOfferId: id,
        pin: nextPin,
        tip: 0,
        messages: [{ id: "hello", from: "driver", text: `Offer accepted at the agreed fare. I will use the landmark note.` }],
        history: [{ id: nextPin, label: labelFor(state), amount: offer.amount }, ...state.history].slice(0, 4),
      };
    }),
  reset: () => set({ stage: "draft", offers: [], chosenOfferId: null, pin: "", messages: [], tip: 0, error: null }),
  sendChat: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `you-${state.messages.length}`, from: "you", text },
        { id: `drv-${state.messages.length}`, from: "driver", text: "Seen. I will be at the landmark." },
      ],
    })),
  openCase: (kind) =>
    set((state) => ({
      cases: [{ id: caseId(), kind, status: "Acknowledged" }, ...state.cases].slice(0, 5),
    })),
  setTip: (tip) => set({ tip }),
  issueFuelCode: () => set({ fuelCode: `MRS-${Math.floor(100000 + Math.random() * 900000)}` }),
}));

export const WALLET_BALANCE = 12500;
