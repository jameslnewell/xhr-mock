import typescript from '@alexlur/rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.umd.ts',
  output: {
    file: 'dist/xhr-mock.js',
    format: 'umd',
    name: 'XHRMock',
    exports: 'default'
  },
  plugins: [
    typescript({typescript: require('typescript')}),
    resolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};