import resolve from '@rollup/plugin-node-resolve';
import resolvePath from 'rollup-plugin-paths';
import copy from 'rollup-plugin-copy-assets';

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
    }),
    copy({
      assets: [
        'data'
      ]
    }),
    resolvePath({
      '/data/': 'data/'
    })
  ]
};
