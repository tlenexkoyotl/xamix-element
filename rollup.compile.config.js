import resolve from '@rollup/plugin-node-resolve';

module.exports = {
  input: ['xamix-element.js'],
  output: {
    dir: 'dist',
    format: 'umd'
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ]
};
