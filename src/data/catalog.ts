export type CityId = "abuja" | "lagos";

export type ServiceKind =
  | "ride"
  | "intercity"
  | "courier"
  | "freight"
  | "food"
  | "grocery"
  | "rental"
  | "reserve";

export type RideClassId =
  | "ryde"
  | "comfort"
  | "xl"
  | "executive"
  | "green"
  | "moto"
  | "keke"
  | "pet"
  | "access"
  | "shield"
  | "scooter"
  | "ebike";

export interface Place {
  id: string;
  city: CityId;
  name: string;
  area: string;
  note: string;
  x: number;
  y: number;
  surge?: boolean;
  saved?: "Home" | "Work";
}

export const places: Place[] = [
  { id: "abuja-home", city: "abuja", name: "Gwarinpa estate gate", area: "Gwarinpa", note: "Wait at the security gate and give the driver's name.", x: 14, y: 48, saved: "Home" },
  { id: "abuja-work", city: "abuja", name: "Wuse II, Zone 5", area: "Wuse", note: "Zone 5 entrance, opposite the filling station.", x: 28, y: 32, saved: "Work" },
  { id: "wuse-market", city: "abuja", name: "Wuse Market gate", area: "Wuse", note: "Use the gate facing the market, not the loading bay.", x: 24, y: 44 },
  { id: "jabi", city: "abuja", name: "Jabi Lake Mall", area: "Jabi", note: "North drop-off, ground level.", x: 50, y: 18 },
  { id: "national-hospital", city: "abuja", name: "National Hospital", area: "Central", note: "Visitor entrance. Leave the ambulance bay clear.", x: 34, y: 64 },
  { id: "uniabuja", city: "abuja", name: "University of Abuja gate", area: "Airport Road", note: "Visitor lay-by outside the gate.", x: 68, y: 28 },
  { id: "garki", city: "abuja", name: "Garki Hospital", area: "Garki", note: "Front canopy, left of the pharmacy.", x: 40, y: 76 },
  { id: "ceddi", city: "abuja", name: "Ceddi Plaza", area: "Central", note: "Forecourt beside the fountain.", x: 18, y: 22 },
  { id: "abj-airport", city: "abuja", name: "Nnamdi Azikiwe Airport", area: "Airport", note: "Arrivals, column 4, official pickup lane.", x: 80, y: 70, surge: true },
  { id: "lagos-home", city: "lagos", name: "Yaba estate gate", area: "Yaba", note: "Call at the yellow kiosk. Security will wave the car in.", x: 16, y: 62, saved: "Home" },
  { id: "lagos-work", city: "lagos", name: "Adeola Odeku", area: "Victoria Island", note: "Second tower gate, not the car-park ramp.", x: 74, y: 64, saved: "Work" },
  { id: "computer-village", city: "lagos", name: "Computer Village", area: "Ikeja", note: "Police-post side. Do not enter the stalls.", x: 26, y: 36 },
  { id: "unilag", city: "lagos", name: "Unilag main gate", area: "Akoka", note: "Lay-by outside the gate, away from the keke rank.", x: 62, y: 56 },
  { id: "balogun", city: "lagos", name: "Balogun Market", area: "Lagos Island", note: "CMS approach, first pedestrian bridge.", x: 46, y: 74 },
  { id: "eko", city: "lagos", name: "Eko Hotel", area: "Victoria Island", note: "Porte-cochère. Follow the attendant.", x: 72, y: 46 },
  { id: "cms", city: "lagos", name: "CMS bus stop", area: "Lagos Island", note: "Under the CMS sign, facing the cathedral.", x: 42, y: 84 },
  { id: "ikeja-mall", city: "lagos", name: "Ikeja City Mall", area: "Ikeja", note: "Park-deck exit A, ground floor.", x: 22, y: 20 },
  { id: "mma", city: "lagos", name: "Murtala Muhammed Airport", area: "Ikeja", note: "Arrival pickup lane, door 2.", x: 82, y: 28, surge: true },
];

export function placesIn(city: CityId) {
  return places.filter((place) => place.city === city);
}

export function placeById(id: string) {
  return places.find((place) => place.id === id) ?? places[0];
}

export const otherCity = (city: CityId): CityId => (city === "abuja" ? "lagos" : "abuja");

export interface RideClass {
  id: RideClassId;
  label: string;
  blurb: string;
  multiplier: number;
}

