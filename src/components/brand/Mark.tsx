import { brand } from "@/theme/tokens";

export function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="10" fill={brand.lemon} />
      <path
        d="M8 24c5-9 8-9 11-8s5 7 9-5"
        stroke="#171814"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="26.5" cy="11.5" r="2.1" fill="#171814" />
    </svg>
  );
}
