import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Logo() {
  return (
    <div className="w-12 h-10 bg-transparent flex items-center justify-center relative">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular arrows */}
        <path
          d="M50 10 A40 40 0 1 1 49.9999 10"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="1 10"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>

        {/* Letter R */}
        <text
          x="50"
          y="65"
          fontSize="50"
          fontWeight="bold"
          textAnchor="middle"
          fill="hsl(var(--primary))"
          className={inter.className}
        >
          R
        </text>
      </svg>
    </div>
  );
}
