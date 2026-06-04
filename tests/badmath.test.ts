import { expect, test } from 'vitest'

// Add intential typo in the toBe statement so test fails
test('adds 3 + 4 to equal 7', () => {
  expect(1 + 2).toBe(8)
})
