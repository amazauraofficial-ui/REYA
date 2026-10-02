interface LotusLogoProps {
  className?: string;
  size?: number;
}

export default function LotusLogo({ className = 'text-[#d6b77c]', size = 32 }: LotusLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central sacred lotus petal */}
      <path
        d="M24 6C24 6 20 18 20 28C20 33 22 36 24 38C26 36 28 33 28 28C28 18 24 6 24 6Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Inner left petal */}
      <path
        d="M20 16C15 20 13 26 14 32C15 35 18 37 22 37C20.5 33 20 25 20 16Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      {/* Inner right petal */}
      <path
        d="M28 16C33 20 35 26 34 32C33 35 30 37 26 37C27.5 33 28 25 28 16Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      {/* Outer left petal */}
      <path
        d="M14 24C8 28 7 34 9 37C11 39 15 39 19 38C16 35 14 30 14 24Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      {/* Outer right petal */}
      <path
        d="M34 24C40 28 41 34 39 37C37 39 33 39 29 38C32 35 34 30 34 24Z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      {/* Base water line arc */}
      <path
        d="M12 40C18 42 30 42 36 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );
}
