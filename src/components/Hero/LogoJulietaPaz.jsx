export default function LogoJulietaPaz({ className = "" }) {
  return (
    <svg
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      {/* Círculo exterior */}
      <circle cx="110" cy="110" r="106" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Onda izquierda */}
      <path
        d="M 20 83 C 32 77, 38 91, 50 84 C 58 79, 65 87, 72 83"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Onda derecha */}
      <path
        d="M 148 83 C 155 79, 162 88, 170 84 C 182 77, 188 91, 200 83"
        stroke="currentColor"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Punto decorativo sobre la j */}
      <circle cx="91" cy="61" r="2.5" />

      {/* Monograma jp */}
      <text
        x="110"
        y="106"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontStyle="italic"
        fontSize="52"
        textAnchor="middle"
        fill="currentColor"
      >
        jp
      </text>

      {/* JULIETA PAZ — x corregido para centrar visualmente con letter-spacing */}
      <text
        x="114"
        y="132"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="16"
        letterSpacing="7"
        textAnchor="middle"
        fill="currentColor"
      >
        JULIETA PAZ
      </text>

      {/* Separador */}
      <line x1="92" y1="141" x2="128" y2="141" stroke="currentColor" strokeWidth="0.8" />

      {/* BEAUTY STUDIO — x corregido para centrar visualmente con letter-spacing */}
      <text
        x="112"
        y="158"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="10"
        letterSpacing="4.5"
        textAnchor="middle"
        fill="currentColor"
      >
        BEAUTY STUDIO
      </text>
    </svg>
  );
}
