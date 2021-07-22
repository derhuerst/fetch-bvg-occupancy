'use strict'

const {inspect} = require('util')
const scrapeOccupancies = require('.')

;(async () => {
	const occupancies = await scrapeOccupancies()
	console.log(inspect(occupancies, {depth: null, colors: true}))
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
