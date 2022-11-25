// webpack config
const path = require('path');

module.exports = {
	mode: 'production',
	entry: './build/carousel.js',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'carousel.bundle.js',
		library: {
			name: 'Carousel',
			type: 'iife',
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['to-string-loader', 'css-loader']
			}
		]
	},
	devtool: 'source-map'
}
