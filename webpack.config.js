const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
//const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


//const autoprefixer = require("autoprefixer");

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        target: "web",
        entry: {
            main: "./src/main.js",
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
            chunkFilename: '[id].[fullhash:8].js',
        },
        module: {
            rules: [{
                    test: /\.(js|mjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                },
                {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[ext]?[hash]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|jpeg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            //new MiniCssExtractPlugin(),
            new htmlWebpackPlugin({
                template: path.resolve(__dirname, "public", "index.html"),
                favicon: "./public/favicon.ico",
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].[hash].css' : '[name].css',
                chunkFilename: isProduction ? '[id].[hash].css' : '[id].css'
            }),
            new CleanWebpackPlugin(),
        ],
        resolve: {
            alias: {
                //'vue': "vue/dist/vue.runtime.esm.js",
                'vue': '@vue/runtime-dom'
            },
            extensions: ["*", ".js", ".vue", ".json", ".jpeg"],

        },
        devServer: {
            static: {
                directory: path.resolve(__dirname, 'public/'),
            },
            devMiddleware: {
                publicPath: '/dist/'
            },
            port: 3000,
            hot: "only"
        },
        optimization: {
            runtimeChunk: 'single',
            concatenateModules: true,
            emitOnErrors: true,
            minimizer: [
                new TerserPlugin(),
                //new OptimizeCSSAssetsPlugin({}),
            ]
        },
        //nodeIntegration: true,
        externalsPresets: { node: true },
        //mode: 'development',
        stats: 'verbose',
        devtool: 'eval-source-map',

    }
};