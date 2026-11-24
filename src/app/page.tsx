import { FeatureAtlas } from "@/components/landing/FeatureAtlas";
import { Hero } from "@/components/landing/Hero";
import { LowerBands } from "@/components/landing/LowerBands";
import { Signature } from "@/components/landing/Signature";
import { WaitlistBand } from "@/components/landing/WaitlistBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Signature />
      <FeatureAtlas />
      <LowerBands />
      <WaitlistBand />
    </>
  );
}
