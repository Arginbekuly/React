export function PlaneIllustration({ color = '#b23a2a', className = 'w-[150px]', outline = false }) {
  return (
    <svg viewBox="0 0 160 64" className={className} aria-hidden="true">
      {!outline && (
        <>
          <path d="M74 28 98 28 90 8 80 8Z" fill="#c9d3dc" />
          <path d="M14 28 8 6 24 6 38 28Z" fill={color} />
        </>
      )}
      <path
        d="M10 36Q12 26 32 26L130 26Q152 28 157 35Q152 42 130 43L32 43Q12 44 10 36Z"
        fill={outline ? 'none' : '#fffbf0'}
        stroke={outline ? '#5c4d33' : 'none'}
        strokeWidth="2"
        strokeDasharray={outline ? '6 5' : undefined}
      />
      {!outline && (
        <>
          <path d="M12 38H150" stroke="#1b2a49" strokeWidth="3" />
          <path d="M66 36 102 36 84 60 62 60Z" fill="#dce3e9" />
        </>
      )}
    </svg>
  );
}
