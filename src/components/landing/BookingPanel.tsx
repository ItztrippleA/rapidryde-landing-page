"use client";

import AltRoute from "@mui/icons-material/AltRoute";
import CarRental from "@mui/icons-material/CarRental";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRight from "@mui/icons-material/ChevronRight";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Inventory2 from "@mui/icons-material/Inventory2";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Restaurant from "@mui/icons-material/Restaurant";
import Schedule from "@mui/icons-material/Schedule";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  groceries,
  placeById,
  placesIn,
  restaurantsIn,
  rideClasses,
  services,
  type Place,
  type ServiceKind,
} from "@/data/catalog";
import { useTheme } from "@mui/material/styles";
import { naira } from "@/lib/money";
import { dropoffChoices, offerModeAllowed, quoteFor } from "@/lib/quote";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";
import { BookRideButton, NeutralButton, SosButton } from "@/components/ui/Actions";

const serviceIcon: Record<ServiceKind, typeof DirectionsCar> = {
  ride: DirectionsCar,
  intercity: AltRoute,
  courier: Inventory2,
  freight: LocalShipping,
  food: Restaurant,
  grocery: ShoppingBagOutlined,
  rental: CarRental,
  reserve: Schedule,
};

const sheetTitle: Record<ServiceKind, string> = {
  ride: "Where to?",
  intercity: "City to city",
  courier: "Send a package",
  freight: "Move a load",
  food: "Order food",
  grocery: "Groceries",
  rental: "Hire a car",
  reserve: "Reserve a ride",
};

