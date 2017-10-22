const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const builtins = require('rollup-plugin-node-builtins');
const filesize = require('rollup-plugin-filesize');

const env = process.env.NODE_ENV;
const version = process.env.npm_package_version;

const config = {
  input: 'modules/index.js',
  name: '@flopflip-launchdarkly-adapter',
  sourcemap: true,
  plugins: [
    commonjs(),
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    resolve({
      module: true,
    }),
    builtins(),
    filesize(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        warnings: false,
      },
    })
  );
}

module.exports = config;