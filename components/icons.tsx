import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* ──────────────────────────────────────────────
   1. LOGO MARK — Gear (8 teeth) + play triangle
   ────────────────────────────────────────────── */
export function GearPlayLogo(props: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Gear ring */}
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="4" fill="none" />
      {/* 8 stubby teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="20"
          y="3"
          width="8"
          height="7"
          rx="1"
          fill="currentColor"
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
      {/* Play triangle */}
      <polygon points="20,16 20,32 34,24" fill="currentColor" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   2. SERVICE ICONS (replace emojis)
   ────────────────────────────────────────────── */

/** Smartphone with play button — replaces 📱 */
export function IconSocialMedia(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="5" y1="6" x2="19" y2="6" />
      <line x1="5" y1="18" x2="19" y2="18" />
      <polygon points="10,10 10,16 15,13" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Clapperboard — replaces 🎬 */
export function IconBrandFilm(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16" />
      <path d="M7 4l3 5" />
      <path d="M12 4l3 5" />
      <path d="M17 4l3 5" />
      <path d="M2 4l3 5" />
    </svg>
  );
}

/** Cinema camera — replaces 🎥 */
export function IconLongform(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="15" height="12" rx="2" />
      <polygon points="17,9 22,6 22,18 17,15" />
      <circle cx="7" cy="12" r="2" />
    </svg>
  );
}

/** Bar chart with gear accent — replaces 📊 */
export function IconStrategy(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="14" width="4" height="7" />
      <rect x="10" y="10" width="4" height="11" />
      <rect x="17" y="6" width="4" height="15" />
      {/* Small gear accent */}
      <circle cx="19" cy="4" r="2" />
      <line x1="19" y1="1.5" x2="19" y2="2" />
      <line x1="19" y1="6" x2="19" y2="6.5" />
      <line x1="16.5" y1="4" x2="17" y2="4" />
      <line x1="21" y1="4" x2="21.5" y2="4" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   3. PRODUCTION SPEC ICONS (replace Unicode)
   ────────────────────────────────────────────── */

/** Screen with grid — replaces ◈ */
export function IconResolution(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="14" rx="1" />
      <line x1="2" y1="20" x2="22" y2="20" />
      <line x1="10" y1="18" x2="10" y2="20" />
      <line x1="14" y1="18" x2="14" y2="20" />
      {/* Grid pattern */}
      <line x1="8" y1="4" x2="8" y2="18" strokeOpacity="0.4" />
      <line x1="16" y1="4" x2="16" y2="18" strokeOpacity="0.4" />
      <line x1="2" y1="11" x2="22" y2="11" strokeOpacity="0.4" />
    </svg>
  );
}

/** Lens aperture — replaces ◎ */
export function IconCinemaGrade(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="14" y2="8" />
      <line x1="20.66" y1="7" x2="15" y2="10" />
      <line x1="20.66" y1="17" x2="15" y2="14" />
      <line x1="12" y1="22" x2="14" y2="16" />
      <line x1="3.34" y1="17" x2="9" y2="14" />
      <line x1="3.34" y1="7" x2="9" y2="10" />
    </svg>
  );
}

/** Sound waves — replaces ♫ */
export function IconDolbyAudio(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18" />
      <path d="M8 7v10" />
      <path d="M4 10v4" />
      <path d="M16 7v10" />
      <path d="M20 10v4" />
    </svg>
  );
}

