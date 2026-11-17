import type { Country } from '../types/checkout'

/*
  Countries the demo checkout knows how to address.

  Address formats differ around the world, so every country says which parts
  it uses: some have no postal codes at all, some have no states or provinces.
  The form follows these rules instead of assuming one format.
  Add a country here and the form supports it.
*/

const c = (
  code: string,
  name: string,
  regionLabel: string,
  region: Country['region'],
  postal: Country['postal'],
  postalPattern?: RegExp,
  postalExample?: string,
): Country => ({ code, name, regionLabel, region, postal, postalPattern, postalExample })

export const COUNTRIES: ReadonlyArray<Country> = [
  c('AF', 'Afghanistan', 'Province', 'required', 'optional', /^\d{4}$/, '1001'),
  c('AU', 'Australia', 'State / Territory', 'required', 'required', /^\d{4}$/, '2000'),
  c('BR', 'Brazil', 'State', 'required', 'required', /^\d{5}-?\d{3}$/, '01310-100'),
  c('CA', 'Canada', 'Province / Territory', 'required', 'required', /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'K1A 0B1'),
  c('CN', 'China', 'Province', 'required', 'required', /^\d{6}$/, '100000'),
  c('EG', 'Egypt', 'Governorate', 'required', 'optional', /^\d{5}$/, '11511'),
  c('FR', 'France', 'Region', 'optional', 'required', /^\d{5}$/, '75001'),
  c('DE', 'Germany', 'State', 'optional', 'required', /^\d{5}$/, '10115'),
  c('HK', 'Hong Kong', 'District', 'optional', 'none'),
  c('IN', 'India', 'State', 'required', 'required', /^\d{6}$/, '110001'),
  c('IR', 'Iran', 'Province', 'required', 'required', /^\d{5}-?\d{5}$/, '11369-12345'),
  c('IE', 'Ireland', 'County', 'required', 'optional', /^[A-Za-z]\d{2}\s?[A-Za-z0-9]{4}$/, 'D02 X285'),
  c('IT', 'Italy', 'Province', 'required', 'required', /^\d{5}$/, '00100'),
  c('JP', 'Japan', 'Prefecture', 'required', 'required', /^\d{3}-?\d{4}$/, '100-0001'),
  c('MX', 'Mexico', 'State', 'required', 'required', /^\d{5}$/, '06000'),
  c('NL', 'Netherlands', 'Province', 'optional', 'required', /^\d{4}\s?[A-Za-z]{2}$/, '1012 AB'),
  c('NG', 'Nigeria', 'State', 'required', 'optional', /^\d{6}$/, '100001'),
  c('NO', 'Norway', 'County', 'optional', 'required', /^\d{4}$/, '0150'),
  c('PK', 'Pakistan', 'Province', 'required', 'optional', /^\d{5}$/, '44000'),
  c('QA', 'Qatar', 'Municipality', 'optional', 'none'),
  c('SA', 'Saudi Arabia', 'Region', 'required', 'optional', /^\d{5}$/, '11564'),
  c('SG', 'Singapore', 'Region', 'none', 'required', /^\d{6}$/, '018956'),
  c('ZA', 'South Africa', 'Province', 'required', 'required', /^\d{4}$/, '0001'),
  c('ES', 'Spain', 'Province', 'required', 'required', /^\d{5}$/, '28001'),
  c('SE', 'Sweden', 'County', 'optional', 'required', /^\d{3}\s?\d{2}$/, '111 22'),
  c('TR', 'Türkiye', 'Province', 'required', 'required', /^\d{5}$/, '34000'),
  c('AE', 'United Arab Emirates', 'Emirate', 'required', 'none'),
  c('GB', 'United Kingdom', 'County', 'optional', 'required', /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, 'SW1A 1AA'),
  c('US', 'United States', 'State', 'required', 'required', /^\d{5}(-\d{4})?$/, '10001'),
]

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code)
}

/** Store records name their country in English; checkout stores the ISO code. */
export function getCountryCodeByName(name: string): string | undefined {
  const normalised = name.trim().toLowerCase()
  const aliases: Record<string, string> = { turkey: 'TR', türkiye: 'TR' }

  return (
    aliases[normalised] ??
    COUNTRIES.find((country) => country.name.toLowerCase() === normalised)?.code
  )
}
