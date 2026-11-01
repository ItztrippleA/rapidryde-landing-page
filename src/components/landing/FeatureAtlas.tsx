"use client";

import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import AccountTree from "@mui/icons-material/AccountTree";
import AddLocationAlt from "@mui/icons-material/AddLocationAlt";
import AirlineSeatReclineExtra from "@mui/icons-material/AirlineSeatReclineExtra";
import AltRoute from "@mui/icons-material/AltRoute";
import Assignment from "@mui/icons-material/Assignment";
import Badge from "@mui/icons-material/Badge";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Build from "@mui/icons-material/Build";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import CallSplit from "@mui/icons-material/CallSplit";
import CarRental from "@mui/icons-material/CarRental";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import ContactPhone from "@mui/icons-material/ContactPhone";
import Description from "@mui/icons-material/Description";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import EditNote from "@mui/icons-material/EditNote";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Flag from "@mui/icons-material/Flag";
import Gavel from "@mui/icons-material/Gavel";
import Group from "@mui/icons-material/Group";
import History from "@mui/icons-material/History";
import Inventory2 from "@mui/icons-material/Inventory2";
import LocalGasStation from "@mui/icons-material/LocalGasStation";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Loyalty from "@mui/icons-material/Loyalty";
import Map from "@mui/icons-material/Map";
import Navigation from "@mui/icons-material/Navigation";
import NearMe from "@mui/icons-material/NearMe";
import Payments from "@mui/icons-material/Payments";
import PersonSearch from "@mui/icons-material/PersonSearch";
import PhoneInTalk from "@mui/icons-material/PhoneInTalk";
import Pin from "@mui/icons-material/Pin";
import Place from "@mui/icons-material/Place";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import Restaurant from "@mui/icons-material/Restaurant";
import Savings from "@mui/icons-material/Savings";
import Schedule from "@mui/icons-material/Schedule";
import Search from "@mui/icons-material/Search";
import Sell from "@mui/icons-material/Sell";
import Share from "@mui/icons-material/Share";
import ShoppingBasket from "@mui/icons-material/ShoppingBasket";
import Sos from "@mui/icons-material/Sos";
import StarBorder from "@mui/icons-material/StarBorder";
import StickyNote2 from "@mui/icons-material/StickyNote2";
import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";
import TrendingUp from "@mui/icons-material/TrendingUp";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import VolumeOff from "@mui/icons-material/VolumeOff";
import type { SvgIconComponent } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { features, type Feature, type FeatureGroup } from "@/data/features";
import { useBookingStore } from "@/store/useBookingStore";
import { brand } from "@/theme/tokens";
import { scrollToBook, EarnWithRapidButton } from "@/components/ui/Actions";