/** Color wheel — replaces ◆ */
export function IconColorGrade(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="9.88" y2="9.88" />
      <line x1="14.12" y1="14.12" x2="19.07" y2="19.07" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   4. SOCIAL MEDIA ICONS (replace text abbrevs)
   ────────────────────────────────────────────── */

/** Instagram — rounded square + circle + dot */
export function IconInstagram(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** YouTube — rounded rect + play triangle */
export function IconYouTube(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <polygon points="10,8 10,16 16,12" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Vimeo — play circle */
export function IconVimeo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 10,16 16,12" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** LinkedIn — rounded square with "in" shapes */
export function IconLinkedIn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <path d="M11 10v7" />
      <path d="M11 13.5c0-2 1.5-3.5 3.5-3.5S18 11.5 18 13.5V17" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   5. DECORATIVE ELEMENTS
   ────────────────────────────────────────────── */

/** Large detailed gear for Hero background — 12 teeth, low opacity, slow CSS spin */
export function GearDecoration(props: IconProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* 12 teeth around the ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const innerR = 46;
          const outerR = 56;
          const halfW = 5;
          // Compute tooth rectangle corners
          const cx = 60 + cos * ((innerR + outerR) / 2);
          const cy = 60 + sin * ((innerR + outerR) / 2);
          const hw = halfW;
          const hh = (outerR - innerR) / 2;
          return (
            <rect
              key={i}
              x={cx - hw}
              y={cy - hh}
              width={hw * 2}
              height={hh * 2}
              rx="1"
              transform={`rotate(${i * 30} ${cx} ${cy})`}
            />
          );
        })}
        {/* Outer ring */}
        <circle cx="60" cy="60" r="46" />
        {/* Inner ring */}
        <circle cx="60" cy="60" r="30" />
        {/* Hub */}
        <circle cx="60" cy="60" r="10" />
        {/* Spokes */}
        <line x1="60" y1="50" x2="60" y2="30" />
        <line x1="51.34" y1="55" x2="41.34" y2="41.34" />
        <line x1="51.34" y1="65" x2="41.34" y2="78.66" />
        <line x1="60" y1="70" x2="60" y2="90" />
        <line x1="68.66" y1="65" x2="78.66" y2="78.66" />
        <line x1="68.66" y1="55" x2="78.66" y2="41.34" />
      </g>
    </svg>
  );
}

/** Horizontal line with centered gear — section divider */
export function MechanicalDivider(props: IconProps) {
  return (
    <svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" {...props}>
      {/* Left line */}
      <line x1="0" y1="20" x2="175" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {/* Right line */}
      <line x1="225" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {/* Center gear */}
      <g transform="translate(200 20)">
        {/* Teeth */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = Math.cos(angle) * 12;
          const cy = Math.sin(angle) * 12;
          return (
            <rect
              key={i}
              x={cx - 2}
              y={cy - 2}
              width="4"
              height="4"
              rx="0.5"
              fill="currentColor"
              fillOpacity="0.3"
              transform={`rotate(${i * 45} ${cx} ${cy})`}
            />
          );
        })}
        <circle r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <circle r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   6. NAVIGATION ICONS (dashboard sidebar)
   ────────────────────────────────────────────── */

/** 2×2 grid — Command Grid / Home */
export function IconGrid(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

/** Play circle — Live Feed / Showreel */
export function IconPlay(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Camera — Portfolio */
export function IconCamera(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/** Horizontal bars — Capabilities */
export function IconBars(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <line x1="4" y1="18" x2="12" y2="18" />
    </svg>
  );
}

/** Timeline — Pipeline / Process */
export function IconTimeline(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none" />
      <line x1="14" y1="5" x2="20" y2="5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="10" y1="12" x2="4" y2="12" />
      <circle cx="12" cy="19" r="2" fill="currentColor" stroke="none" />
      <line x1="14" y1="19" x2="20" y2="19" />
    </svg>
  );
}

/** Wrench — Gear Rentals */
export function IconWrench(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** Calculator — Scope Tool */
export function IconCalculator(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="16" y2="18" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   7. LOOKUP MAPS
   ────────────────────────────────────────────── */

export const serviceIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "social-media": IconSocialMedia,
  "brand-film": IconBrandFilm,
  "longform": IconLongform,
  "strategy": IconStrategy,
};

export const specIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "resolution": IconResolution,
  "cinema-grade": IconCinemaGrade,
  "dolby-audio": IconDolbyAudio,
  "color-grade": IconColorGrade,
};

export const socialIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "instagram": IconInstagram,
  "youtube": IconYouTube,
  "vimeo": IconVimeo,
  "linkedin": IconLinkedIn,
};

export const navIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  "grid": IconGrid,
  "play": IconPlay,
  "camera": IconCamera,
  "bars": IconBars,
  "timeline": IconTimeline,
  "wrench": IconWrench,
  "calculator": IconCalculator,
};
