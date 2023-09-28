const path = require("path");

module.exports = {
	// Other webpack configuration options...

	resolve: {
		fallback: {
			https: require.resolve("https-browserify"),
			os: require.resolve("os-browserify/browser"),
			util: require.resolve("util/"),
			zlib: require.resolve("browserify-zlib"),
			crypto: require.resolve("crypto-browserify"),
			stream: require.resolve("stream-browserify"),
			buffer: require.resolve("buffer/"),
			querystring: require.resolve("querystring-es3"),
			path: require.resolve("path-browserify"),
			url: require.resolve("url/"),
		},
	},
};
