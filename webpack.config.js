const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	target: 'node',
	output: {
		libraryTarget: 'commonjs',
		filename: './aws-env'
	},
	entry: './index.js',
	mode: 'production',
	plugins: [
		new webpack.BannerPlugin({
			banner: '#!/usr/bin/env node',
			entryOnly: true,
			raw: true
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					warnings: false,
					parse: {},
					compress: {},
					mangle: true, // Note `mangle.properties` is `false` by default.
					toplevel: false,
					nameCache: null,
					ie8: false,
					keep_fnames: false,
					output: {
						comments: false
					}
				}
			})
		]
	},
	devtool: false
};
