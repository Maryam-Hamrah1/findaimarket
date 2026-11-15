const steps = [
  {
    number: '01',
    title: 'Describe it',
    description:
      'Type or speak naturally. Tell us what you want, who it is for and what matters to you.',
  },
  {
    number: '02',
    title: 'We search every store',
    description:
      'Our AI reads across the whole marketplace and picks the products that truly match your request.',
  },
  {
    number: '03',
    title: 'Compare and buy',
    description:
      'Look closer, ask questions, compare options and check out in one place.',
  },
]

export default function HowItWorks() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl">

        <h2 className="mb-12 max-w-2xl font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
          Three steps. No scrolling through thousands of results.
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="font-display text-7xl font-medium leading-none text-accent">
                {step.number}
              </p>

              <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                {step.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
