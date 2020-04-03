/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('../.babelrc')

require('@babel/register')({ ...config, extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'] })
