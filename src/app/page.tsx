import { FeatureAtlas } from "@/components/landing/FeatureAtlas";
import { Hero } from "@/components/landing/Hero";
import { LowerBands } from "@/components/landing/LowerBands";
import { Signature } from "@/components/landing/Signature";

export default function Home() {
  return (
    <>
      <Hero />
      <Signature />
      <FeatureAtlas />
      <LowerBands />
    </>
  );
}
