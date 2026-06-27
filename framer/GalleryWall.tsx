/**
 * GalleryWall — Framer Code Component
 *
 * Drifting image-wall background, lifted from the Brodonam landing page.
 * Drop into a Framer project's Code section, save, then drag the
 * "GalleryWall" component onto your canvas. Add your images via the
 * Properties panel.
 *
 * IMPORTANT:
 *   • Use all landscape OR all portrait images — don't mix.
 *     Each lane sizes its tiles by aspect ratio, so mixing shapes
 *     creates an uneven, jagged look.
 *   • Pick one drift direction (horizontal OR vertical).
 *     Mixing both at once would create busy, hard-to-watch motion.
 *
 * — Tested in Framer 2024-Q4 onward. React 18 + framer-motion preinstalled.
 */

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Shape       = "landscape" | "portrait"
type Direction   = "horizontal" | "vertical"

interface Props {
  images: string[]
  shape: Shape
  direction: Direction
  duration: number      // seconds per full drift cycle (higher = slower)
  lanes: number
  gap: number
  brightness: number
  saturation: number
  borderRadius: number
  vignette: boolean
  alternateDirections: boolean
  background: string
}

// Single instance ID so multiple GalleryWalls on the page don't share keyframe names
let _gwId = 0

function GalleryWall(props: Props) {
  const {
    images, shape, direction,
    duration, lanes, gap,
    brightness, saturation,
    borderRadius, vignette,
    alternateDirections,
    background,
  } = props

  const id = React.useMemo(() => `gw-${++_gwId}`, [])
  const isHorizontal = direction === "horizontal"
  const isLandscape  = shape === "landscape"

  // Each tile's aspect ratio — used so landscape vs portrait images keep their shape.
  const aspect = isLandscape ? "16 / 10" : "2 / 3"

  // Build the lanes (rows in horizontal mode, columns in vertical mode).
  // Each lane gets a slightly different duration to create parallax depth,
  // and every other lane reverses direction when alternateDirections is on.
  const laneConfigs = React.useMemo(() => {
    const n = Math.max(1, Math.min(8, lanes))
    return Array.from({ length: n }, (_, i) => {
      const variation = 0.78 + (i / Math.max(1, n - 1)) * 0.44 // 0.78x → 1.22x
      const dur       = duration * variation
      const reverse   = alternateDirections && i % 2 === 1
      const offset    = (i * 31) % 100 // unaligned start so lanes don't pulse together
      return { index: i, dur, reverse, offset }
    })
  }, [lanes, duration, alternateDirections])

  // For each lane, build enough tiles to cover 2× the lane (the duplication is what
  // makes the translate(-50%) loop seamless).
  const tilesPerLane = Math.max(8, (images?.length || 1) * 4)

  // Don't render anything useful until at least one image exists.
  if (!images || images.length === 0) {
    return (
      <div style={emptyState}>
        Add images in the Properties panel →
      </div>
    )
  }

  return (
    <div style={{ ...container, background }}>
      {laneConfigs.map(({ index, dur, reverse, offset }) => {
        const animationName = isHorizontal
          ? (reverse ? `${id}-driftX-rev` : `${id}-driftX`)
          : (reverse ? `${id}-driftY-rev` : `${id}-driftY`)

        const laneStyle: React.CSSProperties = isHorizontal
          ? {
              position: "absolute",
              left: 0,
              right: 0,
              top:    `${(index / lanes) * 100}%`,
              height: `${100 / lanes}%`,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap,
              willChange: "transform",
              animation: `${animationName} ${dur}s linear infinite`,
              animationDelay: `-${(offset / 100) * dur}s`,
              filter: `brightness(${brightness}) saturate(${saturation})`,
            }
          : {
              position: "absolute",
              top: 0, bottom: 0,
              left:  `${(index / lanes) * 100}%`,
              width: `${100 / lanes}%`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap,
              willChange: "transform",
              animation: `${animationName} ${dur}s linear infinite`,
              animationDelay: `-${(offset / 100) * dur}s`,
              filter: `brightness(${brightness}) saturate(${saturation})`,
            }

        // Tile sizing rules:
        //   horizontal lane: tiles fill the lane HEIGHT and let aspect-ratio set width
        //   vertical lane:   tiles fill the lane WIDTH  and let aspect-ratio set height
        const tileStyle: React.CSSProperties = isHorizontal
          ? {
              flex: "0 0 auto",
              height: "100%",
              aspectRatio: aspect,
              borderRadius,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              flex: "0 0 auto",
              width: "100%",
              aspectRatio: aspect,
              borderRadius,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }

        // Stagger which image each lane starts on so adjacent lanes don't show twins.
        const tiles: React.ReactNode[] = []
        for (let i = 0; i < tilesPerLane; i++) {
          const src = images[(index * 3 + i) % images.length]
          tiles.push(
            <div
              key={i}
              style={{ ...tileStyle, backgroundImage: `url(${src})` }}
              aria-hidden="true"
            />
          )
        }

        return (
          <div key={index} style={laneStyle} aria-hidden="true">
            {tiles}
            {/* Duplicated set — the translate(-50%) loop trick. */}
            {tiles}
          </div>
        )
      })}

      {vignette && <div style={vignetteStyle} aria-hidden="true" />}

      {/* Per-instance keyframes so multiple walls on the page don't collide.
          Animation moves the lane by exactly 50% of its content length.
          Since the content is duplicated, the loop is seamless. */}
      <style>{`
        @keyframes ${id}-driftX     { from { transform: translateX(0);     } to { transform: translateX(-50%); } }
        @keyframes ${id}-driftX-rev { from { transform: translateX(-50%); } to { transform: translateX(0);     } }
        @keyframes ${id}-driftY     { from { transform: translateY(0);     } to { transform: translateY(-50%); } }
        @keyframes ${id}-driftY-rev { from { transform: translateY(-50%); } to { transform: translateY(0);     } }

        @media (prefers-reduced-motion: reduce) {
          [data-gw-lane="${id}"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

const container: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
}
const vignetteStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(ellipse at center, transparent 0%, rgba(3,3,5,0.85) 100%)",
}
const emptyState: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0a0810",
  color: "rgba(255,255,255,0.42)",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  padding: 24,
  textAlign: "center",
}

GalleryWall.defaultProps = {
  images: [],
  shape: "landscape" as Shape,
  direction: "horizontal" as Direction,
  duration: 90,
  lanes: 4,
  gap: 12,
  brightness: 0.55,
  saturation: 0.65,
  borderRadius: 0,
  vignette: true,
  alternateDirections: true,
  background: "#030305",
}

addPropertyControls(GalleryWall, {
  images: {
    type: ControlType.Array,
    title: "Images",
    control: { type: ControlType.Image },
    defaultValue: [],
    maxCount: 80,
  },
  shape: {
    type: ControlType.Enum,
    title: "Image shape",
    options: ["landscape", "portrait"],
    optionTitles: ["Landscape", "Portrait"],
    defaultValue: "landscape",
    description:
      "Use one shape only. Mixed dimensions cause jagged lanes.",
  },
  direction: {
    type: ControlType.Enum,
    title: "Drift direction",
    options: ["horizontal", "vertical"],
    optionTitles: ["Horizontal →", "Vertical ↓"],
    defaultValue: "horizontal",
  },
  duration: {
    type: ControlType.Number,
    title: "Duration",
    description: "Seconds per full cycle. Higher = slower drift.",
    min: 20,
    max: 240,
    step: 5,
    defaultValue: 90,
    unit: "s",
    displayStepper: true,
  },
  lanes: {
    type: ControlType.Number,
    title: "Lanes",
    min: 1,
    max: 8,
    step: 1,
    defaultValue: 4,
    displayStepper: true,
  },
  gap: {
    type: ControlType.Number,
    title: "Tile gap",
    min: 0,
    max: 64,
    step: 1,
    defaultValue: 12,
    unit: "px",
  },
  brightness: {
    type: ControlType.Number,
    title: "Brightness",
    min: 0.1,
    max: 1.5,
    step: 0.05,
    defaultValue: 0.55,
  },
  saturation: {
    type: ControlType.Number,
    title: "Saturation",
    min: 0,
    max: 1.5,
    step: 0.05,
    defaultValue: 0.65,
  },
  borderRadius: {
    type: ControlType.Number,
    title: "Tile radius",
    min: 0,
    max: 32,
    step: 1,
    defaultValue: 0,
    unit: "px",
  },
  vignette: {
    type: ControlType.Boolean,
    title: "Vignette",
    defaultValue: true,
  },
  alternateDirections: {
    type: ControlType.Boolean,
    title: "Alternate lanes",
    description: "Every other lane drifts the opposite way.",
    defaultValue: true,
  },
  background: {
    type: ControlType.Color,
    title: "Background",
    defaultValue: "#030305",
  },
})

export default GalleryWall
