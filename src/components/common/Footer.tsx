import {
  siFacebook,
  siInstagram,
  siX,
} from 'simple-icons/icons'

import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
} from 'lucide-react'

const socialLinks = [
  {
    name: 'Facebook',
    icon: siFacebook,
    url: '#',
  },
  {
    name: 'Instagram',
    icon: siInstagram,
    url: '#',
  },
  {
    name: 'X',
    icon: siX,
    url: '#',
  },
  {
  name: 'LinkedIn',
  icon: {
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.999 20.452H3.67V9h3.329v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  url: '#',
},
]

const footerLinks = [
  {
    title: 'Marketplace',
    links: [
      { name: 'Explore Products', href: '/explore' },
      { name: 'Categories', href: '/categories' },
      { name: 'Popular Stores', href: '/stores' },
      { name: 'Featured Products', href: '/explore' },
    ],
  },
  {
    title: 'For Sellers',
    links: [
      { name: 'Become a Seller', href: '/seller/register' },
      { name: 'Seller Dashboard', href: '/seller/dashboard' },
      { name: 'Seller Guidelines', href: '/seller/guidelines' },
      { name: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

function SocialIcon({
  icon,
  label,
}: {
  icon: { path: string }
  label: string
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-surface text-foreground">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand Information */}
          <div className="lg:col-span-2">

            <a href="/" className="inline-flex items-center text-2xl font-extrabold tracking-tight">
              <span>find</span>
              <span className="text-accent">ai</span>
              <span>market</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-foreground/70">
              Discover products from independent stores around the world.
              Findaimarket connects buyers and sellers through one global
              marketplace.
            </p>

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <Mail size={18} className="text-accent" />
                <span>support@findaimarket.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <Globe size={18} className="text-accent" />
                <span>Global Marketplace</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <MapPin size={18} className="text-accent" />
                <span>Connecting the World</span>
              </div>

            </div>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">

              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-foreground/80 transition-all duration-200 hover:border-accent hover:bg-accent hover:text-on-accent"
                >
                  <SocialIcon
                    icon={social.icon}
                    label={social.name}
                  />
                </a>
              ))}

            </div>

          </div>

          {/* Footer Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>

              <h3 className="mb-6 text-base font-semibold">
                {group.title}
              </h3>

              <ul className="space-y-4">
              {group.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/65 transition-colors duration-200 hover:text-accent"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-brand-border pt-8 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-display text-2xl font-semibold">
              Ready to discover something new?
            </h3>

            <p className="mt-2 text-sm text-foreground/60">
              Explore products and stores from around the world.
            </p>
          </div>

          <a
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-all hover:bg-accent-hover"
          >
            Start Exploring
            <ArrowRight size={17} />
          </a>

        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-brand-border">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-xs text-foreground/50 sm:flex-row">

          <p>
            © {new Date().getFullYear()} Findaimarket. All rights reserved.
          </p>

          <p>
            A marketplace without borders.
          </p>

        </div>

      </div>

    </footer>
  )
}
