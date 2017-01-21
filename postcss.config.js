
// Specs for selected pre-/post-processors addins:
module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-nested')
  ]
};
