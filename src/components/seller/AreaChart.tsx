interface AreaChartProps {
  labels: readonly string[]
  values: readonly number[]
  /** Text for the axis and the hover tip, e.g. "$1,200" */
  format: (value: number) => string
  /** What the chart shows, read out by screen readers */
  label: string
}

const W = 640
const H = 240
const PAD = { top: 14, right: 14, bottom: 30, left: 56 }

function niceMax(value: number): number {
  if (value <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((candidate) => candidate >= value) ?? value
  return step
}

/** A simple line chart with a soft fill. Drawn in SVG, no chart library. */
export default function AreaChart({ labels, values, format, label }: AreaChartProps) {
  const max = niceMax(Math.max(0, ...values))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (index: number) => PAD.left + (values.length <= 1 ? innerW / 2 : (index / (values.length - 1)) * innerW)
  const y = (value: number) => PAD.top + innerH - (value / max) * innerH

  const line = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(' ')
  const area = values.length > 0 ? `${line} L${x(values.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z` : ''
  const ticks = [0, 0.25, 0.5, 0.75, 1]
  const labelEvery = Math.max(1, Math.ceil(values.length / 6))

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(max * tick)} y2={y(max * tick)} className="stroke-brand-border" strokeWidth="1" />
            <text x={PAD.left - 8} y={y(max * tick) + 4} textAnchor="end" className="fill-muted text-[11px]">
              {format(Math.round(max * tick))}
            </text>
          </g>
        ))}

        {area && <path d={area} className="fill-accent/15" />}
        {line && <path d={line} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}

        {values.map((value, index) => (
          <g key={`${labels[index]}-${index}`}>
            <circle cx={x(index)} cy={y(value)} r={values.length > 40 ? 0 : 3.5} className="fill-background stroke-accent" strokeWidth="2" />
            <circle cx={x(index)} cy={y(value)} r="10" fill="transparent">
              <title>{`${labels[index] ?? ''}: ${format(value)}`}</title>
            </circle>
            {index % labelEvery === 0 && (
              <text x={x(index)} y={H - 8} textAnchor="middle" className="fill-muted text-[11px]">
                {labels[index]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  )
}
