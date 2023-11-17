const path = require('path')

module.exports = (config) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.join(__dirname, '.', 'src')
    }
    return config
}
