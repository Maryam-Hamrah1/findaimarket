import {
  Shirt,
  Smartphone,
  Watch,
  Home,
  Sparkles,
  Dumbbell,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'

const categories = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing & accessories',
    icon: Shirt,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets & technology',
    icon: Smartphone,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Watches & jewelry',
    icon: Watch,
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    description: 'Make your space beautiful',
    icon: Home,
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Beauty & personal care',
    icon: Sparkles,
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Fitness & outdoor',
    icon: Dumbbell,
  },
]

export default function CategoriesSection() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl">

        <SectionHeading
          eyebrow="Explore Our Marketplace"
          title="Browse the way you think"
          description="Explore different categories and discover products that match your style and needs."
          linkText="View All"
          linkTo="/explore"
        />

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <Link
                key={category.name}
                to={`/explore?category=${category.id}`}
                className="group flex flex-col items-center rounded-3xl border border-brand-border bg-surface p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-card sm:p-6"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-foreground transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent">
                  <Icon size={29} strokeWidth={1.7} />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-muted">
                  {category.description}
                </p>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
