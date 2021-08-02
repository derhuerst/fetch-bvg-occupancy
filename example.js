'use strict'

const {inspect} = require('util')
const {scrapeLines, scrapeOccupancies} = require('.')

;(async () => {
	const lines = await scrapeLines()
	console.log('lines:')
	console.log(...lines)

	for (const line of lines) {
		console.log('\n\n')
		console.log('line', line)
		const occupancies = await scrapeOccupancies(line)
		console.log(inspect(occupancies, {depth: null, colors: true}))
	}
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
