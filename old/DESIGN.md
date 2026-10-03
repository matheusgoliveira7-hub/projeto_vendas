---
name: Aura Pulse
colors:
  surface: '#0e1321'
  surface-dim: '#0e1321'
  surface-bright: '#343948'
  surface-container-lowest: '#090e1c'
  surface-container-low: '#161b2a'
  surface-container: '#1a1f2e'
  surface-container-high: '#252a39'
  surface-container-highest: '#303444'
  on-surface: '#dee2f6'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dee2f6'
  inverse-on-surface: '#2b303f'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#fff3f1'
  on-tertiary: '#690003'
  tertiary-container: '#ffcec7'
  on-tertiary-container: '#c1000a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#0e1321'
  on-background: '#dee2f6'
  surface-variant: '#303444'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system defines a high-conversion mobile storefront for a precision luxury smartwatch. It marries the ultra-refined spatial depth of luxury horology with high-performance biometric feedback. 

The aesthetic is precision-driven dark minimalism combined with tactical glassmorphism: pitch midnight substrates, micro-fine glowing borders, and energetic biometric accents. Visual elements evoke peak human performance, medical-grade telemetry, and industrial refinement.

### Target Audience & Emotional Intent
- **Audience:** High-performing professionals, athletes, and tech-forward consumers who prioritize physiological metrics, endurance tracking, and understated digital luxury.
- **Emotional Response:** Immediate trust, technological superiority, tactile desire, and focused urgency toward checkout conversion without aggressive gimmicks.

## Colors

The palette establishes a high-contrast dark environment inspired by cockpit head-up displays and OLED wearable interfaces.

### Role Allocations
- **Primary (`#00F0FF` - Electro Cyan):** Reserved for primary interactive conversions, active states, key data readouts, and signature hardware edge highlights.
- **Secondary (`#10B981` - Electric Emerald):** Denotes physiological vitality, recovery metrics, positive trends, validation confirmations, and guarantee seals.
- **Tertiary (`#FF3B30` - Coral Pulse):** Reserved for live cardiac metrics, peak heart rate zones, subtle scarcity badges, and critical interactive alerts.
- **Neutral (`#0A0F1D` - Midnight Slate):** The base void substrate. Tonal surface tiers derive from this deep indigo-tinted obsidian base (`#0E1626` for base cards, `#152035` for elevated interactive components).
- **Text & Stroke Contrast:** Headlines and critical values render in `#FFFFFF`. Secondary metrics and descriptors use `#94A3B8` (Slate 400). Ghost borders use `#00F0FF` at `12%` to `20%` alpha for technical precision.

## Typography

The type system prioritizes high-speed glanceability and technical authority. 

### Implementation Rules
- **Display & Headlines (Plus Jakarta Sans):** Geometric curves with aggressive kerning give hero copy a contemporary hardware industrialist character. Use `display-mobile` for top-of-funnel value propositions.
- **Body & Metrics (Inter):** Neutral, tall x-height design that guarantees crystal-clear legibility of feature sets, biometric specs, and battery performance tables under high glare or direct sunlight.
- **Micro-labels & Telemetry (Inter SemiBold/Bold uppercase):** For telemetry units (e.g., `BPM`, `VO2 MAX`, `ECG READY`), enforce uppercase styling via `label-sm` with widened tracking (`0.06em`) to echo cockpit dashboard readouts.

## Layout & Spacing

The layout is built mobile-first on a 4-column dynamic grid, scaling to 8 columns on tablet and 12 columns on desktop viewports.

### Spacing Philosophy & Rhythms
- **Canvas Boundaries:** Mobile interfaces stick rigidly to a 16px (`1rem`) outer margin to maximize usable horizontal surface area for interactive 360-degree watch viewports and specification comparison cards.
- **Vertical Flow:** Section-to-section breaks use `space-xl` (`2.5rem`) stacked spacing, maintaining a relentless downward conversion velocity while preserving visual breathing room.
- **Conversion Modules:** Direct response elements (pricing tiers, color pickers, and sticky bottom sheets) strictly employ `space-sm` (`0.5rem`) internally for tighter grouping, while separating feature validation clusters by `space-md` (`1rem`).

