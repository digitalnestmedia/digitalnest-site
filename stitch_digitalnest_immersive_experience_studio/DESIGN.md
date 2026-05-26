---
name: DigitalNest Narrative
colors:
  surface: '#fdf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#474741'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#777771'
  outline-variant: '#c8c7bf'
  surface-tint: '#5f5e5c'
  primary: '#010100'
  on-primary: '#ffffff'
  primary-container: '#1c1c1a'
  on-primary-container: '#858481'
  inverse-primary: '#c8c6c3'
  secondary: '#5e5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dc'
  on-secondary-container: '#626360'
  tertiary: '#000100'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1b'
  on-tertiary-container: '#848482'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2de'
  primary-fixed-dim: '#c8c6c3'
  on-primary-fixed: '#1c1c1a'
  on-primary-fixed-variant: '#474744'
  secondary-fixed: '#e3e2df'
  secondary-fixed-dim: '#c7c7c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#464744'
  tertiary-fixed: '#e4e2e0'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#fdf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-xl:
    fontFamily: Sora
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  editorial-accent:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
spacing:
  unit: 8px
  section-gap: 160px
  content-gap: 40px
  margin-desktop: 80px
  margin-mobile: 24px
---

## Brand & Style

The design system is rooted in the concept of a "digital gallery"—a premium, immersive space that prioritizes negative space and cinematic composition over information density. It targets high-end clientele in the spatial experience and architectural sectors, evoking a sense of restrained luxury and quiet confidence.

The design style is **Minimalist-Architectural**. It utilizes an editorial lens to present digital content as fine art. The experience is defined by heavy whitespace, high-contrast monochrome foundations, and subtle organic textures (simulated grain) that soften the digital edge. The goal is to move away from the frantic nature of modern software toward a slower, intentional, and high-fidelity interaction model.

## Colors

This color palette mimics physical materials: ink, stone, and heavy paper. 

- **Ink Black (#1C1C1A)**: The core grounding element. Used for all primary typography, structural lines, and high-impact backgrounds.
- **Chalk White (#F5F4F0)**: The primary canvas. A soft, warm white that reduces eye strain and provides an expensive, gallery-like feel compared to pure #FFFFFF.
- **Paper Beige (#EEECEA)**: Used for subtle layering, secondary containers, and depth-building without the use of harsh shadows.
- **Forest Green (#2D6A4F)**: A rare, focused accent. It is reserved exclusively for primary calls to action or to signify active states, standing out against the monochrome base like a piece of moss in a concrete structure.

## Typography

Typography is the primary driver of the brand's premium feel. 

1. **Sora (Headlines)**: Rendered in high weights. For the most cinematic effect, utilize negative letter spacing on display sizes to create tight, architectural blocks of text.
2. **Playfair Display (Accents)**: Used sparingly for pull-quotes or emotional emphasis within paragraphs. It should always be italicized to contrast the geometric nature of the sans-serifs.
3. **Hanken Grotesk (Body/Labels)**: A clean, sharp grotesque that ensures legibility. Use ample line height (1.6x+) to maintain "breathable" text blocks.
4. **Label Caps**: All technical data or metadata should be set in uppercase with wide letter spacing for a refined, utilitarian look.

## Layout & Spacing

This design system rejects generic SaaS grids in favor of **Asymmetric Composition** and **Editorial Flow**. 

- **The Layout**: Use a 12-column grid only as a guide, frequently breaking it with offset elements. Content should feel "placed" rather than "slotted."
- **White Space**: Excessive margins are mandatory. Vertical gaps between sections should be extreme (160px+) to allow the eye to rest and reset.
- **Rhythm**: Use an 8px base unit but scale it aggressively for spatial sections. 
- **Responsive**: On mobile, shift from asymmetric overlaps to a clean, single-column stack, maintaining the generous vertical padding to preserve the "premium" feel.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Architectural Lines** rather than traditional drop shadows.

- **Layered Surfaces**: Use `Paper Beige` containers over `Chalk White` backgrounds to create a subtle sense of physical stacking.
- **Lines**: Use hair-thin (0.5px - 1px) strokes in `Ink Black` with low opacity (10-15%) to define boundaries. These lines should extend to the edge of the viewport where possible, mimicking architectural blueprints.
- **Grain**: Apply a subtle, fixed noise overlay across the entire UI at 2-3% opacity to give the flat colors a tactile, cinematic "film" quality.
- **Glass**: For navigation or floating menus, use a high-refraction backdrop blur (20px+) with no border, allowing the background colors to bleed through softly.

## Shapes

The design system utilizes **Sharp (0px)** corners. This reinforces the architectural and precision-driven nature of a spatial studio. 

Circles may only be used for specific functional icons (like a play button) or profile avatars to create a stark contrast against the rigid, rectangular layout. Any structural container, button, or input field must maintain a strict 90-degree angle.

## Components

- **Buttons**: Primary buttons are solid `Ink Black` with `Chalk White` text, sharp corners, and `Label Caps` typography. Hover states should shift to `Forest Green` for a subtle organic transition.
- **Input Fields**: Minimalist bottom-border only (1px Ink Black). Labels sit above the line in `Label Caps`.
- **Cards**: No borders or shadows. Depth is indicated by a background color shift to `Paper Beige` or by large, high-quality imagery that defines the card’s footprint.
- **Navigation**: A minimalist top-bar. Links should have a "strikethrough" or "underline" hover effect rather than a color change, maintaining the editorial aesthetic.
- **Chips**: Small, rectangular boxes with 1px borders and `Label Caps` text.
- **Custom Component - The Viewfinder**: A specific image container component with thin "crosshair" lines at the corners, reinforcing the spatial/cinematic theme of the studio.