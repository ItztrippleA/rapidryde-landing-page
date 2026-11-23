import type { Metadata } from "next";
import { WaitlistBand } from "@/components/landing/WaitlistBand";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Join the Rapyd Ryd waitlist for passengers and drivers. Abuja and Lagos first — leave your WhatsApp number and we will reach out when seats open.",
};

export default function WaitlistPage() {
  return <WaitlistBand />;
}
