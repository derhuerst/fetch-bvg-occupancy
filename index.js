'use strict'

const get = require('lodash/get')
const {ok, equal} = require('assert')
const queryPowerBIQuerydataAPI = require('./lib/query-power-bi')
const parseDataset = require('./lib/parse-dataset')

const DATASET_ID = '9d8303d9-f00b-413d-979b-ec07adfd5250'
const REPORT_ID = 'e5abf89c-11a2-4147-bf65-ce6d31f769f2'
const VISUAL_ID = '9407ffc3de946bc556ef'

const TABLE = '0069_0700_Export'
const COLUMNS = [
	['Linie', 'line'],
	['Richtung', 'variant'],
	['Hst', 'stop'],
	['Stunde', 'hour'],
]

const columnExpression = (table, column) => ({
	Expression: {SourceRef: {Source: table}},
	Property: column,
})
const literalExpression = (val) => ({
	Literal: {Value: val},
})

const linesQuery = {
	SemanticQueryDataShapeCommand: {
		Query: {
			Version: 2,
			From: [{
				Name: 'data',
				Entity: '0069_0700_Export',
			}],
			Select: [{
				Column: columnExpression('data', 'Linie'),
				Name: 'line',
			}],
		},
		Binding: {
			Primary: {
				Groupings: [{
					Projections: [0],
				}],
			},
			DataReduction: {
				DataVolume: 3,
				Primary: {
					Top: {Count: 1000},
				},
			},
			Version: 1
		},
	},
}

const occupanciesQuery = (line) => ({
	SemanticQueryDataShapeCommand: {
		Binding: {
			DataReduction: {
				DataVolume: 3,
				Primary: {
					// The limit seems to be 500 here. We stay well below.
					Window: {Count: 100},
				},
				Secondary: {
					Top: {Count: 100},
				}
			},
			Primary: {
				Groupings: [
					{Projections: [0, 1, 2]}
				]
			},
			Secondary: {
				Groupings: [
					{Projections: [3, 4]}
				]
			},
			SuppressedJoinPredicates: [3],
			Version: 1
		},
		Query: {
			Version: 2,
			From: [{
				Entity: TABLE,
				Name: 'data',
				Type: 0,
			}],
			Select: [
				...COLUMNS.map(([column, alias]) => ({
					Column: columnExpression('data', column),
					Name: alias,
				})),
				{
					Aggregation: {
						Expression: {
							Column: columnExpression('data', 'Farbe'),
						},
						// todo: both work, what is the difference?
						Function: 0,
						// Function: 1,
					},
					Name: 'occupancy',
				},
			],
			Where: [
				{
					Condition: {
						In: {
							Expressions: [{
								Column: columnExpression('data', 'Linie'),
							}],
							Values: [
								[literalExpression(`'${line}'`)],
							],
						}
					}
				},
			],
			OrderBy: [{
				Direction: 1,
				Expression: {
					Column: columnExpression('data', 'Linie'),
				}
			}, {
				Direction: 1,
				Expression: {
					Column: columnExpression('data', 'Richtung'),
				}
			}, {
				Direction: 1,
				Expression: {
					Column: columnExpression('data', 'Hst'),
				}
			}],
		}
	}
})

const queryBVGPowerBIReport = async (queryCmd) => {
	const result = await queryPowerBIQuerydataAPI({
		Query: {
			Commands: [queryCmd],
		},
		QueryId: '',
		ApplicationContext: {
			DatasetId: DATASET_ID,
			Sources: [{
				ReportId: REPORT_ID,
				VisualId: VISUAL_ID,
			}],
		},
	})

	const descriptor = get(result, 'descriptor')
	ok(descriptor, 'missing descriptor')
	const dataset = get(result, 'dsr.DS[0]')
	ok(dataset, 'missing dataset')

	const parsed = parseDataset(dataset, descriptor)
	return parsed
}

const scrapeLines = async () => {
	const result = await queryBVGPowerBIReport(linesQuery)
	return result.map(({data: {line}}) => line)
}

const scrapeOccupancies = async (line) => {
	equal(typeof line, 'string', 'line must be a string')
	ok(line, 'line must not be empty')

	const result = await queryBVGPowerBIReport(occupanciesQuery(line))

	const byVariant = new Map() // variant -> stop -> [[hour, occupancy], ...]
	for (const {data: {variant, stop}, children: _occupancies} of result) {
		if (_occupancies.length === 0) continue // todo: is this a parsing bug?

		let byStop = new Map()
		if (byVariant.has(variant)) byStop = byVariant.get(variant)
		else byVariant.set(variant, byStop)

		const occupancies = _occupancies.map(({data}) => [
			data.hour,
			'occupancy' in data ? data.occupancy : null,
		])
		byStop.set(stop, occupancies)
	}
	return byVariant
}

module.exports = {
	scrapeLines,
	scrapeOccupancies,
}
