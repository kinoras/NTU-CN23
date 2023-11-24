const tailwindPlugin = require('prettier-plugin-tailwindcss')
const tidyImportsPlugin = require('@trivago/prettier-plugin-sort-imports')

module.exports = {
    parsers: {
        babel: {
            ...tailwindPlugin.parsers.babel,
            preprocess: tidyImportsPlugin.parsers.babel.preprocess
        }
    }
}
