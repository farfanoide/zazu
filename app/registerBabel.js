const config = require('../.babelrc')

require('@babel/register')({ ...config, extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'] })
