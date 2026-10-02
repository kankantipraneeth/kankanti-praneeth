type Direction = "right" | "left" | "up" | "down" | "up-right";

const ROTATION: Record<Direction, number> = { right: 0, down: 90, left: 180, up: 270, "up-right": -45 };

/** The site's single arrow icon: one 1.5px stroke, sized to the surrounding text, decorative by default. */
export function Arrow({ direction = "right", className = "" }: { direction?: Direction; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={`inline-block shrink-0 ${className}`}
      style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
