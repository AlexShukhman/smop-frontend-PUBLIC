module.exports = {
    entry: "./public/react_root/react_router.js",
    output: {
        path: __dirname + "/public/react_root",
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.(pdf|jpg|png|gif|svg|ico)$/,
            use: [{
                loader: 'url-loader'
            }, ]
        }, {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['@babel/react']
            }
        }]
    },
    mode: 'none'
}