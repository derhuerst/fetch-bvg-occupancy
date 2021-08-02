'use strict'

const get = require('lodash/get')

const parseDataset = (dataset, descriptor) => {
	const parseValue = (val, field) => {
		// ref to dictionary
		if (field.DN) {
			const dict = dataset.ValueDicts[field.DN]
			return dict[val]
		}
		// bare value
		return val
	}

	const parseName = (field) => {
		const selection = descriptor.Select.find(s => s.Value === field.N)
		return selection.Name
	}

	const parseCollection = (items, DM1 = [], root = true, schema = items[0] && items[0].S, currentFields = Object.create(null)) => {
		const subSchema = get(items, '[0].X[0].S') || schema
		const subCurrentFields = Object.create(null)

		let currentC = []

		return items
		.map((item, itemIdx) => {
			const _ = {
				data: Object.create(null)
			}

			// todo: is item.R the flag that controls this?
			const referenced = root ? null : DM1[itemIdx]
			if (referenced) Object.assign(_.data, referenced.data)

			if (item.C) {
				currentC = [
					...currentC.slice(0, currentC.length - item.C.length),
					...item.C,
				]

				for (let idx = 0; idx < currentC.length; idx++) {
					const val = currentC[idx]
					const field = schema[idx]

					const name = parseName(field)
					_.data[name] = parseValue(val, field)
				}
			}

			for (const field of schema) {
				if (!(field.N in item)) continue; // skip
				const val = item[field.N]

				const name = parseName(field)
				currentFields[name] = parseValue(val, field)
			}
			Object.assign(_.data, currentFields)

			if (item.X) {
				_.children = parseCollection(item.X, DM1, false, subSchema, subCurrentFields)
			}

			return _
		})
	}

	const DM1 = parseCollection(get(dataset, 'SH[0].DM1', []))
	return parseCollection(dataset.PH[0].DM0, DM1)
}

module.exports = parseDataset