export function BookingPanel() {
  const state = useBookingStore();
  const assign = useBookingStore((store) => store.assign);
  const quote = quoteFor(state);
  const [chatOpen, setChatOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const offerAllowed = offerModeAllowed(state.service);
  const maxOffer = Math.max(quote.recommended * 2, quote.minimum + 500);
  const offerAmount = Math.min(maxOffer, Math.max(quote.minimum, state.offerNaira || quote.recommended || quote.minimum));
  const shown = state.fareMode === "offer" && offerAllowed ? offerAmount : quote.total;
  const chosen = state.offers.find((offer) => offer.id === state.chosenOfferId) ?? state.offers[0];

  useEffect(() => {
    if (state.stage !== "searching") return;
    const timer = window.setTimeout(() => assign(), 1300);
    return () => window.clearTimeout(timer);
  }, [state.stage, assign]);

  const rideLike = state.service === "ride" || state.service === "reserve" || state.service === "intercity";
  const stop = state.stopId ? placeById(state.stopId) : undefined;
  const etaLabel = quote.etaMin >= 60 ? `${Math.round(quote.etaMin / 60)} hr` : `${quote.etaMin} min`;

  return (
    <Box id="book" sx={{ height: "100%", minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column", scrollMarginTop: 96 }}>
      {state.stage === "draft" && (
        <Box sx={{ px: 1.75, pt: 0.8, pb: { xs: 0.2, lg: 1 }, flex: "0 0 auto", display: "flex", flexDirection: "column", gap: { xs: 1.5, lg: 1.2 } }}>
          <Box>
            <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 650, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>
              {sheetTitle[state.service]}
            </Typography>
            <Typography variant="caption" color="text.secondary">Estimates only. Nothing is dispatched.</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.6, overflowX: "auto", pb: 0.3, minWidth: 0, maxWidth: "100%", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
            {services.map((service) => {
              const selected = state.service === service.id;
              const Icon = serviceIcon[service.id];
              return (
                <Button
                  key={service.id}
                  type="button"
                  onClick={() => state.setService(service.id)}
                  sx={{
                    flex: "0 0 auto",
                    borderRadius: 999,
                    px: 1.2,
                    py: 0.45,
                    minWidth: 0,
                    gap: 0.5,
                    fontSize: 13,
                    bgcolor: selected ? "text.primary" : "action.hover",
                    color: selected ? "background.default" : "text.primary",
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {service.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      )}

      {state.stage === "draft" ? (
        <Box component="form" onSubmit={(event) => { event.preventDefault(); state.book(); }} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: "auto", overflowX: "hidden" }}>
          <Box sx={{ px: 1.75, pt: { xs: 1.6, lg: 0 }, pb: 1.5, display: "flex", flexDirection: "column", gap: { xs: 1.75, lg: 1.2 } }}>
            {state.service === "food" ? <FoodFields /> : state.service === "grocery" ? <GroceryFields /> : state.service === "rental" ? <RentalFields /> : (
              <Box sx={{ borderRadius: { xs: 0, lg: "14px" }, overflow: "hidden", bgcolor: { xs: "transparent", lg: "action.hover" }, display: "flex", flexDirection: "column", gap: { xs: 1.25, lg: 0 } }}>
                <PlaceField dot="start" label="Pickup" value={state.pickupId} options={placesIn(state.city)} onChange={(id) => state.patch({ pickupId: id })} />
                <PlaceField dot="end" last label={state.service === "courier" || state.service === "freight" ? "Drop-off" : "Destination"} value={state.dropoffId} options={dropoffChoices(state.service, state.city)} onChange={(id) => state.patch({ dropoffId: id })} />
              </Box>
            )}
            {stop && state.stage === "draft" && <Typography variant="body2" color="text.secondary">Via {stop.name}</Typography>}
            {(state.service === "ride" || state.service === "reserve" || state.service === "intercity") && <ClassPicker />}
            {state.service === "courier" && <ChoiceRow label="Parcel" value={state.parcel} options={["envelope", "small", "medium", "large"] as const} onChange={(parcel) => state.patch({ parcel })} />}
            {state.service === "freight" && <ChoiceRow label="Vehicle" value={state.freight} options={["bike", "van", "truck"] as const} onChange={(freight) => state.patch({ freight })} />}
            {offerAllowed && (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", p: 0.4, borderRadius: 999, bgcolor: "action.hover" }}>
                <SelectChip bare selected={state.fareMode === "upfront"} onClick={() => state.patch({ fareMode: "upfront" })}>Upfront fare</SelectChip>
                <SelectChip bare selected={state.fareMode === "offer"} onClick={() => state.patch({ fareMode: "offer" })}>Your price</SelectChip>
              </Box>
            )}
            {state.fareMode === "offer" && offerAllowed && (
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Your offer</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{naira(offerAmount)}</Typography>
                </Box>
                <Slider min={quote.minimum} max={maxOffer} step={50} value={offerAmount} onChange={(_, value) => state.patch({ offerNaira: value as number })} sx={{ color: "text.primary", py: 1 }} aria-label="Your price" />
                <Typography variant="caption" color="text.secondary">Floor {naira(quote.minimum)}. Lower offers are not sent.</Typography>
              </Box>
            )}
            {quote.surge && <SurgeNote multiplier={quote.surgeMultiplier} />}
            <Button type="button" onClick={() => setOptionsOpen((open) => !open)} sx={{ justifyContent: "space-between", px: 0.4, color: "text.primary" }}>
              Trip options
              <ExpandMore sx={{ transform: optionsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </Button>
            <Collapse in={optionsOpen}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1, pb: 0.5 }}>
                {(state.service === "ride" || state.service === "reserve") && (
                  <PlaceField dot="stop" label="Extra stop" value={state.stopId ?? ""} optional options={placesIn(state.city)} onChange={(id) => state.patch({ stopId: id || null })} />
                )}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7 }}>
                  {(state.service === "ride" || state.service === "reserve" || state.service === "intercity") && (
                    <>
                      <SelectChip selected={state.leaveLater || state.service === "reserve"} onClick={() => state.patch({ leaveLater: state.service === "reserve" ? true : !state.leaveLater })}>Leave later</SelectChip>
                      <SelectChip selected={state.forOther} onClick={() => state.patch({ forOther: !state.forOther })}>Someone else</SelectChip>
                      <SelectChip selected={state.quiet} onClick={() => state.patch({ quiet: !state.quiet })}>Quiet</SelectChip>
                      <SelectChip selected={state.childSeat} onClick={() => state.patch({ childSeat: !state.childSeat })}>Child seat</SelectChip>
                      <SelectChip selected={state.splitFare} onClick={() => state.patch({ splitFare: !state.splitFare })}>Split fare</SelectChip>
                    </>
                  )}
                  <SelectChip selected={state.business} onClick={() => state.patch({ business: !state.business, payment: !state.business ? "invoice" : state.payment })}>Company pays</SelectChip>
                </Box>
                {(state.leaveLater || state.service === "reserve") && <TextField size="small" label="Pickup time" type="time" value={state.leaveTime} onChange={(event) => state.patch({ leaveTime: event.target.value })} />}
                {state.forOther && <TextField size="small" label="Rider's name" value={state.guestName} onChange={(event) => state.patch({ guestName: event.target.value })} />}
                {state.business && <TextField size="small" label="Cost center" value={state.costCenter} onChange={(event) => state.patch({ costCenter: event.target.value })} placeholder="e.g. People team" />}
                <TextField size="small" label="Promo" value={state.promo} onChange={(event) => state.patch({ promo: event.target.value })} placeholder="RYDE or RYDE10" />
                <FareLines />
                {state.splitFare && <Typography variant="body2" color="text.secondary">Each person would be asked for {naira(Math.round(shown / 2))}.</Typography>}
                {state.quiet && <Typography variant="body2" color="text.secondary">Driver note: quiet ride.</Typography>}
                <Button type="button" onClick={() => state.openCase("Incorrect landmark")} sx={{ alignSelf: "flex-start", px: 0, color: "text.secondary" }}>
                  Report a bad pin
                </Button>
                {state.history.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Recent previews</Typography>
                    {state.history.map((item) => (
                      <Typography key={item.id} variant="body2">{item.label} · {naira(item.amount)} · PIN {item.id}</Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Collapse>
            </Box>
          </Box>
          <Box sx={{ px: 1.75, pt: { xs: 1.6, lg: 1.1 }, pb: 2.4, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: { xs: 1.5, lg: 1 } }}>
              <Typography variant="body2" color="text.secondary">{quote.distanceKm ? `${quote.distanceKm} km · ` : ""}{etaLabel}</Typography>
              <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontSize: "1.7rem", fontWeight: 650, letterSpacing: "-0.04em" }}>{naira(shown)}</Typography>
            </Box>
            {state.error && <Typography color="error" variant="body2" sx={{ mb: 1 }}>{state.error}</Typography>}
            {rideLike ? <BookRideButton type="submit" fullWidth /> : (
              <NeutralButton type="submit" fullWidth>
                {state.service === "food" || state.service === "grocery" ? "Place order" : state.service === "courier" ? "Send package" : state.service === "freight" ? "Request haul" : "Reserve vehicle"}
              </NeutralButton>
            )}
          </Box>
        </Box>
      ) : (
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1.75, pt: 0.5, pb: 2.5 }}>
      <AnimatePresence mode="wait">
        <motion.div key={state.stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {state.stage === "searching" && (
            <Box aria-live="polite" sx={{ py: 4 }}>
              <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 650, fontSize: "1.35rem" }}>Finding a driver</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.8, mb: 2.5 }}>Matching a verified driver in the pilot zone.</Typography>
              <LinearProgress sx={{ borderRadius: 99, height: 4 }} />
            </Box>
          )}

          {state.stage === "offers" && (
            <Box aria-live="polite" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 650, fontSize: "1.35rem" }}>Choose a driver</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>Sample offers. Tap one to open the trip.</Typography>
              {state.offers.map((offer) => (
                <Button key={offer.id} type="button" onClick={() => state.chooseOffer(offer.id)} sx={{ justifyContent: "flex-start", gap: 1.2, border: "1px solid", borderColor: "divider", borderRadius: "16px", px: 1.3, py: 1.2, color: "text.primary" }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: "50%", bgcolor: "action.hover", display: "grid", placeItems: "center", fontWeight: 700, flex: "0 0 auto" }}>
                    {offer.driver.slice(0, 1)}
                  </Box>
                  <Box sx={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>{offer.driver}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>{offer.vehicle} · {offer.rating} · {offer.etaMin} min</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 750 }}>{naira(offer.amount)}</Typography>
                </Button>
              ))}
              <Button type="button" onClick={state.reset} sx={{ color: "text.secondary", alignSelf: "flex-start", px: 0.5 }}>Back</Button>
            </Box>
          )}

          {state.stage === "assigned" && chosen && (
            <Box aria-live="polite" sx={{ display: "flex", flexDirection: "column", gap: 1.4, pt: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "action.hover", display: "grid", placeItems: "center", fontWeight: 700 }}>{chosen.driver.slice(0, 1)}</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: brand.lemon, boxShadow: `0 0 0 4px ${brand.lemon}33` }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.04em" }}>LIVE</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 750 }}>{chosen.driver}</Typography>
                  <Typography variant="body2" color="text.secondary">{chosen.vehicle} · {chosen.plate}</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 1.6, borderRadius: "18px", bgcolor: "action.hover", textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">Trip PIN</Typography>
                <Typography sx={{ fontFamily: "ui-monospace, monospace", fontSize: "2.1rem", letterSpacing: "0.22em", fontWeight: 700 }}>{state.pin}</Typography>
                <Typography variant="caption" color="text.secondary">Share it with this driver. It expires when the trip starts.</Typography>
              </Box>
              <Typography sx={{ fontWeight: 650 }}>ETA {chosen.etaMin >= 60 ? `${Math.round(chosen.etaMin / 60)} hr` : `${chosen.etaMin} min`} · {naira(chosen.amount + state.tip)}</Typography>
              <Box sx={{ display: "flex", gap: 0.7 }}>
                {[0, 200, 500].map((tip) => (
                  <SelectChip key={tip} selected={state.tip === tip} onClick={() => state.setTip(tip)}>{tip === 0 ? "No tip" : naira(tip)}</SelectChip>
                ))}
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 0.7 }}>
                <Button type="button" onClick={() => setChatOpen(true)} sx={{ border: "1px solid", borderColor: "divider", color: "text.primary", borderRadius: "14px" }}>Chat</Button>
                <Button type="button" onClick={() => setCallOpen(true)} sx={{ border: "1px solid", borderColor: "divider", color: "text.primary", borderRadius: "14px" }}>Call</Button>
                <Button type="button" onClick={() => setShareOpen(true)} sx={{ border: "1px solid", borderColor: "divider", color: "text.primary", borderRadius: "14px" }}>Share</Button>
                <SosButton onClick={() => { state.openCase("SOS"); setSosOpen(true); }} />
              </Box>
              <Button type="button" onClick={state.reset} sx={{ alignSelf: "flex-start", px: 0.5, color: "text.secondary" }}>Cancel request</Button>
              <Typography variant="caption" color="text.secondary">A cancellation fee would apply after assignment. This preview waives it.</Typography>
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
      </Box>
      )}

      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Chat with the sample driver</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {state.messages.map((message) => (
              <Typography key={message.id} sx={{ alignSelf: message.from === "you" ? "flex-end" : "flex-start", bgcolor: "action.hover", px: 1.4, py: 0.8, borderRadius: 2, maxWidth: "90%" }}>
                {message.text}
              </Typography>
            ))}
          </Box>
          <TextField fullWidth label="Message" value={draft} onChange={(event) => setDraft(event.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <NeutralButton onClick={() => { if (draft.trim()) { state.sendChat(draft.trim()); setDraft(""); } }}>Send</NeutralButton>
        </DialogActions>
      </Dialog>
      <Dialog open={callOpen} onClose={() => setCallOpen(false)}>
        <DialogTitle>Masked call</DialogTitle>
        <DialogContent>
          <Typography>In the live app this calls through a masked number. This preview does not place a call.</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setCallOpen(false)}>Close</Button></DialogActions>
      </Dialog>
      <Dialog open={shareOpen} onClose={() => setShareOpen(false)}>
        <DialogTitle>Trip shared</DialogTitle>
        <DialogContent>
          <Typography>Status would go to your trusted contact until the trip ends. No phone numbers are shown here.</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setShareOpen(false)}>Done</Button></DialogActions>
      </Dialog>
      <Dialog open={sosOpen} onClose={() => setSosOpen(false)}>
        <DialogTitle>SOS received</DialogTitle>
        <DialogContent>
          <Typography>Case {state.cases[0]?.id} is acknowledged. In the live app this alerts support and your trusted contact. This preview contacts nobody.</Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setSosOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

