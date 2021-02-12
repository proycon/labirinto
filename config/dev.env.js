'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  REGISTRY_URL: '"http://localhost:8080/metadata.json"',
  FORCE_HTTPS: 'false'
})
