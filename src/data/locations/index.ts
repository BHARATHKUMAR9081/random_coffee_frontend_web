import countriesJson from './countries.json'
import languagesJson from './languages.json'
import statesCitiesJson from './states-cities.json'

export interface Country {
  code: string
  name: string
  flag: string
}

export interface StateCities {
  name: string
  cities: string[]
}

export const COUNTRIES = countriesJson.countries as Country[]

export const STATES_BY_COUNTRY = statesCitiesJson.countries as Record<string, StateCities[]>

export function countryByName(name: string): Country | undefined {
  return COUNTRIES.find((country) => country.name === name)
}

export function countryFlag(name: string): string {
  return countryByName(name)?.flag ?? ''
}

export function getStates(country: string): string[] {
  return (STATES_BY_COUNTRY[country] ?? []).map((state) => state.name)
}

export function getCities(country: string, state: string): string[] {
  const match = (STATES_BY_COUNTRY[country] ?? []).find((row) => row.name === state)
  return match?.cities ?? []
}

export const LANGUAGES = languagesJson.languages as string[]
