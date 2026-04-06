export default function ZeroLogo({ className = "", fill = "currentColor", size = 120 }) {
  return (
    <svg 
      viewBox="0 0 150 110" 
      className={className} 
      width={size}
      style={{ fill, color: fill, display: 'inline-block' }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Huge O balanced exactly on the tip of the star */}
      <circle 
        cx="115" cy="32" r="26" 
        stroke="currentColor" 
        strokeWidth="14" 
        fill="none" 
      />
      
      {/* ZER text maintaining a small gap with the star */}
      <text 
        x="0" y="96" 
        fontFamily="'Nunito', sans-serif" 
        fontWeight="900" 
        fontSize="48" 
        letterSpacing="0.02em"
        fill="currentColor"
      >
        ZER
      </text>
      
      {/* 4-point star (Sparkle) with top pin exactly touching the circle */}
      <path 
        d="M 115 65 Q 115 85 95 85 Q 115 85 115 105 Q 115 85 135 85 Q 115 85 115 65 Z" 
        fill="currentColor" 
      />
    </svg>
  );
}