## Elevation & Depth

Visual hierarchy uses frosted glassmorphism over tonal obsidian planes, layered with subtle volumetric lighting.

### Layering Blueprint
- **Level 0 (Substrate Void):** Pure dark canvas (`#0A0F1D`) with subtle radial gradients (e.g., 20% opacity `#00F0FF` blurred at 140px) positioned directly behind hardware product shots to emulate backlit displays.
- **Level 1 (Telemetry & Spec Cards):** Surface container filled with `#0E1626` at 80% opacity, paired with `backdrop-filter: blur(16px)` and a continuous 1px micro-border composed of `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Interactive Floating Modules / Sticky Bar):** Surface filled with `#152035` at 90% opacity, `backdrop-filter: blur(24px)`. Bordered by a top-to-bottom directional gradient: `rgba(0, 240, 255, 0.3)` tapering down to `rgba(255, 255, 255, 0.02)`.
- **Level 3 (Checkout Trigger & Dynamic Badges):** High-energy primary actions utilize soft cyan drop glow: `0 8px 30px rgba(0, 240, 255, 0.28)`.

## Shapes

The design system adopts a Pill-shaped profile (`roundedness: 3`) reflecting the curved glass and rounded bezel geometry of contemporary premium smartwatches.

### Application Guidelines
- **Structural Spec Cards:** Apply `rounded-xl` (1.5rem / 24px) to encapsulate biometric modules, health sensors, and visual comparison containers, creating organic hardware-like frames.
- **Buttons & Interactive Tags:** Formed as pure pills (`border-radius: 9999px`). This eliminates visual harshness and directs user focus to conversion touchpoints.
- **Input Toggles & Variant Selectors:** Straps, finishes, and size selectors must use complete pill or continuous circular geometries to reflect physical watch elements.

## Components

### 1. Primary CTA Buttons
- **High-Conversion Buy Button:** Full-width pill (`h-14` / 56px), filled with `#00F0FF`, text in `#0A0F1D` (Inter Bold `16px`). Accompanied by a subtle exterior glow (`0 0 20px rgba(0, 240, 255, 0.35)`). Active state applies a scale transform (`0.98`).
- **Secondary / Spec Trigger:** Transparent pill, 1px border in `rgba(0, 240, 255, 0.3)`, text in `#FFFFFF`. Hover/Focus state lifts background to `rgba(0, 240, 255, 0.08)`.

### 2. Feature & Biometric Cards
- **Construction:** Frosted midnight glass with 16px internal padding (`space-md`), 1px ghost border. 
- **Accent Integration:** Top-right corner displays a live micro-pill indicator (e.g., green dot with `10B981` pulse animation for active battery life, coral `#FF3B30` for sensor tracking).

### 3. Variant & Size Pickers
- **Finishes (Titanium, Midnight, Starlight):** Circular swatches (`40px x 40px`) housed in a frosted pill container. Active selection marked by an outer glowing ring with a 2px offset in `#00F0FF`.
- **Case Size Selector (41mm vs 45mm):** Segmented pill toggle using `#0E1626` base; the selected option slides a glowing `#152035` pill element with white bold typography.

### 4. Chips & Micro-Badges
- **Social Proof / Scarcity Chips:** Ultra-compact pill badge (`px-3 py-1`) using `rgba(0, 240, 255, 0.1)` fill and `#00F0FF` text with `label-sm` tracking.
- **Vital Status Badge:** Filled with `rgba(255, 59, 48, 0.12)`, text `#FF3B30`, featuring a live heart-pulse icon SVG.

### 5. Sticky Bottom Conversion Bar
- Persistent mobile bottom-docked panel (`backdrop-filter: blur(20px)` with background `rgba(10, 15, 29, 0.92)`).
- Left side: Dynamic total price and installment terms (`headline-sm` in `#FFFFFF`, descriptor in `body-sm` `#94A3B8`).
- Right side: Compressed high-contrast pill CTA (`h-11`, `#00F0FF` background, `#0A0F1D` text) maintaining checkout visibility throughout the entire scroll journey.