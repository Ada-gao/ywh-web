'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.9.60.11:8080/api"'
  // BASE_API: '"http://10.9.70.207:8080/api"'
  // BASE_API: '"http://47.99.32.117/api"'
  // BASE_API: '"http://10.9.70.37:8081/api"'

})
