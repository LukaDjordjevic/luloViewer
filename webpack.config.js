var path = require('path');
// const nodeExternals = require('webpack-node-externals');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: './src/LuloViewer.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5 * 1024,
              outputPath: 'images'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: './styles.css'
  //   })
  // ],
  externals: {
    react: 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  }
};