const slides: { id: string; image: string; alt: string; label: string; title: string; body: string; featureId: string; group: FeatureGroup }[] = [
  { id: "ride", image: "/showcase/hero-ride.jpg", alt: "A passenger and driver beside a white sedan on a sunny street", label: "Ride", title: "City rides from a gate you can name.", body: "A car, keke, or bike. The landmark note travels with the request.", featureId: "city", group: "ride" },
  { id: "intercity", image: "/showcase/hero-intercity.jpg", alt: "A sedan on a highway at golden hour", label: "City to city", title: "Abuja to Lagos, on a fare you both accept.", body: "Seat, pickup, and price are settled before the car leaves.", featureId: "intercity", group: "ride" },
  { id: "courier", image: "/showcase/hero-delivery.jpg", alt: "A courier handing a parcel to someone at a doorway", label: "Courier", title: "A parcel, and a door the courier can find.", body: "Envelope to large. Upfront fee, or your price above the floor.", featureId: "courier", group: "delivery" },
  { id: "freight", image: "/showcase/hero-freight.jpg", alt: "Two people loading boxes into a city van", label: "Freight", title: "A bike, a van, or a truck.", body: "The load note and the fare are on the request before anyone accepts.", featureId: "freight", group: "delivery" },
  { id: "food", image: "/showcase/hero-food.jpg", alt: "A rider collecting a food bag from a street grill", label: "Food", title: "Dinner, tracked on the same route.", body: "A short menu, a delivery fee, and an ETA before you place it.", featureId: "food", group: "delivery" },
  { id: "grocery", image: "/showcase/service-grocery.jpg", alt: "Groceries being handed over at a home doorway", label: "Grocery", title: "Staples, with the fee shown first.", body: "Rice, water, bread. The delivery charge is on the estimate.", featureId: "grocery", group: "delivery" },
  { id: "hire", image: "/showcase/service-rental.jpg", alt: "A driver sitting in a compact car with the keys", label: "Hire", title: "A car you drive yourself.", body: "Compact or SUV, for 4, 8, or 24 hours, from a landmark.", featureId: "hire", group: "ride" },
  { id: "safety", image: "/showcase/safety-night.jpg", alt: "A passenger in a car at night with a softly lit phone", label: "Safety", title: "A NIN check, a PIN, and a case number.", body: "Riders and drivers are verified before the trip. A concern gets a reference, not a dead end.", featureId: "nin", group: "safety" },
  { id: "drivers", image: "/showcase/driver-portrait.jpg", alt: "A woman in the driver seat of a car", label: "Drivers", title: "The person at the wheel sees the cut.", body: "Gross, commission, and take-home before fuel. Estimates stay labelled.", featureId: "earnings", group: "driver" },
  { id: "business", image: "/showcase/city-abuja.jpg", alt: "A wide view of Abuja on a bright day", label: "Business", title: "The company pays. The rider still gets the PIN.", body: "Cost center and invoice stay on the receipt.", featureId: "biz", group: "business" },
];

const icons: Record<string, SvgIconComponent> = {
  AccountBalanceWallet, AccountTree, AddLocationAlt, AirlineSeatReclineExtra, AltRoute, Assignment, Badge,
  BookmarkBorder, Build, BusinessCenter, CallSplit, CarRental, ChatOutlined, ContactPhone, Description,
  DirectionsCar, EditNote, FavoriteBorder, Flag, Gavel, Group, History, Inventory2, LocalGasStation,
  LocalShipping, Loyalty, Map, Navigation, NearMe, Payments, PersonSearch, PhoneInTalk, Pin, Place,
  ReceiptLong, Restaurant, Savings, Schedule, Search, Sell, Share, ShoppingBasket, Sos, StarBorder,
  StickyNote2, ThumbUpAlt, TrendingUp, VerifiedUser, VolumeOff,
};

