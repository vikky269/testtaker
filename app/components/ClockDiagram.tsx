export default function ClockDiagram({
  hour,
  minute,
  caption = 'The clock right now',
}: {
  hour: number;
  minute: number;
  caption?: string;
}) {
  const cx = 110;
  const cy = 110;
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const rad = ((n / 12) * Math.PI * 2) - Math.PI / 2;
    return {
      n,
      x: cx + Math.cos(rad) * 78,
      y: cy + Math.sin(rad) * 78,
    };
  });

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const rad = ((i / 60) * Math.PI * 2) - Math.PI / 2;
    const major = i % 5 === 0;
    const inner = major ? 90 : 94;
    const outer = 100;
    return {
      x1: cx + Math.cos(rad) * inner,
      y1: cy + Math.sin(rad) * inner,
      x2: cx + Math.cos(rad) * outer,
      y2: cy + Math.sin(rad) * outer,
      major,
    };
  });

  return (
    <figure className="mb-6 flex flex-col items-center">
      <div className="rounded-3xl border border-[#7FB509]/20 bg-[#f7fde8] px-6 py-4">
        <svg
          viewBox="0 0 220 220"
          className="h-44 w-44 sm:h-52 sm:w-52"
          role="img"
          aria-label={`Analog clock showing ${hour}:${minute.toString().padStart(2, '0')}`}
        >
          <circle cx={cx} cy={cy} r="104" fill="#ffffff" stroke="#7FB509" strokeWidth="6" />
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.major ? '#1C1C1E' : '#d4d4d4'}
              strokeWidth={tick.major ? 2.5 : 1}
              strokeLinecap="round"
            />
          ))}
          {numbers.map(({ n, x, y }) => (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#1C1C1E"
              fontSize="15"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {n}
            </text>
          ))}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 52}
            stroke="#1C1C1E"
            strokeWidth="6"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} ${cx} ${cy})`}
          />
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 74}
            stroke="#7FB509"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} ${cx} ${cy})`}
          />
          <circle cx={cx} cy={cy} r="5" fill="#7FB509" />
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        {caption}
      </figcaption>
    </figure>
  );
}
