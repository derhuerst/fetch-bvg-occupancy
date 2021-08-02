# fetch-bvg-occupancy

**Scrape the average occupancy of [BVG](https://en.wikipedia.org/wiki/Berliner_Verkehrsbetriebe) lines from [their Power BI Report](https://app.powerbi.com/view?r=eyJrIjoiYWQ4ZTRlMTMtMDgxYy00MzJjLWFkNjgtNmUwNTRjOGE4OWFmIiwidCI6ImMxZGViZDk4LWM0ODEtNGU1MS1iMjg2LWY2ZWRhOGZjZWE0OCIsImMiOjh9).**

[![npm version](https://img.shields.io/npm/v/fetch-bvg-occupancy.svg)](https://www.npmjs.com/package/fetch-bvg-occupancy)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/fetch-bvg-occupancy.svg)
![minimum Node.js version](https://img.shields.io/node/v/fetch-bvg-occupancy.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install fetch-bvg-occupancy
```


## Usage

```js
const {scrapeLines, scrapeOccupancies} = require('fetch-bvg-occupancy')

const lines = await scrapeLines()
console.log('lines', ...lines)

const occupancies = await scrapeOccupancies(lines[0])
console.log(occupancies)
```

```
lines 100 101 104 108 110 112 114 122 123 124 125 130 131 133 134 135 137 139 140 142 147 150 154 160 164 166 169 175 179 187 191 192 194 197 200 221 240 245 247 248 249 255 256 260 269 271 275 277 282 291 294 296 300 371 372 377 395 398 399 744 M19 M21 M27 M29 M32 M36 M41 M44 M45 M46 M49 M76 M82 X10 X21 X33 X34 X54 X69 X83 12 16 18 21 27 37 50 60 61 67 68 M1 M2 M5 M6 M8 M10 M13 M17 U1

Map(2) {
	'(H) Hertzallee > Memhardstr.' => Map(18) {
		'(01) Hertzallee' => [
			[ 6, 0 ],     [ 7, null ],
			[ 8, null ],  [ 9, null ],
			[ 10, null ], [ 11, null ],
			[ 12, null ], [ 13, null ],
			[ 14, null ], [ 15, null ],
			[ 16, null ], [ 17, null ],
			[ 18, null ], [ 19, null ],
			[ 20, null ]
		],
		'(02) S+U Zoologischer Garten' => [
			[ 6, 1 ],     [ 7, 0 ],
			[ 8, 1 ],     [ 9, 0 ],
			[ 10, 1 ],    [ 11, 0 ],
			[ 12, 1 ],    [ 13, null ],
			[ 14, null ], [ 15, null ],
			[ 16, null ], [ 17, 0 ],
			[ 18, null ], [ 19, null ],
			[ 20, null ]
		],
		// …
	},
	'(R) S+U Alexanderpl/Memhardstr.[Bus] > S+U Zoolog. Garten/Jebensstr.' => Map(16) {
		'(01) S+U Alexanderpl/Memhardstr.[Bus]' => [
			[ 6, null ],  [ 7, null ],
			[ 8, null ],  [ 9, null ],
			[ 10, null ], [ 11, null ],
			[ 12, null ], [ 13, null ],
			[ 14, null ], [ 15, null ],
			[ 16, null ], [ 17, null ],
			[ 18, null ], [ 19, null ],
			[ 20, null ]
		],
		'(02) Spandauer Str./Marienkirche' => [
			[ 6, null ],  [ 7, null ],
			[ 8, null ],  [ 9, null ],
			[ 10, null ], [ 11, 1 ],
			[ 12, 0 ],    [ 13, null ],
			[ 14, null ], [ 15, 1 ],
			[ 16, 0 ],    [ 17, null ],
			[ 18, null ], [ 19, null ],
			[ 20, null ]
		],
		// …
	}
}
```


## Contributing

If you have a question or need support using `fetch-bvg-occupancy`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/fetch-bvg-occupancy/issues).
