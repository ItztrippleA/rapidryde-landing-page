import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchitectureExplorer } from "@/components/architecture/ArchitectureExplorer";

export const metadata: Metadata = {
  title: "Class model",
  description: "Domain class diagram for RapidRyde: rides, offers, trips, payments, cases, deliveries, and driver care.",
};

export default function ArchitecturePage() {
  return (
    <Suspense>
      <ArchitectureExplorer />
    </Suspense>
  );
}
