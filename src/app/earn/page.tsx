import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { features } from "@/data/features";

export const metadata: Metadata = {
  title: "Earn with Rapid",
  description: "Driver features for RapidRyde. Riders and drivers both clear a NIN check before a trip can start.",
};

const checks = [
  ["Rider", "A customer cannot book until their NIN check has passed."],
  ["Driver", "A driver cannot go online until the same check, plus the vehicle papers, has passed."],
  ["On the trip", "Each person sees verified. The number is not on the request, the chat, or the receipt."],
];

export default function EarnPage() {
  const driverFeatures = features.filter((feature) => feature.group === "driver");
  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 3 }, pt: { xs: 4, md: 7 }, pb: { xs: 6, md: 10 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.05fr) minmax(0, 0.95fr)" }, gap: { xs: 3, md: 5 }, alignItems: "center" }}>
        <Box>
          <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
            Drivers
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.2, maxWidth: 640 }}>
            Earn with Rapid.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 560, fontSize: "1.05rem" }}>
            The driver features. A shift stays closed until the NIN check and the vehicle papers have passed. This preview does not collect a NIN or dispatch a trip.
          </Typography>
        </Box>
        <Box sx={{ position: "relative", height: { xs: 320, md: 420 }, borderRadius: "22px", overflow: "hidden", bgcolor: "#171814" }}>
          <Image src="/showcase/driver-portrait.jpg" alt="A woman in the driver seat of a car" fill sizes="(min-width: 900px) 520px, 100vw" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Safety</Typography>
        <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 680 }}>Both sides of the trip are checked.</Typography>
        <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, border: "1px solid", borderColor: "divider", borderRadius: "20px", overflow: "hidden", bgcolor: "background.paper" }}>
          {checks.map(([title, body], index) => (
            <Box
              key={title}
              sx={{
                p: { xs: 2.4, md: 3 },
                borderTop: { xs: index === 0 ? "none" : "1px solid", md: "none" },
                borderLeft: { md: index === 0 ? "none" : "1px solid" },
                borderColor: "divider",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.8 }}>{body}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 7, md: 9 } }}>
        <Typography sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Driver features</Typography>
        <Typography variant="h2" sx={{ mt: 1.2, maxWidth: 640 }}>What the person at the wheel can use.</Typography>
        <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2.4, md: 3 } }}>
          {driverFeatures.map((feature) => (
            <Box key={feature.id} sx={{ pb: 2.2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontWeight: 700 }}>{feature.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.6 }}>{feature.body}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