function ClassPicker() {
  const rideClass = useBookingStore((state) => state.rideClass);
  const patch = useBookingStore((state) => state.patch);
  const shown = rideClasses.slice(0, rideClasses.findIndex((item) => item.id === "scooter"));
  return (
    <Box sx={{ display: "flex", gap: 0.7, overflowX: "auto", pb: 0.2, minWidth: 0, maxWidth: "100%", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {shown.map((item) => {
        const on = rideClass === item.id;
        return (
          <Button type="button" key={item.id} onClick={() => patch({ rideClass: item.id })} sx={{ flex: "0 0 auto", width: 118, borderRadius: "16px", px: 1.2, py: 1, border: "1px solid", borderColor: on ? "text.primary" : "divider", bgcolor: on ? "action.hover" : "transparent", color: "text.primary" }}>
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{item.label}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.3 }}>{item.blurb}</Typography>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

function FoodFields() {
  const city = useBookingStore((state) => state.city);
  const foodId = useBookingStore((state) => state.foodId);
  const itemId = useBookingStore((state) => state.itemId);
  const patch = useBookingStore((state) => state.patch);
  const spots = restaurantsIn(city);
  const spot = spots.find((item) => item.id === foodId) ?? spots[0];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {spots.map((item) => (
        <SelectChip key={item.id} selected={item.id === spot.id} onClick={() => patch({ foodId: item.id, itemId: item.items[0].id })}>{item.name} · {item.area}</SelectChip>
      ))}
      <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
        {spot.items.map((item) => (
          <SelectChip key={item.id} selected={item.id === itemId} onClick={() => patch({ itemId: item.id })}>{item.name}</SelectChip>
        ))}
      </Box>
      <PlaceField last dot="end" label="Deliver to" value={useBookingStore.getState().pickupId} options={placesIn(city)} onChange={(id) => patch({ pickupId: id })} />
    </Box>
  );
}

function GroceryFields() {
  const city = useBookingStore((state) => state.city);
  const groceryIds = useBookingStore((state) => state.groceryIds);
  const patch = useBookingStore((state) => state.patch);
  const pickupId = useBookingStore((state) => state.pickupId);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
        {groceries.map((item) => {
          const on = groceryIds.includes(item.id);
          return (
            <SelectChip key={item.id} selected={on} onClick={() => patch({ groceryIds: on ? groceryIds.filter((id) => id !== item.id) : [...groceryIds, item.id] })}>
              {item.name}
            </SelectChip>
          );
        })}
      </Box>
      <PlaceField last dot="end" label="Deliver to" value={pickupId} options={placesIn(city)} onChange={(id) => patch({ pickupId: id })} />
    </Box>
  );
}

function RentalFields() {
  const city = useBookingStore((state) => state.city);
  const pickupId = useBookingStore((state) => state.pickupId);
  const hours = useBookingStore((state) => state.rentalHours);
  const rentalClass = useBookingStore((state) => state.rentalClass);
  const patch = useBookingStore((state) => state.patch);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <PlaceField last dot="start" label="Collect at" value={pickupId} options={placesIn(city)} onChange={(id) => patch({ pickupId: id })} />
      <Box sx={{ display: "flex", gap: 0.7 }}>
        {([4, 8, 24] as const).map((value) => (
          <SelectChip key={value} selected={hours === value} onClick={() => patch({ rentalHours: value })}>{value} hours</SelectChip>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 0.7 }}>
        <SelectChip selected={rentalClass === "compact"} onClick={() => patch({ rentalClass: "compact" })}>Compact</SelectChip>
        <SelectChip selected={rentalClass === "suv"} onClick={() => patch({ rentalClass: "suv" })}>SUV</SelectChip>
      </Box>
    </Box>
  );
}

function FareLines() {
  const state = useBookingStore();
  const quote = quoteFor(state);
  return (
    <Box>
      {quote.lines.map((line) => (
        <Box key={line.label} sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
          <Typography variant="body2" color="text.secondary">{line.label}</Typography>
          <Typography variant="body2">{naira(line.amount)}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function SurgeNote({ multiplier }: { multiplier: number }) {
  const dark = useTheme().palette.mode === "dark";
  return (
    <Box role="status" sx={{ bgcolor: dark ? brand.gold : brand.orange, color: dark ? brand.black : brand.orangeInk, px: 1.5, py: 1, borderRadius: 2, fontWeight: 700 }}>
      Surge pricing · {multiplier}× on this corridor. It is already in the estimate.
    </Box>
  );
}

function SelectChip({ selected, onClick, children, bare = false }: { selected: boolean; onClick: () => void; children: React.ReactNode; bare?: boolean }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      sx={{
        borderRadius: 999,
        px: 1.3,
        py: bare ? 0.7 : 0.4,
        minWidth: 0,
        border: bare ? "none" : "1px solid",
        borderColor: selected ? "text.primary" : "divider",
        bgcolor: bare ? (selected ? "background.paper" : "transparent") : selected ? "text.primary" : "transparent",
        color: bare || !selected ? "text.primary" : "background.default",
        width: bare ? "100%" : undefined,
        boxShadow: bare && selected ? "0 1px 3px rgba(16,18,14,0.12)" : "none",
      }}
    >
      {selected && !bare && <CheckIcon sx={{ fontSize: 16, mr: 0.4 }} />}
      {children}
    </Button>
  );
}

function ChoiceRow<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>{label}</Typography>
      <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
        {options.map((option) => (
          <SelectChip key={option} selected={value === option} onClick={() => onChange(option)}>{option}</SelectChip>
        ))}
      </Box>
    </Box>
  );
}

function PlaceField({ label, value, options, onChange, optional = false, dot = "end", last = false }: { label: string; value: string; options: Place[]; onChange: (id: string) => void; optional?: boolean; dot?: "start" | "end" | "stop"; last?: boolean }) {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState<HTMLElement | null>(null);
  const place = options.find((item) => item.id === value);
  const dotColor = dot === "start" ? "text.primary" : dot === "end" ? brand.lemon : "text.secondary";

  useEffect(() => {
    if (!open) return;
    setSheet(document.getElementById("app-sheet"));
  }, [open]);

  function choose(id: string) {
    onChange(id);
    setOpen(false);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} sx={{ display: "flex", width: "100%", justifyContent: "flex-start", gap: 1.4, textAlign: "left", borderRadius: dot === "stop" ? "14px" : { xs: "14px", lg: "0px" }, px: 2, py: 1.35, color: "text.primary", borderBottom: { xs: "none", lg: last || dot === "stop" ? "none" : "1px solid" }, borderColor: "divider", bgcolor: dot === "stop" ? "action.hover" : { xs: "action.hover", lg: "transparent" } }}>
        <Box sx={{ width: 10, height: 10, borderRadius: dot === "end" ? "2px" : "50%", bgcolor: dotColor, flex: "0 0 auto" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>{label}</Typography>
          <Typography noWrap sx={{ fontWeight: 700 }}>{place ? place.name : optional ? "Add a stop" : "Choose"}</Typography>
        </Box>
        <ChevronRight sx={{ color: "text.secondary", fontSize: 20 }} />
      </Button>
      {open && sheet && createPortal(
        <Box sx={{ position: "absolute", inset: 0, zIndex: 4, bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
          <Box sx={{ px: 1.6, pt: 1.4, pb: 0.6, display: "flex", alignItems: "center", justifyContent: "space-between", flex: "0 0 auto" }}>
            <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 650 }}>{label}</Typography>
            <Button type="button" onClick={() => setOpen(false)} sx={{ color: "text.secondary", minWidth: 0 }}>Close</Button>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1, pb: 2.5 }}>
            {optional && (
              <Button type="button" onClick={() => choose("")} sx={{ display: "flex", width: "100%", justifyContent: "flex-start", textAlign: "left", borderRadius: "14px", px: 1.2, py: 1.1, color: "text.primary" }}>
                No extra stop
              </Button>
            )}
            {options.map((option) => (
              <Button key={option.id} type="button" onClick={() => choose(option.id)} sx={{ display: "flex", width: "100%", justifyContent: "flex-start", textAlign: "left", borderRadius: "14px", px: 1.2, py: 1, color: "text.primary", bgcolor: option.id === value ? "action.hover" : "transparent" }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{option.saved ? `${option.saved}: ` : ""}{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{option.area} · {option.note}</Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>,
        sheet,
      )}
    </>
  );
}
