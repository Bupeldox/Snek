const path = require('path');

// use 'npx webpack serve' to start a dev server.


module.exports = {
    entry:{
        "levelEditor.js":"./src/levelEditor.js",
        "bundle.js":"./src/bundles.js"
    },
    mode: 'development',
    output: {
        filename: "[name]",
        path: path.resolve(__dirname, "docs"),

    },
    optimization: {
        minimize: false
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs'),
        },
        compress: false,
        port: 9000,
    },
};