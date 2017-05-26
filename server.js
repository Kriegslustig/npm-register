'use strict'

const opbeat = require('./lib/opbeat')

const app = require('koa')()
const compress = require('koa-compress')
const config = require('./config')
const routes = require('./routes')
const middleware = require('./middleware')
const sendfile = require('koa-sendfile')
const r = require('koa-router')()
const path = require('path')

app.name = 'npm-register'
app.port = config.port
app.proxy = config.production
app.context.opbeat = opbeat

app.use(require('./logger'))
app.use(require('koa-timeout')(config.timeout))
app.use(compress())
app.use(middleware.error)
app.use(routes.routes())
app.use(routes.allowedMethods())

r.get('/', function * () {
  yield sendfile(this, path.join(__dirname, 'public/index.html'))
})

r.get('/-/ping', function * () {
  this.body = {}
})

app.use(r.routes())
app.use(r.allowedMethods())

app.use(middleware.notfound)

module.exports = app
