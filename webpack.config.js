import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
export default [
    {
        mode:'none',
        entry: "./public/index.js",
        output: {
            filename: "./webpack/index.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
            ], 
        },
        optimization: {
			minimize: true,
			minimizer: [new TerserPlugin()],
		},
    },
    {
        mode: 'none',
		entry: "./public/style.less",
		module: {
			rules: [
				{
					test: /\.less$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
                        'less-loader'
					],
				},
			],
		},
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },
		plugins: [
			new MiniCssExtractPlugin({
				filename: './webpack/style.css'
			}),
            new MiniCssExtractPlugin()
		],
    }
]