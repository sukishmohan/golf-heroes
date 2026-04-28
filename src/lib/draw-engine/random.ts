/**
 * Generate 5 unique random numbers between 1 and 45
 */
export function generateRandomNumbers(): number[] {
  const numbers = new Set<number>()

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }

  return Array.from(numbers).sort((a, b) => a - b)
}