export function FeatureAtlas() {
  const reduce = useReducedMotion();
  const dark = useTheme().palette.mode === "dark";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const setService = useBookingStore((state) => state.setService);
  const patch = useBookingStore((state) => state.patch);
  const slide = slides[index];
  const related = features.filter((feature) => feature.group === slide.group).slice(0, 4);
  const current = features.find((feature) => feature.id === slide.featureId);

  useEffect(() => {
    if (reduce || paused) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [reduce, paused, index]);

  function open(feature: Feature) {
    if (feature.apply) {
      if (feature.apply.service) setService(feature.apply.service);
      const rest = { ...feature.apply };
      delete rest.service;
      if (Object.keys(rest).length > 0) patch(rest);
      scrollToBook();
      return;
    }
    if (feature.anchor) document.getElementById(feature.anchor)?.scrollIntoView({ behavior: "smooth" });
  }

  function go(next: number) {
    const count = slides.length;
    const normalized = (next + count) % count;
    setDirection(normalized === index ? direction : next > index || (index === count - 1 && normalized === 0) ? 1 : -1);
    setIndex(normalized);
  }

  return (
    <Box id="features" component="section" sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 14, md: 16 }, scrollMarginTop: 80 }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Typography sx={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
          The full surface
        </Typography>
        <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 760 }}>
          Every way people already book a ride, a parcel, a meal, or a car.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 640 }}>
          Open a slide to load it into the phone preview. The fare, the class, and the options follow.
        </Typography>
      </motion.div>

      <Box
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        sx={{ position: "relative", mt: 3.5, height: { xs: 460, md: 560 }, borderRadius: "28px", overflow: "hidden", bgcolor: "#171814" }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <Box
            key={slide.id}
            component={motion.div}
            custom={direction}
            initial={reduce ? false : { opacity: 0, x: direction * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: direction * -48 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            sx={{ position: "absolute", inset: 0 }}
          >
            <Image src={slide.image} alt={slide.alt} fill sizes="(min-width: 1200px) 1120px, 100vw" style={{ objectFit: "cover" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(23,24,20,0.05) 20%, rgba(23,24,20,0.78) 100%)" }} />
            <Box sx={{ position: "absolute", left: { xs: 20, md: 36 }, right: { xs: 20, md: 120 }, bottom: { xs: 88, md: 36 }, color: "#F3F4EE" }}>
              <Typography sx={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700 }}>{slide.label}</Typography>
              <Typography sx={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 650, letterSpacing: "-0.03em", fontSize: { xs: "1.7rem", md: "2.4rem" }, lineHeight: 1.05, mt: 1, maxWidth: 640 }}>
                {slide.title}
              </Typography>
              <Typography sx={{ mt: 1.2, maxWidth: 520, color: "rgba(243,244,238,0.86)" }}>{slide.body}</Typography>
              {current && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.2 }}>
                  <Button
                    type="button"
                    onClick={() => open(current)}
                    sx={{ borderRadius: 999, px: 2.2, py: 1, bgcolor: "#F3F4EE", color: "#171814", "&:hover": { bgcolor: "#FFFFFF" } }}
                  >
                    Open in the preview
                  </Button>
                  {slide.group === "driver" && <EarnWithRapidButton appearance="inverse" />}
                </Box>
              )}
            </Box>
          </Box>
        </AnimatePresence>
        <IconButton type="button" aria-label="Previous slide" onClick={() => go(index - 1)} sx={{ position: "absolute", top: 16, right: 64, color: "#171814", bgcolor: "rgba(243,244,238,0.92)", "&:hover": { bgcolor: "#FFFFFF" } }}>
          <ChevronLeft />
        </IconButton>
        <IconButton type="button" aria-label="Next slide" onClick={() => go(index + 1)} sx={{ position: "absolute", top: 16, right: 16, color: "#171814", bgcolor: "rgba(243,244,238,0.92)", "&:hover": { bgcolor: "#FFFFFF" } }}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 1.6, overflowX: "auto" }}>
        {slides.map((item, itemIndex) => {
          const on = itemIndex === index;
          return (
            <Button
              key={item.id}
              type="button"
              onClick={() => go(itemIndex)}
              sx={{ position: "relative", flex: "1 0 88px", minWidth: 88, borderRadius: 999, px: 1.4, py: 0.8, color: on ? "background.default" : "text.primary", bgcolor: "transparent", overflow: "hidden" }}
            >
              {on && <Box component="span" sx={{ position: "absolute", inset: 0, borderRadius: 999, bgcolor: "text.primary" }} />}
              {on && !reduce && !paused && (
                <Box component="span" key={item.id} sx={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, bgcolor: dark ? brand.gold : brand.lemon, transformOrigin: "left center", animation: "rr-slide 5.6s linear" }} />
              )}
              <Box component="span" sx={{ position: "relative", zIndex: 1, fontSize: 13 }}>{item.label}</Box>
            </Button>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        {related.map((feature) => {
          const Icon = icons[feature.icon] ?? Place;
          return (
            <Button key={feature.id} type="button" onClick={() => open(feature)} startIcon={<Icon />} sx={{ borderRadius: 999, border: "1px solid", borderColor: "divider", color: "text.primary", bgcolor: "background.paper" }}>
              {feature.title}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
