var path = require('path')
var vm = require('vm')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var MFS = require('memory-fs')
var notifier = require('node-notifier')
var createWebpackConfig = require('./createWebpackConfig')

exports.setupClient = function setupClient(config) {
	var clientConfig = createWebpackConfig(config)
	var compiler = webpack(clientConfig)
	var middleware = webpackDevMiddleware(compiler, {
		publicPath: config.staticPath,
		stats: config.webpackLogger,
		serverSideRender: true,
		reporter: (middlewareOptions, options) => {
			reporter(middlewareOptions, options)
			if (config.notifier) {
				notifier.notify({
					title: 'React-IMVC',
					message: 'Webpack 编译结束'
				})
			}
		}
	})
	return {
		middleware,
		compiler
	}
}

exports.setupServer = function setupServer(config, options) {
	return
	var serverConfig = createWebpackConfig(config)
	serverConfig.target = 'node'
	var serverCompiler = webpack(serverConfig)
	var mfs = new MFS()
	var outputPath = path.join(
		serverConfig.output.path,
		serverConfig.output.filename
	)
	serverCompiler.outputFileSystem = mfs
	serverCompiler.watch({}, (err, stats) => {
		if (err) throw err
		stats = stats.toJson()
		stats.errors.forEach(err => console.error(err))
		stats.warnings.forEach(err => console.warn(err))
		var sourceCode = mfs.readFileSync(outputPath, 'utf-8')

		// 构造一个 commonjs 的模块加载函数，拿到 newModule
		var newModule = vm.runInThisContext(
			`
			(function(require) {
				var module = {exports: {}}
                var factory = function(require, module, exports) {
                    ${sourceCode}
                }
                try {
                    factory(require, module, module.exports)
                } catch(error) {
                    console.log(error)
                    return null
                }
                return module.exports
			})
		`
		)(require)

		if (newModule) {
			options.handleHotModule(newModule.default || newModule)
		}
	})
}

function reporter(middlewareOptions, options) {
	const { log, state, stats } = options

	if (state) {
		const displayStats = middlewareOptions.stats !== false
		
		if (displayStats) {
			if (stats.hasErrors()) {
				log.error(stats.toString(middlewareOptions.stats))
			} else if (stats.hasWarnings()) {
				log.warn(stats.toString(middlewareOptions.stats))
			} else {
				log.info(stats.toString(middlewareOptions.stats))
			}
		}

		let message = 'Compiled successfully.'

		if (stats.hasErrors()) {
			message = 'Failed to compile.'
		} else if (stats.hasWarnings()) {
			message = 'Compiled with warnings.'
		}
		log.info(message)
	} else {
		log.info('Compiling...')
	}
}
