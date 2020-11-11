const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		main: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader:"babel-loader",
					options:{
						presets: [
							"@babel/preset-env",
							"@babel/preset-react"
            			], 
					plugins: 
						[require("@babel/plugin-proposal-class-properties")]
					}
				},
		    },
			{
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					name: '[name]_[hash].[ext]',
					outputPath: 'images/',
					limit: 10240
				}
			} 
		}, 
		{
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loader'
			} 
		}, 
		{
			test: /\.css$/,
			use: [
			"style-loader", 
			{loader: "css-loader", options: {modules: true}},
			// {
			//   loader: 'postcss-loader',
			//   options:{  
			//       plugins:[
			//           require("autoprefixer")("last 100 versions")]
			//         }
			//   },
			// "sass-loader",
			// "postcss-loader"
				],
			exclude: /node_modules/,
	},

	]
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/index.html'
	  }), new CleanWebpackPlugin()],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}