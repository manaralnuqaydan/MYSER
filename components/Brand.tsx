export default function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      href="#home"
      className={`brand ${light ? "light" : ""}`}
      aria-label="MYSER | مُيسّرة"
    >
      <span className="brand-symbol">
        <svg viewBox="0 0 42 48" fill="none" aria-hidden="true">
          <path
            d="M4 24C5 6 24 15 39 2C39 19 21 19 4 24Z"
            fill="currentColor"
          />
          <path
            d="M2 37C6 19 25 30 38 17C37 34 16 30 2 45V37Z"
            fill="currentColor"
            opacity=".72"
          />
        </svg>
      </span>
      {!compact && (
        <span className="brand-name">
          <strong>مُيسّرة</strong>
          <span>M Y S E R</span>
        </span>
      )}
    </a>
  );
}
