import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  Config,
} from 'unique-names-generator'

const config: Config = {
  dictionaries: [adjectives, animals],
  separator: '-',
  length: 2,
}

export const generateUniqueName = () => uniqueNamesGenerator(config)

export const colors = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#fbbf24',
  green: '#4ade80',
  blue: '#22c3f6',
  purple: '#9b6cf6',
  pink: '#f77ee0',
} as const

/**
 * Assigns an option to a new user based on the least number of existing assignments.
 * If multiple options have the same minimum count, one is selected randomly.
 *
 * @template T - The type of the options.
 * @param {T[]} availableOptions - An array of unique options to pick from.
 * @param {T[]} existingOptions - An array of options that have already been picked/assigned.
 * @returns {T} - The selected option to assign to the new user.
 * @throws {Error} - If `availableOptions` is empty.
 */
export function assignOption<T>(
  availableOptions: T[],
  existingOptions: T[],
): T {
  if (!availableOptions || availableOptions.length === 0) {
    throw new Error('No available options to assign.')
  }

  // Initialize a map to count assignments for each available option
  const optionCounts: Map<T, number> = new Map()

  // Initialize counts to 0 for all available options
  for (const option of availableOptions) {
    optionCounts.set(option, 0)
  }

  // Count existing assignments, ignoring options not in availableOptions
  for (const option of existingOptions) {
    if (optionCounts.has(option)) {
      optionCounts.set(option, optionCounts.get(option)! + 1)
    }
  }

  // Find the minimum assignment count
  let minCount = Infinity
  for (const count of optionCounts.values()) {
    if (count < minCount) {
      minCount = count
    }
  }

  // Collect all options that have the minimum assignment count
  const leastAssignedOptions: T[] = []
  for (const [option, count] of optionCounts.entries()) {
    if (count === minCount) {
      leastAssignedOptions.push(option)
    }
  }

  // Randomly select one option from the least assigned options
  const randomIndex = Math.floor(Math.random() * leastAssignedOptions.length)
  const selectedOption = leastAssignedOptions[randomIndex]

  return selectedOption
}
