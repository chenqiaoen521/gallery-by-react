 var config = {
   entry: './components/GalleryByReactApp.js',
	 output: {
    publicPath: 'assets/',
    path: 'dist/assets/',
    filename: 'main.js'
  },
   devServer: {
      inline: true,
      port: 7777
   },
	
   module: {
      loaders: [ {
         test: /\.jsx?$/,
         exclude: /node_modules/,
         loader: 'babel',
         query: {
            presets: ['es2015', 'react']
         }
      },
      {
         test:/\.css$/,
         loader:'style-loader!css-loader!autoprefixer?{browsers:["last 2 version"]}'
      },
      {
         test:/\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
         loader:'url-loader?limit=8192'
      },
      {
         test:/\.json$/,
         loader:'json-loader'
      }
      ]
   }
	
}

module.exports = config;