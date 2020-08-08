const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const patterns = [
    { from: 'src/index.html', to: '.' },
    { from: 'src/style.css', to: '.' },
    { from: 'src/fonts', to: './fonts' },
    { from: 'src/images', to: './images' },
    { from: 'src/favicon.ico', to: '.' },
    { from: 'src/.htaccess', to: '.' }
];

module.exports = {
    entry: './src/js/bundle.ts',
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    'ts-loader',
                    'eslint-loader'
                ],
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                use: 'html-loader'
            }, {
                test: /\.scss$/,
                use: [
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CopyPlugin({patterns}),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ]
    },
    devServer: {
        contentBase: 'dist',
        compress: true,
        hot: true
    }
};
