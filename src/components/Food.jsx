// Hand-drawn food for Eat Me First. Every item is flat colour plus one soft highlight,
// on a 64 by 64 grid, so they all sit together at any size.
const shapes = {
  carrot: (
    <>
      <path d="M31 22c7-2 13 2 14 8 .6 4-2 7-6 10-5 4-14 12-22 17-1 .6-2-.4-1.500-1.500C21 47 25 33 31 22Z" fill="#f47a1f" />
      <path d="M33 28l5 4M28 36l5 4M23 45l4 3" stroke="#c9570e" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M38 23c-1-6 1-12 5-16 1 5 1 8 0 11 3-3 7-5 12-5-2 5-5 8-9 10 3 0 6 1 9 3-5 2-11 1-14-1l-3-2Z" fill="#3f9b3c" />
    </>
  ),
  tomato: (
    <>
      <path d="M32 16c13 0 24 8 24 21S45 58 32 58 8 50 8 37s11-21 24-21Z" fill="#e23a2e" />
      <ellipse cx="21" cy="31" rx="6" ry="9" fill="#fff" opacity=".22" transform="rotate(24 21 31)" />
      <path d="M32 20l-4-8 4 3 3-6 2 7 7-2-5 6 8 3-9 1-3 6-3-6-9 2 5-5-8-3Z" fill="#2f8a3b" />
    </>
  ),
  pepper: (
    <>
      <path d="M32 18c5-4 11-5 16-2 7 4 8 15 6 25-2 9-6 17-14 17-3 0-5-2-8-2s-5 2-8 2c-8 0-12-8-14-17-2-10-1-21 6-25 5-3 11-2 16 2Z" fill="#f1a01e" />
      <path d="M24 19c-5 7-6 25-1 36M40 19c5 7 6 25 1 36" stroke="#cf7f0d" strokeWidth="2" fill="none" />
      <ellipse cx="17" cy="33" rx="3.5" ry="9" fill="#fff" opacity=".3" />
      <path d="M29 19c0-4 1-8 5-11l5 3c-3 2-4 5-4 8Z" fill="#3f8f3c" />
    </>
  ),
  broccoli: (
    <>
      <path d="M26 36h12l3 21c0 2-16 2-18 0Z" fill="#8fc65a" />
      <circle cx="20" cy="30" r="11" fill="#2f8a3b" />
      <circle cx="44" cy="30" r="11" fill="#2f8a3b" />
      <circle cx="32" cy="20" r="13" fill="#3a9d45" />
      <circle cx="27" cy="16" r="3" fill="#fff" opacity=".22" />
      <circle cx="16" cy="27" r="2.5" fill="#fff" opacity=".18" />
    </>
  ),
  potato: (
    <>
      <path d="M12 38c-3-10 4-22 17-25 13-3 25 3 26 15 1 11-8 22-22 24-11 2-19-4-21-14Z" fill="#c9a06a" />
      <path d="M20 28c2-5 7-8 12-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".3" fill="none" />
      <g fill="#8f6c3f">
        <circle cx="30" cy="34" r="1.5" />
        <circle cx="42" cy="28" r="1.5" />
        <circle cx="39" cy="42" r="1.5" />
        <circle cx="23" cy="43" r="1.5" />
      </g>
    </>
  ),
  cucumber: (
    <>
      <path d="M11 47C20 29 33 16 48 10c4-2 8 2 6 6-6 15-19 28-37 37-5 2-8-2-6-6Z" fill="#3b8f46" />
      <path d="M21 41c6-8 13-15 22-21M28 44c6-5 12-11 18-18" stroke="#8fd08f" strokeWidth="2" strokeLinecap="round" opacity=".7" fill="none" />
    </>
  ),
  cherries: (
    <>
      <path d="M21 41C24 26 31 14 44 8M45 39C45 26 45 16 44 8" stroke="#4d7c32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 8c4-3 10-3 14 0-4 4-10 4-14 0Z" fill="#4f9a3f" />
      <circle cx="20" cy="45" r="13" fill="#b5122b" />
      <circle cx="45" cy="44" r="13" fill="#cf1a34" />
      <ellipse cx="15" cy="40" rx="3" ry="4.5" fill="#fff" opacity=".4" />
      <ellipse cx="40" cy="39" rx="3" ry="4.5" fill="#fff" opacity=".4" />
    </>
  ),
  pomegranate: (
    <>
      <path d="M26 14l-2-8 5 3 3-5 3 5 5-3-2 8Z" fill="#a51d33" />
      <circle cx="32" cy="36" r="24" fill="#c7213c" />
      <path d="M32 18c8 0 15 7 15 17s-7 18-15 18-15-8-15-18 7-17 15-17Z" fill="#f4d9c0" />
      <g fill="#b0122f">
        <circle cx="26" cy="28" r="3.2" />
        <circle cx="35" cy="26" r="3.2" />
        <circle cx="40" cy="34" r="3.2" />
        <circle cx="31" cy="35" r="3.2" />
        <circle cx="23" cy="37" r="3.2" />
        <circle cx="28" cy="44" r="3.2" />
        <circle cx="37" cy="43" r="3.2" />
      </g>
    </>
  ),
  avocado: (
    <>
      <path d="M32 6c7 0 11 7 13 15 2 7 7 11 7 20 0 11-9 18-20 18s-20-7-20-18c0-9 5-13 7-20 2-8 6-15 13-15Z" fill="#3a6b2f" />
      <path d="M32 11c5 0 8 6 10 12 2 6 6 10 6 18 0 9-7 14-16 14s-16-5-16-14c0-8 4-12 6-18 2-6 5-12 10-12Z" fill="#d7e28a" />
      <circle cx="32" cy="40" r="10" fill="#8a5a2b" />
      <circle cx="29" cy="37" r="2.5" fill="#fff" opacity=".35" />
    </>
  ),
  milk: (
    <>
      <path d="M25 5h14v9c0 5 8 9 8 19v21c0 3-2 5-5 5H22c-3 0-5-2-5-5V33c0-10 8-14 8-19Z" fill="#fff" stroke="#bcd0ec" strokeWidth="2" />
      <path d="M18 34h28v20c0 2-2 4-4 4H22c-2 0-4-2-4-4Z" fill="#e8f0ff" />
      <rect x="23" y="3" width="18" height="5" rx="2" fill="#2323ff" />
      <path d="M24 26c-1 4-1 8-1 12" stroke="#bcd0ec" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  cheese: (
    <>
      <path d="M7 36 44 14c7 4 12 11 13 22Z" fill="#ffd34d" />
      <path d="M7 36h50v18c0 2-2 3-3 3H10c-2 0-3-1-3-3Z" fill="#f6b92b" />
      <circle cx="24" cy="46" r="4" fill="#dd9a14" />
      <circle cx="43" cy="44" r="3" fill="#dd9a14" />
      <circle cx="38" cy="29" r="3" fill="#eeb324" />
    </>
  ),
  yogurt: (
    <>
      <path d="M13 21h38l-5 34c0 2-2 3-4 3H22c-2 0-4-1-4-3Z" fill="#f4f7ff" stroke="#bcd0ec" strokeWidth="2" />
      <rect x="10" y="13" width="44" height="9" rx="3" fill="#2323ff" />
      <path d="M20 34c7-3 17-3 24 0" stroke="#bcd0ec" strokeWidth="2" fill="none" />
    </>
  ),
  paneer: (
    <>
      <path d="M9 25 33 13l22 10v24L31 59 9 47Z" fill="#fff6dc" stroke="#ead9a8" strokeWidth="2" />
      <path d="M9 25l22 11 24-13M31 36v23" stroke="#ead9a8" strokeWidth="2" fill="none" />
    </>
  ),
  eggs: (
    <>
      <ellipse cx="22" cy="37" rx="13" ry="17" fill="#fff" stroke="#e4d6c4" strokeWidth="2" />
      <ellipse cx="43" cy="39" rx="12" ry="16" fill="#f4dfc8" />
      <ellipse cx="18" cy="31" rx="3" ry="5" fill="#f1ebe2" />
    </>
  ),
  curry: (
    <>
      <ellipse cx="32" cy="30" rx="26" ry="14" fill="#1b1b1f" />
      <ellipse cx="32" cy="29" rx="22" ry="11" fill="#e8691c" />
      <g fill="#fff4d6">
        <rect x="19" y="24" width="8" height="8" rx="1.5" transform="rotate(-15 23 28)" />
        <rect x="33" y="21" width="8" height="8" rx="1.5" transform="rotate(20 37 25)" />
        <rect x="38" y="30" width="7" height="7" rx="1.5" transform="rotate(-10 41 33)" />
      </g>
      <g fill="#3f9b3c">
        <circle cx="29" cy="31" r="1.8" />
        <circle cx="33" cy="26" r="1.5" />
        <circle cx="26" cy="23" r="1.5" />
      </g>
      <path d="M6 31c0 15 12 25 26 25s26-10 26-25c-6 10-16 14-26 14S12 41 6 31Z" fill="#2a2a30" />
    </>
  ),
}

export default function Food({ name, className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      {shapes[name]}
    </svg>
  )
}
