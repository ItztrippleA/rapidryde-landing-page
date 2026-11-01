export type Visibility = "+" | "-" | "#";
export type RelationKind = "extends" | "composition" | "aggregation" | "association" | "dependency";
export type Stereotype = "entity" | "value" | "service" | "enum";

export interface UmlAttribute {
  visibility: Visibility;
  name: string;
  type: string;
}

export interface UmlMethod {
  visibility: Visibility;
  name: string;
  returns: string;
  detail: string;
}

export interface UmlClass {
  id: string;
  packageId: string;
  name: string;
  abstract?: boolean;
  stereotype: Stereotype;
  summary: string;
  attributes: UmlAttribute[];
  methods: UmlMethod[];
  collaborates?: string[];
}

export interface UmlRelation {
  id: string;
  kind: RelationKind;
  from: string;
  to: string;
  label: string;
}

export interface UmlPackage {
  id: string;
  name: string;
  summary: string;
}

export interface JourneySlot {
  c: number;
  r: number;
}

const attr = (name: string, type: string, visibility: Visibility = "+"): UmlAttribute => ({ visibility, name, type });
const method = (name: string, returns: string, detail: string, visibility: Visibility = "+"): UmlMethod => ({ visibility, name, returns, detail });

export const packages: UmlPackage[] = [
  { id: "journey", name: "Journey", summary: "The path from a landmark and a fare to a trip, a PIN, a payment, and, if needed, a case." },
  { id: "identity", name: "Identity", summary: "People, sessions, privacy, and the NIN check required before a rider books or a driver goes online." },
  { id: "localiq", name: "LocalIQ", summary: "The landmark and instruction layer Rapyd Ryd owns on top of a maps provider." },
  { id: "booking", name: "Booking", summary: "Requests for rides, offers, schedules, guests, stops, and service classes." },
  { id: "trip", name: "Trip", summary: "The live journey: PIN, share, events, cancellation, rating, and receipt." },
  { id: "fleet", name: "Fleet", summary: "Vehicles, documents, shifts, self-drive hire, and destination filters." },
  { id: "pricing", name: "Pricing", summary: "Upfront quotes, your-price floors, surge, commission, and promos." },
  { id: "payments", name: "Payments", summary: "Cash, card, wallet, transfer, invoice, Still Play as a third-party payment, and driver payouts." },
  { id: "promise", name: "Promise", summary: "CaseTrack: reference, evidence, decision, and appeal." },
  { id: "drivercare", name: "DriverCare", summary: "True Earnings, the cost log, partners, and optional fuel codes." },
  { id: "delivery", name: "Delivery", summary: "Courier, freight, food, and grocery orders on the same dispatch spine." },
  { id: "business", name: "Business", summary: "Company accounts, cost centers, members, and split fares." },
  { id: "safety", name: "Safety", summary: "SOS, incidents, and the handoff into a human-reviewed case." },
  { id: "platform", name: "Platform", summary: "Zones, demand cells, notifications, referrals, and the audit log." },
  { id: "services", name: "Services", summary: "Application services that run the operations on the entities." },
];

export const journeyLayout: Record<string, JourneySlot> = {
  passenger: { c: 1, r: 1 },
  rideRequest: { c: 1, r: 2 },
  fareQuote: { c: 1, r: 3 },
  driver: { c: 2, r: 1 },
  vehicle: { c: 2, r: 2 },
  rideOffer: { c: 2, r: 3 },
  landmark: { c: 3, r: 1 },
  trip: { c: 3, r: 2 },
  tripPin: { c: 3, r: 3 },
  earningsStatement: { c: 4, r: 1 },
  payment: { c: 4, r: 2 },
  caseFile: { c: 4, r: 3 },
};

export const journeyOrder = Object.keys(journeyLayout);

