import type { RideClassId, ServiceKind } from "@/data/catalog";

export type FeatureGroup =
  | "ride"
  | "price"
  | "trip"
  | "safety"
  | "driver"
  | "delivery"
  | "business";

export interface FeatureApply {
  service?: ServiceKind;
  fareMode?: "upfront" | "offer";
  rideClass?: RideClassId;
  business?: boolean;
  splitFare?: boolean;
  quiet?: boolean;
  forOther?: boolean;
  leaveLater?: boolean;
  childSeat?: boolean;
  payment?: "cash" | "card" | "wallet" | "transfer" | "invoice";
}

export interface Feature {
  id: string;
  group: FeatureGroup;
  title: string;
  body: string;
  icon: string;
  apply?: FeatureApply;
  anchor?: string;
}

export const featureGroups: { id: "all" | FeatureGroup; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ride", label: "Ride" },
  { id: "price", label: "Price" },
  { id: "trip", label: "On the trip" },
  { id: "safety", label: "Safety" },
  { id: "driver", label: "Drivers" },
  { id: "delivery", label: "Delivery" },
  { id: "business", label: "Business" },
];

export const features: Feature[] = [
  { id: "city", group: "ride", icon: "DirectionsCar", title: "City rides", body: "A car, bike, keke, scooter, or e-bike from a landmark you can actually describe.", apply: { service: "ride", rideClass: "ryde" } },
  { id: "classes", group: "ride", icon: "AirlineSeatReclineExtra", title: "Ride classes", body: "Ryde, Comfort, XL, Executive, Green, Moto, Keke, Scooter, E-bike, Pet, Access, and Shield.", apply: { service: "ride", rideClass: "comfort" } },
  { id: "intercity", group: "ride", icon: "AltRoute", title: "Intercity", body: "Abuja to Lagos and back, with a seat count, a pickup landmark, and a fare you agree before leaving.", apply: { service: "intercity", fareMode: "offer" } },
  { id: "reserve", group: "ride", icon: "Schedule", title: "Reserve", body: "Set a pickup time. The fare is shown before you confirm, and the driver is briefed on the landmark.", apply: { service: "reserve", leaveLater: true, fareMode: "upfront" } },
  { id: "stops", group: "ride", icon: "AddLocationAlt", title: "Extra stops", body: "Add a stop on a city ride. The added fee is on the estimate, not discovered at the end.", apply: { service: "ride" } },
  { id: "guest", group: "ride", icon: "Group", title: "Book for someone else", body: "You pay and track. The rider gets the trip context, and you can see progress without sharing their private history.", apply: { service: "ride", forOther: true } },
  { id: "hire", group: "ride", icon: "CarRental", title: "Self-drive hire", body: "Take a compact car or SUV for 4, 8, or 24 hours from a landmark, where a hire fleet is operating.", apply: { service: "rental" } },
  { id: "choose", group: "ride", icon: "PersonSearch", title: "Choose the driver", body: "When you name a price, sample offers show the driver, car, rating, ETA, and amount. You pick one.", apply: { service: "ride", fareMode: "offer" } },
  { id: "upfront", group: "price", icon: "Payments", title: "Upfront fare", body: "See the fare, fees, and any surge before you confirm. If a line changes, it is named.", apply: { service: "ride", fareMode: "upfront" } },
  { id: "offer", group: "price", icon: "Sell", title: "Your price", body: "Propose a fare. Drivers accept or counter. Offers under the published floor are not sent.", apply: { service: "ride", fareMode: "offer" } },
  { id: "floor", group: "price", icon: "VerifiedUser", title: "Fare floor", body: "A minimum keeps passenger offers from falling through what a driver can run the trip on.", apply: { fareMode: "offer" } },
  { id: "surge", group: "price", icon: "TrendingUp", title: "Surge, explained", body: "Airport and peak corridors raise the estimate with an orange alert before booking. No silent jump.", apply: { service: "ride" } },
  { id: "promo", group: "price", icon: "Loyalty", title: "Promos", body: "Try RYDE or RYDE10 in the preview. The discount is a separate line, capped, and shown before you book.", apply: { service: "ride" } },
  { id: "tip", group: "price", icon: "FavoriteBorder", title: "Tips", body: "After a trip is assigned in the preview, add a tip. It is optional and never folded into the platform commission.", apply: { service: "ride", fareMode: "upfront" } },
  { id: "split", group: "price", icon: "CallSplit", title: "Split fare", body: "Two people can share one fare. Each share is visible. Payment collection stays with the authorised provider.", apply: { service: "ride", splitFare: true } },
  { id: "receipt", group: "price", icon: "ReceiptLong", title: "Receipts", body: "Every preview trip lands in a short history with the amount you were shown.", apply: { service: "ride" } },
  { id: "track", group: "trip", icon: "NearMe", title: "Live tracking", body: "The route is drawn in lemon green from the landmark to the destination, with the vehicle moving on that line.", apply: { service: "ride" } },
  { id: "landmark", group: "trip", icon: "Place", title: "Landmark pickup", body: "Estates, gates, markets, campuses, hospitals, and airports, with a note a driver can follow.", apply: { service: "ride" } },
  { id: "notes", group: "trip", icon: "StickyNote2", title: "Pickup notes", body: "Gate, side of road, visitor procedure, and where not to wait. Riders can report a bad pin.", anchor: "localiq" },
  { id: "saved", group: "trip", icon: "BookmarkBorder", title: "Saved places", body: "Home and Work sit at the top of the landmark list. Visibility stays with the account.", apply: { service: "ride" } },
  { id: "chat", group: "trip", icon: "ChatOutlined", title: "In-trip chat", body: "Message the assigned driver without exposing phone numbers in the preview thread.", apply: { service: "ride", fareMode: "upfront" } },
  { id: "call", group: "trip", icon: "PhoneInTalk", title: "Masked call", body: "A call button sits beside chat. In production the number is masked. This preview does not place a call.", apply: { service: "ride" } },
  { id: "quiet", group: "trip", icon: "VolumeOff", title: "Quiet ride", body: "Ask for a quiet car. The note is shown to the driver as a preference, not a rating trap.", apply: { service: "ride", quiet: true } },
  { id: "rate", group: "trip", icon: "StarBorder", title: "Ratings both ways", body: "Riders and drivers rate the trip. A rating is not an account block. Serious issues go to a case.", anchor: "safety" },
  { id: "history", group: "trip", icon: "History", title: "Trip history", body: "Completed preview bookings stay on the card so you can see what the fare was.", apply: { service: "ride" } },
  { id: "nin", group: "safety", icon: "VerifiedUser", title: "NIN check", body: "Riders and drivers both clear a National Identification Number check. The other person sees verified. The number stays off the trip.", anchor: "safety" },
  { id: "pin", group: "safety", icon: "Pin", title: "Trip PIN", body: "A four-digit PIN is created for the trip, shown to you, and required before the driver starts. It dies after use.", apply: { service: "ride", fareMode: "upfront" } },
  { id: "share", group: "safety", icon: "Share", title: "Share the trip", body: "Send status to a trusted contact. Access ends when the trip ends.", anchor: "safety" },
  { id: "sos", group: "safety", icon: "Sos", title: "SOS", body: "The orange SOS control opens a high-urgency case and would alert support and your trusted contact.", anchor: "safety" },
  { id: "contacts", group: "safety", icon: "ContactPhone", title: "Trusted contacts", body: "People you choose can see an active trip. They do not get your full history.", anchor: "safety" },
  { id: "case", group: "safety", icon: "Assignment", title: "CaseTrack", body: "Complaints get a reference, a status, a next step, and a human review when the stakes are high.", anchor: "safety" },
  { id: "appeal", group: "safety", icon: "Gavel", title: "Appeals", body: "A consequential decision can be appealed to a reviewer who did not make the first call.", anchor: "safety" },
  { id: "lost", group: "safety", icon: "Search", title: "Lost item", body: "A support-mediated case, not an open phone number, is how a forgotten bag gets followed up.", anchor: "safety" },
  { id: "earnings", group: "driver", icon: "AccountBalanceWallet", title: "True Earnings", body: "Gross fare, commission, bonuses, and estimated take-home before fuel. Estimates stay labelled as estimates.", anchor: "drivers" },
  { id: "accept", group: "driver", icon: "ThumbUpAlt", title: "Accept, decline, or counter", body: "Drivers see the request, the landmark note, and the fare. On your-price trips they can counter.", apply: { fareMode: "offer" } },
  { id: "destination", group: "driver", icon: "Flag", title: "Destination filter", body: "A driver can head toward home without being penalised for trips that do not fit. Dispatch stays fair.", anchor: "drivers" },
  { id: "heatmap", group: "driver", icon: "Map", title: "Demand map", body: "Busy cells are shown so drivers can move toward work. The map is guidance, not a hidden score.", anchor: "drivers" },
  { id: "nav", group: "driver", icon: "Navigation", title: "Navigation handoff", body: "Turn-by-turn stays with an established maps provider. Rapyd Ryd keeps the landmark layer.", anchor: "drivers" },
  { id: "docs", group: "driver", icon: "Badge", title: "Document checks", body: "After the NIN check, licence, vehicle, and inspection status stay with operations. Riders see verified, not the files.", anchor: "drivers" },
  { id: "fuel", group: "driver", icon: "LocalGasStation", title: "DriverCare fuel", body: "Optional station list and a single-use code. Fuelling elsewhere does not affect dispatch or rating.", anchor: "drivers" },
  { id: "garage", group: "driver", icon: "Build", title: "Garages and tyres", body: "Vetted partners with published terms. Drivers can rate them and report a bad job.", anchor: "drivers" },
  { id: "costs", group: "driver", icon: "EditNote", title: "Cost log", body: "Optional fuel, repair, tyre, and data entries so take-home is not confused with profit.", anchor: "drivers" },
  { id: "payout", group: "driver", icon: "Savings", title: "Payouts", body: "Wallet, cash trips, and transfer payouts reconcile against the trip. Deductions are itemised.", anchor: "drivers" },
  { id: "courier", group: "delivery", icon: "Inventory2", title: "Courier", body: "Envelope to large parcel, with a recipient landmark and an upfront fee or your price.", apply: { service: "courier" } },
  { id: "freight", group: "delivery", icon: "LocalShipping", title: "Freight", body: "Bike, van, or truck. The load note and the fare are on the request before a driver accepts.", apply: { service: "freight", fareMode: "offer" } },
  { id: "food", group: "delivery", icon: "Restaurant", title: "Food", body: "A short menu, a delivery fee, and an ETA. The courier is tracked on the same lemon route.", apply: { service: "food" } },
  { id: "grocery", group: "delivery", icon: "ShoppingBasket", title: "Grocery", body: "Staples from a partner shelf, with a delivery fee shown before you place the order.", apply: { service: "grocery" } },
  { id: "biz", group: "business", icon: "BusinessCenter", title: "Business profile", body: "Mark a ride as a company trip. The rider, cost center, and invoice path stay on the receipt.", apply: { service: "ride", business: true, payment: "invoice" } },
  { id: "center", group: "business", icon: "AccountTree", title: "Cost centers", body: "Teams book against a center. Admins see spend without opening every personal trip.", apply: { business: true } },
  { id: "invoice", group: "business", icon: "Description", title: "Monthly invoice", body: "Completed company trips roll into one invoice. Payment terms are agreed before the account goes live.", apply: { business: true } },
  { id: "staff", group: "business", icon: "Badge", title: "Staff transport", body: "An employee rides, the company pays, and the passenger still gets the PIN and share controls.", apply: { forOther: true, business: true } },
];
