module.exports = {
  target: 'web',
  mode: 'development',
  entry : __dirname+'/src/index.js',
  output: {
    path: __dirname+'/public/js/',
    filename: 'main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/env", "@babel/preset-react"],
          plugins: [
            ["@babel/plugin-proposal-class-properties", { "loose": false }]
          ]
        }
      }
    ]
  }
}
