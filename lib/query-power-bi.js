'use strict'

const fetch = require('cross-fetch')
const get = require('lodash/get')

const API_URL = 'https://wabi-europe-north-b-api.analysis.windows.net/public/reports/querydata?synchronous=true'

const queryPowerBIQuerydataAPI = async (query) => {
	const request = {
		version: '1.0.0',
		modelId: 4254518,
		queries: [query],
		cancelQueries: [],
	}

	const res = await fetch(API_URL, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json;charset=UTF-8',
			// todo: generate these
			'ActivityId': 'd319bd45-120c-9b1b-a7ce-81f58e255f6e',
			'RequestId': '41acd5f4-6f4b-9549-7fe4-82cb212cb549',
			'X-PowerBI-ResourceKey': 'ad8e4e13-081c-432c-ad68-6e054c8a89af',
		},
		body: JSON.stringify(request),
	})

	if (!res.ok) {
		const err = new Error(res.statusText)
		err.statusCode = res.status
		err.req = request
		err.res = res
		throw err
	}
	const body = await res.json()

	const result = get(body, 'results[0].result')
	if (result.error) {
		const err = new Error('unknown PowerBI server error')
		err.data = result.error
		err.req = request
		err.res = res
		throw err
	}

	return result.data
}

module.exports = queryPowerBIQuerydataAPI
