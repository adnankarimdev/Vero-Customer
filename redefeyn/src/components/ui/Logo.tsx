interface VeroLogoProps {
  size?: number;
  color?: string;
}

export default function Logo({
  size = 100,
  color = "black",
}: VeroLogoProps = {}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle */}
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="2" />

      {/* Letter V */}
      <path
        d="M35 30L50 70L65 30"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow heads */}
      {/* <path d="M45 2L50 7L55 2" fill={color} />
      <path d="M95 45L90 50L95 55" fill={color} />
      <path d="M55 98L50 93L45 98" fill={color} />
      <path d="M5 55L10 50L5 45" fill={color} /> */}
    </svg>
  );
}