export const classes: UmlClass[] = [
  {
    id: "user", packageId: "identity", name: "User", abstract: true, stereotype: "entity",
    summary: "Account shared by riders, drivers, and staff. Phone recovers the account. A passed NIN check is what unlocks booking or earning.",
    attributes: [attr("id", "UUID"), attr("phone", "E164"), attr("ninStatus", "pending | verified | failed"), attr("status", "AccountStatus"), attr("city", "Zone")],
    methods: [
      method("register(phone)", "Session", "Opens the account. Booking and going online still wait for the NIN check."),
      method("recover(code)", "Session", "Account recovery without exposing documents."),
      method("close()", "void", "Starts retention and deletion for that account."),
    ],
  },
  {
    id: "passenger", packageId: "identity", name: "Passenger", stereotype: "entity",
    summary: "A rider with a passed NIN check. Can book for themselves, a guest, or a company, and can share an active trip.",
    attributes: [attr("rating", "decimal"), attr("defaultPayment", "PaymentMethod"), attr("quietDefault", "boolean"), attr("walletId", "UUID")],
    methods: [
      method("book(request)", "RideRequest", "Refuses the request until this rider's NIN check has passed."),
      method("namePrice(amount)", "RideOffer[]", "Asks drivers to accept or counter, above the floor."),
      method("share(trip, contact)", "TripShare", "Opens live status for one trusted contact."),
    ],
  },
  {
    id: "driver", packageId: "identity", name: "Driver", stereotype: "entity",
    summary: "A driver with a passed NIN check and valid vehicle papers. Can accept an upfront fare or counter a passenger offer.",
    attributes: [attr("rating", "decimal"), attr("online", "boolean"), attr("homeZone", "Zone")],
    methods: [
      method("goOnline(shift)", "AvailabilityShift", "Refuses the shift until the NIN check and vehicle papers have passed."),
      method("counter(request, amount)", "RideOffer", "Sends one offer. Below the floor is rejected."),
      method("accept(request)", "Trip", "Locks the driver, vehicle, and fare onto a trip."),
    ],
  },
  {
    id: "staff", packageId: "identity", name: "Staff", stereotype: "entity",
    summary: "Support, onboarding, operations, or admin. Permissions are role-based.",
    attributes: [attr("role", "StaffRole"), attr("mfa", "boolean"), attr("team", "string")],
    methods: [
      method("assume(role)", "Session", "Privileged sign-in requires MFA."),
      method("review(case)", "Decision", "Records a rationale the user can read."),
      method("moderate(landmark)", "Landmark", "Approves, edits, or retires a pickup note."),
    ],
  },
  {
    id: "session", packageId: "identity", name: "Session", stereotype: "entity",
    summary: "A signed-in device. Privileged sessions expire faster.",
    attributes: [attr("token", "secret"), attr("expiresAt", "Instant"), attr("device", "string")],
    methods: [method("refresh()", "Session", "Rotates the token."), method("revoke()", "void", "Signs that device out.")],
  },
  {
    id: "ninVerification", packageId: "identity", name: "NinVerification", stereotype: "entity",
    summary: "National Identification Number check for every rider and every driver. The other person sees verified. The number stays off the trip.",
    attributes: [attr("status", "pending | verified | failed"), attr("checkedAt", "Instant?"), attr("holder", "passenger | driver")],
    methods: [
      method("submit(nin)", "NinVerification", "Matches the account to the national record. The raw number is not shown to the other party."),
      method("passed()", "boolean", "Booking and going online both wait for a pass."),
    ],
  },
  {
    id: "trustedContact", packageId: "identity", name: "TrustedContact", stereotype: "entity",
    summary: "Someone a rider allows to see an active trip. Not a full account.",
    attributes: [attr("name", "string"), attr("phone", "E164"), attr("channel", "sms | push")],
    methods: [method("notify(share)", "void", "Sends start, and stops when the share ends.")],
  },
  {
    id: "privacySetting", packageId: "identity", name: "PrivacySetting", stereotype: "value",
    summary: "What the account shares: saved places, trip history with a company, and marketing.",
    attributes: [attr("shareHistory", "boolean"), attr("savedPlaceVisibility", "private | company"), attr("marketing", "boolean")],
    methods: [method("update(patch)", "PrivacySetting", "Writes an audit entry with the change.")],
  },
  {
    id: "place", packageId: "localiq", name: "Place", stereotype: "entity",
    summary: "A point from the maps provider, plus Rapyd Ryd's local label.",
    attributes: [attr("lat", "decimal"), attr("lng", "decimal"), attr("label", "string"), attr("city", "Zone")],
    methods: [method("adjustPin(lat, lng)", "Place", "Rider can nudge the pin before booking.")],
  },
  {
    id: "landmark", packageId: "localiq", name: "Landmark", stereotype: "entity",
    summary: "A field-checked pickup: estate gate, market, campus, hospital, mall, or airport.",
    attributes: [attr("kind", "LandmarkKind"), attr("verifiedAt", "Date"), attr("status", "draft | live | retired"), attr("zone", "Zone")],
    methods: [
      method("search(query)", "Landmark[]", "Matches names riders actually use."),
      method("instruct()", "PickupInstruction", "Returns the note drivers see before arrival."),
      method("retire(reason)", "void", "Hides unsafe or stale guidance."),
    ],
  },
  {
    id: "pickupInstruction", packageId: "localiq", name: "PickupInstruction", stereotype: "value",
    summary: "Gate, side of road, visitor procedure, and a safe place to wait.",
    attributes: [attr("gate", "string"), attr("side", "string"), attr("waitingPoint", "string"), attr("access", "string")],
    methods: [method("revision()", "int", "Edits are logged. The previous text is kept.")],
  },
  {
    id: "savedPlace", packageId: "localiq", name: "SavedPlace", stereotype: "entity",
    summary: "Home, work, or another place the rider saved. Visibility is theirs to set.",
    attributes: [attr("alias", "Home | Work | custom"), attr("placeId", "UUID"), attr("visibility", "private | shared")],
    methods: [method("rename(alias)", "SavedPlace", "Does not change the underlying landmark.")],
  },
  {
    id: "landmarkReport", packageId: "localiq", name: "LandmarkReport", stereotype: "entity",
    summary: "A driver or rider says the pin, gate, or note is wrong.",
    attributes: [attr("reason", "blocked | wrong | unsafe"), attr("note", "string"), attr("status", "open | applied")],
    methods: [method("submit()", "Case", "Queues an operations review, not a silent overwrite.")],
  },
  {
    id: "mobilityOrder", packageId: "booking", name: "MobilityOrder", abstract: true, stereotype: "entity",
    summary: "Shared shape for rides and deliveries: pickup, dropoff, fare mode, and status.",
    attributes: [attr("id", "UUID"), attr("fareMode", "upfront | offer"), attr("status", "OrderStatus"), attr("scheduledFor", "Instant?")],
    methods: [
      method("quote()", "FareQuote", "Builds an upfront estimate."),
      method("cancel(reason)", "Cancellation", "Applies the published cancellation rule."),
    ],
  },
  {
    id: "rideRequest", packageId: "booking", name: "RideRequest", stereotype: "entity",
    summary: "A city ride, reserve, or intercity seat. Holds the class, stops, and preferences.",
    attributes: [attr("class", "ServiceClass"), attr("seats", "int"), attr("corridor", "intercity?"), attr("businessId", "UUID?")],
    methods: [
      method("addStop(place)", "ExtraStop", "Adds a stop and reprices before confirm."),
      method("schedule(when)", "RideRequest", "Reserve flow. Supply is checked for that window."),
      method("forGuest(rider)", "GuestRider", "Booker and passenger are different people."),
    ],
  },
  {
    id: "ridePreference", packageId: "booking", name: "RidePreference", stereotype: "value",
    summary: "Quiet ride, child seat, pet, access time, and Shield defaults.",
    attributes: [attr("quiet", "boolean"), attr("childSeat", "boolean"), attr("pet", "boolean"), attr("shield", "boolean")],
    methods: [method("apply(class)", "ServiceClass", "Shield turns share and PIN on by default.")],
  },
  {
    id: "extraStop", packageId: "booking", name: "ExtraStop", stereotype: "value",
    summary: "A waypoint between pickup and destination.",
    attributes: [attr("sequence", "int"), attr("placeId", "UUID"), attr("dwellMin", "int")],
    methods: [method("reorder(index)", "void", "Updates the route and the fare.")],
  },
  {
    id: "rideOffer", packageId: "booking", name: "RideOffer", stereotype: "entity",
    summary: "A driver's price for a passenger offer. The passenger chooses one.",
    attributes: [attr("amount", "Money"), attr("etaMin", "int"), attr("state", "pending | chosen | expired"), attr("driverId", "UUID")],
    methods: [
      method("submit(amount)", "RideOffer", "Rejected when amount is under the floor."),
      method("choose()", "Trip", "The other offers expire."),
    ],
  },
  {
    id: "guestRider", packageId: "booking", name: "GuestRider", stereotype: "value",
    summary: "The person travelling when someone else booked.",
    attributes: [attr("name", "string"), attr("phone", "E164"), attr("consent", "boolean")],
    methods: [method("canTrack()", "boolean", "Booker sees progress. Guest history stays limited.")],
  },
  {
    id: "serviceClass", packageId: "booking", name: "ServiceClass", stereotype: "enum",
    summary: "Ryde, Comfort, XL, Executive, Green, Moto, Keke, Scooter, E-bike, Pet, Access, Shield.",
    attributes: [attr("code", "string"), attr("capacity", "int"), attr("multiplier", "decimal")],
    methods: [method("eligible(vehicle)", "boolean", "Driver and vehicle must match the class.")],
  },
  {
    id: "trip", packageId: "trip", name: "Trip", stereotype: "entity",
    summary: "An accepted journey. Owns the PIN, the route events, and the receipt.",
    attributes: [attr("state", "assigned | arrived | started | ended"), attr("startedAt", "Instant?"), attr("fare", "Money"), attr("driverId", "UUID")],
    methods: [
      method("arrive()", "TripEvent", "Marks arrival at the landmark."),
      method("start(pin)", "void", "PIN must match and must be unused."),
      method("complete()", "Receipt", "Closes the route and opens rating."),
    ],
  },
  {
    id: "tripPin", packageId: "trip", name: "TripPin", stereotype: "value",
    summary: "Four digits for this trip only. Shown to the rider and the assigned driver.",
    attributes: [attr("code", "secret"), attr("expiresAt", "Instant"), attr("used", "boolean")],
    methods: [method("verify(code)", "boolean", "Fails closed. A used PIN cannot restart a trip.")],
  },
  {
    id: "tripShare", packageId: "trip", name: "TripShare", stereotype: "entity",
    summary: "Live status for one trusted contact. Ends with the trip.",
    attributes: [attr("contactId", "UUID"), attr("active", "boolean"), attr("scope", "status | route")],
    methods: [method("stop()", "void", "Revokes the link immediately.")],
  },
  {
    id: "tripEvent", packageId: "trip", name: "TripEvent", stereotype: "entity",
    summary: "Assigned, arrived, pin verified, started, stop reached, completed, cancelled.",
    attributes: [attr("type", "EventType"), attr("at", "Instant"), attr("actor", "UUID")],
    methods: [method("append()", "void", "Immutable. Corrections are new events.")],
  },
  {
    id: "cancellation", packageId: "trip", name: "Cancellation", stereotype: "entity",
    summary: "Who cancelled, the published reason, and any fee.",
    attributes: [attr("by", "rider | driver | system"), attr("reason", "string"), attr("fee", "Money")],
    methods: [method("waive(reason)", "void", "A human can waive a fee and must say why.")],
  },
  {
    id: "rating", packageId: "trip", name: "Rating", stereotype: "entity",
    summary: "Stars and an optional note, from rider to driver or the reverse.",
    attributes: [attr("stars", "1..5"), attr("note", "string"), attr("direction", "toDriver | toRider")],
    methods: [method("flag()", "Case", "A rating can open a case. It does not itself block an account.")],
  },
  {
    id: "receipt", packageId: "trip", name: "Receipt", stereotype: "value",
    summary: "The fare the person was shown, plus fees, promo, tip, and commission.",
    attributes: [attr("lines", "MoneyLine[]"), attr("total", "Money"), attr("commission", "Money")],
    methods: [method("explain()", "string", "Each line has a name. Estimates are labelled.")],
  },
  {
    id: "vehicle", packageId: "fleet", name: "Vehicle", stereotype: "entity",
    summary: "Car, moto, keke, scooter, e-bike, van, or truck. Riders see plate and class, not documents.",
    attributes: [attr("plate", "string"), attr("kind", "VehicleKind"), attr("color", "string"), attr("classes", "ServiceClass[]")],
    methods: [method("matches(class)", "boolean", "Used by dispatch before an offer is shown.")],
  },
  {
    id: "complianceDocument", packageId: "fleet", name: "ComplianceDocument", stereotype: "entity",
    summary: "Licence, vehicle papers, or inspection. Stored for review, never shown to riders.",
    attributes: [attr("kind", "DocKind"), attr("expiresOn", "Date"), attr("status", "pending | valid | expired")],
    methods: [method("submit(file)", "void", "Encrypted at rest. Access is role-limited.")],
  },
  {
    id: "availabilityShift", packageId: "fleet", name: "AvailabilityShift", stereotype: "entity",
    summary: "The window a driver is online, and the zone they are working.",
    attributes: [attr("onlineAt", "Instant"), attr("zone", "Zone"), attr("paused", "boolean")],
    methods: [method("pause(reason)", "void", "A break does not lower the driver's standing.")],
  },
  {
    id: "rentalSession", packageId: "fleet", name: "RentalSession", stereotype: "entity",
    summary: "Self-drive hire for a fixed number of hours from a landmark.",
    attributes: [attr("hours", "4 | 8 | 24"), attr("vehicleId", "UUID"), attr("startedAt", "Instant?")],
    methods: [method("handover(pin)", "void", "The hirer confirms the vehicle with a PIN.")],
  },
  {
    id: "destinationFilter", packageId: "fleet", name: "DestinationFilter", stereotype: "value",
    summary: "Driver is heading home or to a chosen area. Requests outside it are not a penalty.",
    attributes: [attr("target", "Place"), attr("until", "Instant"), attr("active", "boolean")],
    methods: [method("enable(place)", "void", "Dispatch filters. Rating and tier do not change.")],
  },
  {
    id: "fareQuote", packageId: "pricing", name: "FareQuote", stereotype: "value",
    summary: "Upfront estimate: class, distance, surge, stops, fees, and promo.",
    attributes: [attr("recommended", "Money"), attr("minimum", "Money"), attr("surge", "decimal"), attr("lines", "MoneyLine[]")],
    methods: [
      method("explain()", "MoneyLine[]", "Shown before confirmation."),
      method("lock()", "FareQuote", "The confirmed fare is what the receipt starts from."),
    ],
  },
  {
    id: "surgeRule", packageId: "pricing", name: "SurgeRule", stereotype: "entity",
    summary: "A corridor and a multiplier. The alert is shown before anyone books.",
    attributes: [attr("zone", "Zone"), attr("multiplier", "decimal"), attr("reason", "string")],
    methods: [method("applies(place)", "boolean", "Airports and other published peaks.")],
  },
  {
    id: "commissionRule", packageId: "pricing", name: "CommissionRule", stereotype: "value",
    summary: "The platform percentage quoted to the driver at onboarding.",
    attributes: [attr("percent", "decimal"), attr("label", "string"), attr("effectiveOn", "Date")],
    methods: [method("apply(fare)", "Money", "Itemised on True Earnings. Not hidden in the gross.")],
  },
  {
    id: "promoCode", packageId: "pricing", name: "PromoCode", stereotype: "entity",
    summary: "A capped discount. Referral rewards use the same shape.",
    attributes: [attr("code", "string"), attr("amount", "Money"), attr("cap", "Money"), attr("uses", "int")],
    methods: [method("redeem(order)", "Money", "One line on the quote. Fraud rules can refuse it.")],
  },
  {
    id: "paymentMethod", packageId: "payments", name: "PaymentMethod", stereotype: "entity",
    summary: "Cash, card, wallet, transfer, a company invoice, or Still Play as a third-party payment.",
    attributes: [attr("kind", "cash | card | wallet | transfer | invoice | stillplay"), attr("label", "string"), attr("providerRef", "string?")],
    methods: [method("chargeable()", "boolean", "Live funds wait for an authorised provider.")],
  },
  {
    id: "payment", packageId: "payments", name: "Payment", stereotype: "entity",
    summary: "Money captured, owed, or refunded for one order.",
    attributes: [attr("amount", "Money"), attr("status", "pending | captured | refunded"), attr("tip", "Money")],
    methods: [
      method("capture()", "Payment", "Provider reference is stored."),
      method("refund(amount)", "Payment", "A reason is required."),
    ],
  },
  {
    id: "wallet", packageId: "payments", name: "Wallet", stereotype: "entity",
    summary: "Stored value for a rider or a driver's payable balance.",
    attributes: [attr("balance", "Money"), attr("currency", "NGN"), attr("ownerId", "UUID")],
    methods: [method("topUp(amount)", "Payment", "Through the payment provider, not as an internal float held casually.")],
  },
  {
    id: "payout", packageId: "payments", name: "Payout", stereotype: "entity",
    summary: "What a driver is owed after commission, with each deduction named.",
    attributes: [attr("gross", "Money"), attr("commission", "Money"), attr("net", "Money"), attr("status", "scheduled | paid")],
    methods: [method("reconcile(trips)", "Payout", "Ties the payout to trip receipts.")],
  },
  {
    id: "invoice", packageId: "payments", name: "Invoice", stereotype: "entity",
    summary: "A company's trips for a period, billed on agreed terms.",
    attributes: [attr("period", "Month"), attr("total", "Money"), attr("dueOn", "Date"), attr("accountId", "UUID")],
    methods: [method("issue()", "Invoice", "Locks the lines. Later trips go to the next invoice.")],
  },
  {
    id: "caseFile", packageId: "promise", name: "Case", stereotype: "entity",
    summary: "A complaint, safety report, lost item, or partner problem, with a public reference.",
    attributes: [attr("reference", "string"), attr("urgency", "routine | high"), attr("status", "CaseStatus"), attr("ownerId", "UUID")],
    methods: [
      method("acknowledge()", "Case", "Target for routine cases is five minutes when staffed."),
      method("decide(policy)", "Decision", "The reason is stored and shown."),
      method("close()", "void", "Asks for a short feedback note."),
    ],
  },
  {
    id: "caseEvent", packageId: "promise", name: "CaseEvent", stereotype: "entity",
    summary: "Submitted, acknowledged, under review, decision, appeal, closed.",
    attributes: [attr("stage", "CaseStage"), attr("at", "Instant"), attr("note", "string")],
    methods: [method("visibleTo(user)", "boolean", "Parties see status. Internal notes stay internal.")],
  },
  {
    id: "evidence", packageId: "promise", name: "Evidence", stereotype: "entity",
    summary: "A photo, note, or trip excerpt attached to a case. Access is limited.",
    attributes: [attr("kind", "note | photo | log"), attr("uri", "secret"), attr("addedBy", "UUID")],
    methods: [method("redact()", "void", "Removes data that should not have been attached.")],
  },
  {
    id: "appeal", packageId: "promise", name: "Appeal", stereotype: "entity",
    summary: "A second look by someone who did not make the first decision.",
    attributes: [attr("reason", "string"), attr("reviewerId", "UUID"), attr("outcome", "upheld | changed")],
    methods: [method("lodge()", "Appeal", "Sends a receipt and a target time.")],
  },
  {
    id: "earningsStatement", packageId: "drivercare", name: "EarningsStatement", stereotype: "value",
    summary: "Gross, commission, bonuses, deductions, and estimated take-home before vehicle costs.",
    attributes: [attr("gross", "Money"), attr("commission", "Money"), attr("bonus", "Money"), attr("estimate", "boolean")],
    methods: [method("labelEstimates()", "void", "Never presents an estimate as guaranteed profit.")],
  },
  {
    id: "costEntry", packageId: "drivercare", name: "CostEntry", stereotype: "entity",
    summary: "Optional log: fuel, repairs, tyres, data.",
    attributes: [attr("kind", "fuel | repair | tyre | data"), attr("amount", "Money"), attr("on", "Date")],
    methods: [method("add()", "CostEntry", "Private to the driver unless they attach it to a case.")],
  },
  {
    id: "partner", packageId: "drivercare", name: "Partner", stereotype: "entity",
    summary: "A vetted garage, tyre shop, car wash, clinic, or fuel station.",
    attributes: [attr("name", "string"), attr("services", "string[]"), attr("terms", "string"), attr("status", "vetted | paused")],
    methods: [method("rate(stars)", "void", "Drivers can report a bad job, which opens a case.")],
  },
  {
    id: "fuelOffer", packageId: "drivercare", name: "FuelOffer", stereotype: "entity",
    summary: "A single-use code for one station visit. Optional. No penalty for fuelling elsewhere.",
    attributes: [attr("code", "string"), attr("stationId", "UUID"), attr("mechanism", "discount | voucher | card"), attr("state", "issued | redeemed | void")],
    methods: [method("redeem()", "Redemption", "Station staff validate it with poor connectivity in mind.")],
  },
  {
    id: "redemption", packageId: "drivercare", name: "Redemption", stereotype: "entity",
    summary: "Litres or amount, and the saving, written back to the cost log.",
    attributes: [attr("litres", "decimal"), attr("paid", "Money"), attr("saved", "Money")],
    methods: [method("reconcile()", "void", "Operations match redemptions with the partner on a cycle.")],
  },
  {
    id: "deliveryOrder", packageId: "delivery", name: "DeliveryOrder", abstract: true, stereotype: "entity",
    summary: "Something moved that is not a seat: parcel, load, meal, or groceries.",
    attributes: [attr("recipient", "string"), attr("weightKg", "decimal?"), attr("note", "string")],
    methods: [method("dispatch()", "Trip", "Uses the same driver assignment and tracking as a ride.")],
  },
  {
    id: "courierOrder", packageId: "delivery", name: "CourierOrder", stereotype: "entity",
    summary: "Envelope, small, medium, or large parcel between two landmarks.",
    attributes: [attr("size", "envelope | small | medium | large"), attr("recipientPhone", "E164")],
    methods: [method("proof()", "TripEvent", "Delivery is a trip event, not a separate silent status.")],
  },
  {
    id: "freightOrder", packageId: "delivery", name: "FreightOrder", stereotype: "entity",
    summary: "A bike, van, or truck haul with a load note.",
    attributes: [attr("body", "bike | van | truck"), attr("loadNote", "string")],
    methods: [method("quoteOrOffer()", "FareQuote | RideOffer", "Upfront or your price, same floor rule.")],
  },
  {
    id: "foodOrder", packageId: "delivery", name: "FoodOrder", stereotype: "entity",
    summary: "Items from a restaurant menu, plus a delivery fee and an ETA.",
    attributes: [attr("merchantId", "UUID"), attr("items", "MenuItem[]"), attr("etaMin", "int")],
    methods: [method("place()", "FoodOrder", "Price is the menu plus delivery, shown before confirm.")],
  },
  {
    id: "groceryOrder", packageId: "delivery", name: "GroceryOrder", stereotype: "entity",
    summary: "Staples from a partner shelf.",
    attributes: [attr("items", "MenuItem[]"), attr("substitution", "allow | refuse")],
    methods: [method("place()", "GroceryOrder", "Empty baskets are refused.")],
  },
  {
    id: "merchant", packageId: "delivery", name: "Merchant", stereotype: "entity",
    summary: "A restaurant or grocery partner with hours and a landmark.",
    attributes: [attr("name", "string"), attr("kind", "food | grocery"), attr("hours", "string"), attr("landmarkId", "UUID")],
    methods: [method("available(now)", "boolean", "Closed kitchens do not take orders.")],
  },
  {
    id: "menuItem", packageId: "delivery", name: "MenuItem", stereotype: "value",
    summary: "A dish or a staple with a price.",
    attributes: [attr("name", "string"), attr("price", "Money"), attr("available", "boolean")],
    methods: [method("priceOf()", "Money", "Menu price is not surged by the ride corridor.")],
  },
  {
    id: "businessAccount", packageId: "business", name: "BusinessAccount", stereotype: "entity",
    summary: "A company that books staff trips and receives one invoice.",
    attributes: [attr("name", "string"), attr("terms", "NetDays"), attr("status", "trial | live")],
    methods: [method("bookFor(member)", "RideRequest", "The employee still gets PIN and share.")],
  },
  {
    id: "costCenter", packageId: "business", name: "CostCenter", stereotype: "entity",
    summary: "Where a company's trip is charged.",
    attributes: [attr("code", "string"), attr("name", "string"), attr("monthlyCap", "Money?")],
    methods: [method("charge(trip)", "void", "Refuses the booking when a cap is exhausted.")],
  },
  {
    id: "businessMember", packageId: "business", name: "BusinessMember", stereotype: "entity",
    summary: "An employee who can book on the company account.",
    attributes: [attr("passengerId", "UUID"), attr("role", "rider | admin"), attr("centerId", "UUID")],
    methods: [method("canBook()", "boolean", "Admins can book for other staff.")],
  },
  {
    id: "splitGroup", packageId: "business", name: "SplitGroup", stereotype: "entity",
    summary: "Two or more riders sharing one fare. Shares are visible before the trip.",
    attributes: [attr("shares", "Money[]"), attr("status", "pending | collected")],
    methods: [method("allocate(total)", "Money[]", "The trip total does not change. Collection can fail per person.")],
  },
  {
    id: "incidentReport", packageId: "safety", name: "IncidentReport", stereotype: "entity",
    summary: "Category, urgency, description, and only the evidence the reporter chooses to add.",
    attributes: [attr("category", "string"), attr("urgency", "routine | high"), attr("narrative", "string")],
    methods: [method("file()", "Case", "High urgency pages a human. It does not auto-block an account.")],
  },
  {
    id: "sosEvent", packageId: "safety", name: "SosEvent", stereotype: "entity",
    summary: "The orange SOS control. Opens a high-urgency case and alerts the trusted contact.",
    attributes: [attr("tripId", "UUID"), attr("at", "Instant"), attr("source", "rider | driver")],
    methods: [method("raise()", "Case", "Support and the trusted contact are notified. Location stays on the trip.")],
  },
  {
    id: "zone", packageId: "platform", name: "Zone", stereotype: "entity",
    summary: "A pilot city and the operating area inside it. Abuja and Lagos are the first two.",
    attributes: [attr("city", "Abuja | Lagos"), attr("name", "string"), attr("active", "boolean")],
    methods: [method("covers(place)", "boolean", "Requests outside the zone are refused with a clear message.")],
  },
  {
    id: "demandCell", packageId: "platform", name: "DemandCell", stereotype: "entity",
    summary: "A map cell drivers can read. Guidance, not a secret score.",
    attributes: [attr("zone", "Zone"), attr("level", "low | busy"), attr("at", "Instant")],
    methods: [method("publish()", "void", "Shown on the driver demand map.")],
  },
  {
    id: "notification", packageId: "platform", name: "Notification", stereotype: "entity",
    summary: "Push, with SMS or voice when the device is offline.",
    attributes: [attr("channel", "push | sms | voice"), attr("template", "string"), attr("sentAt", "Instant?")],
    methods: [method("send()", "void", "Consent and cost are checked first.")],
  },
  {
    id: "referral", packageId: "platform", name: "Referral", stereotype: "entity",
    summary: "An invite that pays only after a real completed ride, with a cap.",
    attributes: [attr("code", "string"), attr("reward", "Money"), attr("qualified", "boolean")],
    methods: [method("qualify(trip)", "PromoCode", "Refuses self-referrals and unfinished trips.")],
  },
  {
    id: "auditEntry", packageId: "platform", name: "AuditEntry", stereotype: "entity",
    summary: "Who changed a case, a landmark, a document decision, or a permission.",
    attributes: [attr("actorId", "UUID"), attr("action", "string"), attr("at", "Instant"), attr("subject", "string")],
    methods: [method("write()", "void", "Append-only.")],
  },
  {
    id: "authService", packageId: "services", name: "AuthService", stereotype: "service",
    summary: "Sign-in, recovery, and MFA for staff.",
    attributes: [],
    collaborates: ["user", "session", "staff"],
    methods: [
      method("verifyPhone(phone)", "Session", "Sends a one-time code."),
      method("requireMfa(staff)", "void", "Blocks privileged tools until MFA passes."),
    ],
  },
  {
    id: "localIqService", packageId: "services", name: "LocalIqService", stereotype: "service",
    summary: "Landmark search, notes, and the moderation queue.",
    attributes: [],
    collaborates: ["landmark", "pickupInstruction", "landmarkReport"],
    methods: [
      method("search(query, zone)", "Landmark[]", "Curated landmarks first."),
      method("fileReport(reason)", "LandmarkReport", "Does not overwrite a live note."),
    ],
  },
  {
    id: "pricingService", packageId: "services", name: "PricingService", stereotype: "service",
    summary: "Upfront fares, surge, the offer floor, and promos.",
    attributes: [],
    collaborates: ["fareQuote", "surgeRule", "commissionRule", "promoCode"],
    methods: [
      method("quote(order)", "FareQuote", "Itemised before confirm."),
      method("floor(quote)", "Money", "Passenger offers under this are refused."),
    ],
  },
  {
    id: "offerService", packageId: "services", name: "OfferService", stereotype: "service",
    summary: "Collects driver counters and lets the rider choose.",
    attributes: [],
    collaborates: ["rideOffer", "rideRequest", "driver"],
    methods: [
      method("open(request)", "void", "Broadcasts to eligible drivers."),
      method("choose(offer)", "Trip", "Expires the rest."),
    ],
  },
  {
    id: "dispatchService", packageId: "services", name: "DispatchService", stereotype: "service",
    summary: "Matches a request to a driver and vehicle in the zone.",
    attributes: [],
    collaborates: ["rideRequest", "driver", "vehicle", "trip"],
    methods: [
      method("assign(request, driver)", "Trip", "Checks class, documents, and destination filter."),
      method("reassign(trip)", "Trip", "If the first driver cancels before pickup."),
    ],
  },
  {
    id: "tripService", packageId: "services", name: "TripService", stereotype: "service",
    summary: "Arrival, PIN, share, stops, and completion.",
    attributes: [],
    collaborates: ["trip", "tripPin", "tripShare", "receipt"],
    methods: [
      method("startWithPin(trip, pin)", "void", "Rejects a wrong or reused PIN."),
      method("share(trip, contact)", "TripShare", "Stops automatically when the trip ends."),
    ],
  },
  {
    id: "paymentService", packageId: "services", name: "PaymentService", stereotype: "service",
    summary: "Capture, tip, split, refund, invoice, and payout.",
    attributes: [],
    collaborates: ["payment", "wallet", "payout", "invoice", "splitGroup"],
    methods: [
      method("capture(trip, method)", "Payment", "Hands live funds to the provider."),
      method("split(trip, group)", "SplitGroup", "Shows each share before collection."),
    ],
  },
  {
    id: "caseTrackService", packageId: "services", name: "CaseTrackService", stereotype: "service",
    summary: "References, deadlines, decisions, and appeals.",
    attributes: [],
    collaborates: ["caseFile", "caseEvent", "appeal", "evidence"],
    methods: [
      method("open(kind, urgency)", "Case", "Returns a reference immediately."),
      method("appeal(case, reason)", "Appeal", "Reviewer is not the first decider when that is possible."),
    ],
  },
  {
    id: "driverCareService", packageId: "services", name: "DriverCareService", stereotype: "service",
    summary: "Earnings view, cost log, and partner fuel codes.",
    attributes: [],
    collaborates: ["earningsStatement", "fuelOffer", "partner", "redemption"],
    methods: [
      method("statement(driver, week)", "EarningsStatement", "Labels every estimate."),
      method("issueFuelCode(driver, station)", "FuelOffer", "Single use. Skipping it has no penalty."),
    ],
  },
  {
    id: "deliveryService", packageId: "services", name: "DeliveryService", stereotype: "service",
    summary: "Courier, freight, food, and grocery on the ride dispatch path.",
    attributes: [],
    collaborates: ["courierOrder", "freightOrder", "foodOrder", "groceryOrder"],
    methods: [
      method("place(order)", "DeliveryOrder", "Refuses a closed merchant or an empty basket."),
      method("track(order)", "Trip", "Same map and events as a passenger trip."),
    ],
  },
  {
    id: "safetyService", packageId: "services", name: "SafetyService", stereotype: "service",
    summary: "SOS, incidents, and escalation to a person.",
    attributes: [],
    collaborates: ["sosEvent", "incidentReport", "caseFile", "trustedContact"],
    methods: [method("raiseSos(trip, actor)", "Case", "High urgency. Notifies support and the trusted contact.")],
  },
  {
    id: "notificationService", packageId: "services", name: "NotificationService", stereotype: "service",
    summary: "Push first, SMS or voice when the network drops.",
    attributes: [],
    collaborates: ["notification", "user"],
    methods: [method("push(user, template)", "Notification", "Falls back when push is not delivered.")],
  },
  {
    id: "verificationService", packageId: "services", name: "VerificationService", stereotype: "service",
    summary: "NIN for every rider and driver, then licence and vehicle papers for people who earn.",
    attributes: [],
    collaborates: ["ninVerification", "complianceDocument", "passenger", "driver", "vehicle"],
    methods: [
      method("checkNin(user)", "NinVerification", "Required before a rider books or a driver goes online."),
      method("activate(driver)", "void", "Refuses a shift while the NIN check or a required vehicle paper is open."),
    ],
  },
  {
    id: "businessService", packageId: "services", name: "BusinessService", stereotype: "service",
    summary: "Company booking permissions and the monthly invoice.",
    attributes: [],
    collaborates: ["businessAccount", "costCenter", "invoice"],
    methods: [method("invoiceMonth(account)", "Invoice", "Only completed trips. Caps are enforced at booking.")],
  },
];

