import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: {
      file: 'docs/index.js',
      format: 'umd',
      name: 'gol-js-wasm',
      sourcemap: true
    },
    plugins: [
        typescript()
    ]
};