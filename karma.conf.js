
module.exports = function(config) {
	config.set({
		frameworks: ['jasmine'],
		files: [
			'public/js/jquery-2.1.4.min.js',
			'public/lib/angular/angular.js', 
			'public/lib/angular-resource/angular-resource.js', 
			'public/lib/angular-route/angular-route.js', 
			'public/lib/angular-mocks/angular-mocks.js', 
			'public/application.js', 
			'public/*[!lib]*/*.js', 
			'public/*[!lib]*/*[!tests]*/*.js', 
			'public/*[!lib]*/tests/unit/*.js'
		],
		reporters: ['progress'],
		preprocessors: {
			'**/*.jade': ['jade']
		},
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		singleRun: true,
		debug: true
	});
};