export const relations: UmlRelation[] = [
  { id: "p-ext", kind: "extends", from: "passenger", to: "user", label: "extends" },
  { id: "d-ext", kind: "extends", from: "driver", to: "user", label: "extends" },
  { id: "s-ext", kind: "extends", from: "staff", to: "user", label: "extends" },
  { id: "u-sess", kind: "composition", from: "user", to: "session", label: "sessions 1—*" },
  { id: "p-trust", kind: "composition", from: "passenger", to: "trustedContact", label: "contacts 1—*" },
  { id: "u-priv", kind: "composition", from: "user", to: "privacySetting", label: "privacy 1—1" },
  { id: "u-nin", kind: "composition", from: "user", to: "ninVerification", label: "nin 1—1" },
  { id: "lm-ext", kind: "extends", from: "landmark", to: "place", label: "extends" },
  { id: "lm-note", kind: "composition", from: "landmark", to: "pickupInstruction", label: "notes 1—*" },
  { id: "lm-rep", kind: "composition", from: "landmark", to: "landmarkReport", label: "reports 1—*" },
  { id: "sv-lm", kind: "association", from: "savedPlace", to: "landmark", label: "points at" },
  { id: "rr-ext", kind: "extends", from: "rideRequest", to: "mobilityOrder", label: "extends" },
  { id: "rr-pref", kind: "composition", from: "rideRequest", to: "ridePreference", label: "preferences 1—1" },
  { id: "rr-stop", kind: "composition", from: "rideRequest", to: "extraStop", label: "stops 0—*" },
  { id: "rr-off", kind: "composition", from: "rideRequest", to: "rideOffer", label: "offers 0—*" },
  { id: "rr-guest", kind: "association", from: "rideRequest", to: "guestRider", label: "guest 0—1" },
  { id: "rr-class", kind: "association", from: "rideRequest", to: "serviceClass", label: "class" },
  { id: "t-pin", kind: "composition", from: "trip", to: "tripPin", label: "PIN 1—1" },
  { id: "t-share", kind: "composition", from: "trip", to: "tripShare", label: "share 0—1" },
  { id: "t-ev", kind: "composition", from: "trip", to: "tripEvent", label: "events 1—*" },
  { id: "t-can", kind: "association", from: "trip", to: "cancellation", label: "cancel 0—1" },
  { id: "t-rate", kind: "association", from: "trip", to: "rating", label: "ratings 0—2" },
  { id: "t-rec", kind: "composition", from: "trip", to: "receipt", label: "receipt 1—1" },
  { id: "v-doc", kind: "composition", from: "vehicle", to: "complianceDocument", label: "documents 1—*" },
  { id: "v-rent", kind: "association", from: "vehicle", to: "rentalSession", label: "hire 0—*" },
  { id: "shift-v", kind: "association", from: "availabilityShift", to: "vehicle", label: "uses" },
  { id: "dest-shift", kind: "association", from: "destinationFilter", to: "availabilityShift", label: "limits" },
  { id: "q-surge", kind: "association", from: "fareQuote", to: "surgeRule", label: "surge 0—1" },
  { id: "q-com", kind: "association", from: "fareQuote", to: "commissionRule", label: "commission" },
  { id: "q-promo", kind: "association", from: "fareQuote", to: "promoCode", label: "promo 0—1" },
  { id: "pay-method", kind: "association", from: "payment", to: "paymentMethod", label: "via" },
  { id: "wal-method", kind: "aggregation", from: "wallet", to: "paymentMethod", label: "methods" },
  { id: "pay-wal", kind: "association", from: "payment", to: "wallet", label: "wallet 0—1" },
  { id: "out-wal", kind: "association", from: "payout", to: "wallet", label: "pays into" },
  { id: "inv-pay", kind: "association", from: "invoice", to: "payment", label: "collects *" },
  { id: "c-ev", kind: "composition", from: "caseFile", to: "caseEvent", label: "timeline 1—*" },
  { id: "c-evi", kind: "aggregation", from: "caseFile", to: "evidence", label: "evidence 0—*" },
  { id: "c-app", kind: "association", from: "caseFile", to: "appeal", label: "appeal 0—1" },
  { id: "earn-cost", kind: "association", from: "earningsStatement", to: "costEntry", label: "optional log" },
  { id: "par-fuel", kind: "composition", from: "partner", to: "fuelOffer", label: "offers 0—*" },
  { id: "fuel-red", kind: "association", from: "fuelOffer", to: "redemption", label: "redeemed 0—1" },
  { id: "earn-red", kind: "association", from: "earningsStatement", to: "redemption", label: "shows saving" },
  { id: "del-ext", kind: "extends", from: "deliveryOrder", to: "mobilityOrder", label: "extends" },
  { id: "cou-ext", kind: "extends", from: "courierOrder", to: "deliveryOrder", label: "extends" },
  { id: "fr-ext", kind: "extends", from: "freightOrder", to: "deliveryOrder", label: "extends" },
  { id: "food-ext", kind: "extends", from: "foodOrder", to: "deliveryOrder", label: "extends" },
  { id: "gro-ext", kind: "extends", from: "groceryOrder", to: "deliveryOrder", label: "extends" },
  { id: "food-m", kind: "association", from: "foodOrder", to: "merchant", label: "from" },
  { id: "gro-m", kind: "association", from: "groceryOrder", to: "merchant", label: "from" },
  { id: "m-item", kind: "composition", from: "merchant", to: "menuItem", label: "items 1—*" },
  { id: "biz-cc", kind: "composition", from: "businessAccount", to: "costCenter", label: "centers 1—*" },
  { id: "biz-mem", kind: "composition", from: "businessAccount", to: "businessMember", label: "members 1—*" },
  { id: "biz-split", kind: "association", from: "businessAccount", to: "splitGroup", label: "may split" },
  { id: "sos-inc", kind: "association", from: "sosEvent", to: "incidentReport", label: "opens" },
  { id: "cell-z", kind: "association", from: "demandCell", to: "zone", label: "in" },
  { id: "ref-note", kind: "association", from: "referral", to: "notification", label: "reward notice" },
  { id: "aud-note", kind: "association", from: "auditEntry", to: "notification", label: "may alert" },
  { id: "svc-disp-off", kind: "dependency", from: "dispatchService", to: "offerService", label: "uses" },
  { id: "svc-disp-price", kind: "dependency", from: "dispatchService", to: "pricingService", label: "uses" },
  { id: "svc-trip-disp", kind: "dependency", from: "tripService", to: "dispatchService", label: "uses" },
  { id: "svc-pay-trip", kind: "dependency", from: "paymentService", to: "tripService", label: "uses" },
  { id: "svc-case-trip", kind: "dependency", from: "caseTrackService", to: "tripService", label: "uses" },
  { id: "svc-care-pay", kind: "dependency", from: "driverCareService", to: "paymentService", label: "uses" },
  { id: "svc-del-disp", kind: "dependency", from: "deliveryService", to: "dispatchService", label: "uses" },
  { id: "svc-safe-case", kind: "dependency", from: "safetyService", to: "caseTrackService", label: "uses" },
  { id: "svc-note-trip", kind: "dependency", from: "notificationService", to: "tripService", label: "uses" },
  { id: "svc-ver-auth", kind: "dependency", from: "verificationService", to: "authService", label: "uses" },
  { id: "svc-ver-nin", kind: "dependency", from: "verificationService", to: "ninVerification", label: "checks" },
  { id: "svc-biz-pay", kind: "dependency", from: "businessService", to: "paymentService", label: "uses" },
  { id: "j-p-rr", kind: "association", from: "passenger", to: "rideRequest", label: "places" },
  { id: "j-rr-lm", kind: "association", from: "rideRequest", to: "landmark", label: "pickup at" },
  { id: "j-rr-q", kind: "composition", from: "rideRequest", to: "fareQuote", label: "quoted" },
  { id: "j-d-off", kind: "association", from: "driver", to: "rideOffer", label: "counters" },
  { id: "j-d-v", kind: "aggregation", from: "driver", to: "vehicle", label: "drives" },
  { id: "j-rr-t", kind: "association", from: "rideRequest", to: "trip", label: "becomes" },
  { id: "j-t-d", kind: "association", from: "trip", to: "driver", label: "assigned" },
  { id: "j-t-v", kind: "association", from: "trip", to: "vehicle", label: "uses" },
  { id: "j-t-pay", kind: "association", from: "trip", to: "payment", label: "settles" },
  { id: "j-t-c", kind: "association", from: "trip", to: "caseFile", label: "may open" },
  { id: "j-d-earn", kind: "association", from: "driver", to: "earningsStatement", label: "earnings" },
  { id: "j-p-pay", kind: "association", from: "passenger", to: "payment", label: "pays" },
];

const byId = new Map(classes.map((item) => [item.id, item]));

export function classById(id: string) {
  const found = byId.get(id);
  if (!found) throw new Error(`Unknown class ${id}`);
  return found;
}

export function classesIn(packageId: string) {
  if (packageId === "journey") return journeyOrder.map((id) => classById(id));
  return classes.filter((item) => item.packageId === packageId);
}

export function relationsFor(ids: string[]) {
  const allowed = new Set(ids);
  return relations.filter((relation) => allowed.has(relation.from) && allowed.has(relation.to));
}

export function parentOf(id: string) {
  const relation = relations.find((item) => item.kind === "extends" && item.from === id);
  return relation ? classById(relation.to) : null;
}

export function relationsTouching(id: string) {
  return relations.filter((relation) => relation.from === id || relation.to === id);
}
