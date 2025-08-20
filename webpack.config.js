const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // ... other config (loaders, devServer, etc.)
  plugins: [
    new Dotenv(), // This will load .env at project root
  ],
};
