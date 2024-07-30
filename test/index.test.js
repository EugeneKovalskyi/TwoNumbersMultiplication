import { getRandomMultiplier } from '../index.js';

describe.each([
	[1, 2],
	[1, 10],
	[2, 100],
	[20, 100],
])('D> getRandomMultiplier(%i, %i)', (from, to) => {
	const number = getRandomMultiplier(from, to)

	test(`Number from ${from} to ${to}`, () => {
		expect(number).toBeGreaterThanOrEqual(from)
		expect(number).toBeLessThanOrEqual(to)
	});
});
