const path = require('path');

// use 'npx webpack serve' to start a dev server.


module.exports = {
    entry: "./src/bundles.js",
    mode: 'development',
    output: {
        filename: "bundles.js",
        path: path.resolve(__dirname, "dist"),

    },
    optimization: {
        minimize: false
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: false,
        port: 9000,
    },
};