export const rideClasses: RideClass[] = [
  { id: "ryde", label: "Ryde", blurb: "Everyday cars", multiplier: 1 },
  { id: "comfort", label: "Comfort", blurb: "Newer, quieter cars", multiplier: 1.35 },
  { id: "xl", label: "XL", blurb: "Six seats and bags", multiplier: 1.55 },
  { id: "executive", label: "Executive", blurb: "Premium cars", multiplier: 2.05 },
  { id: "green", label: "Green", blurb: "Lower-emission cars", multiplier: 1.12 },
  { id: "moto", label: "Moto", blurb: "Licensed bikes", multiplier: 0.62 },
  { id: "keke", label: "Keke", blurb: "Short tricycle hops", multiplier: 0.55 },
  { id: "scooter", label: "Scooter", blurb: "Where a fleet is live", multiplier: 0.48 },
  { id: "ebike", label: "E-bike", blurb: "Assisted bikes", multiplier: 0.42 },
  { id: "pet", label: "Pet", blurb: "A pet is welcome", multiplier: 1.18 },
  { id: "access", label: "Access", blurb: "Extra boarding time", multiplier: 1.22 },
  { id: "shield", label: "Shield", blurb: "Share and PIN on by default", multiplier: 1.08 },
];

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface Restaurant {
  id: string;
  city: CityId;
  name: string;
  area: string;
  eta: number;
  items: MenuItem[];
}

export const restaurants: Restaurant[] = [
  { id: "jabi-grills", city: "abuja", name: "Jabi Grills", area: "Jabi", eta: 28, items: [
    { id: "suya", name: "Beef suya platter", price: 4500 },
    { id: "jollof", name: "Jollof and chicken", price: 3800 },
  ]},
  { id: "wuse-bowls", city: "abuja", name: "Wuse Bowls", area: "Wuse", eta: 24, items: [
    { id: "pepper-soup", name: "Pepper soup", price: 3200 },
    { id: "fried-rice", name: "Fried rice", price: 3600 },
  ]},
  { id: "ikeja-kitchen", city: "lagos", name: "Ikeja Kitchen", area: "Ikeja", eta: 32, items: [
    { id: "amala", name: "Amala and gbegiri", price: 3000 },
    { id: "grill", name: "Half chicken", price: 5200 },
  ]},
  { id: "vi-chop", city: "lagos", name: "VI Chop House", area: "Victoria Island", eta: 26, items: [
    { id: "ofada", name: "Ofada and sauce", price: 4100 },
    { id: "shawarma", name: "Chicken shawarma", price: 2800 },
  ]},
];

export function restaurantsIn(city: CityId) {
  return restaurants.filter((spot) => spot.city === city);
}

export const groceries: MenuItem[] = [
  { id: "rice", name: "Rice 5kg", price: 12500 },
  { id: "water", name: "Water pack", price: 2800 },
  { id: "bread", name: "Bread", price: 1800 },
  { id: "eggs", name: "Eggs, one crate", price: 6200 },
];

export const services: { id: ServiceKind; label: string; hint: string }[] = [
  { id: "ride", label: "Ride", hint: "City trip" },
  { id: "intercity", label: "Intercity", hint: "Abuja ↔ Lagos" },
  { id: "courier", label: "Courier", hint: "Send a parcel" },
  { id: "freight", label: "Freight", hint: "Move a load" },
  { id: "food", label: "Food", hint: "Meals to you" },
  { id: "grocery", label: "Grocery", hint: "Staples today" },
  { id: "rental", label: "Hire", hint: "Self-drive" },
  { id: "reserve", label: "Reserve", hint: "Leave later" },
];

export interface SampleDriver {
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  plate: string;
}

export const sampleDrivers: SampleDriver[] = [
  { name: "Amaka O.", rating: 4.93, trips: 1284, vehicle: "Toyota Corolla · Silver", plate: "ABC-123AB" },
  { name: "Ibrahim S.", rating: 4.88, trips: 986, vehicle: "Honda Accord · Black", plate: "LSD-441JK" },
  { name: "Chinedu A.", rating: 4.79, trips: 742, vehicle: "Hyundai Elantra · White", plate: "KJA-908DE" },
  { name: "Fatima B.", rating: 4.96, trips: 1502, vehicle: "Kia Rio · Blue", plate: "BDG-220FG" },
];

export const fuelStations = [
  { id: "mrs-wuse", city: "abuja" as const, name: "MRS Wuse Zone 4", hours: "06:00–22:00" },
  { id: "mrs-jabi", city: "abuja" as const, name: "MRS Jabi", hours: "24 hours" },
  { id: "mrs-ikeja", city: "lagos" as const, name: "MRS Ikeja", hours: "06:00–23:00" },
  { id: "mrs-vi", city: "lagos" as const, name: "MRS Victoria Island", hours: "24 hours" },
];
