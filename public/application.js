var mainApplicationModuleName = 'fg_vr';

var mainApplicationModule = angular.module(mainApplicationModuleName, [
	'ngResource', 
	'ngRoute', 
	'users', 
	'articles', 
	'index', 
	'chat',
	'account', 
	'videos'
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});

mainApplicationModule.config(['$locationProvider', 
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

if (window.location.hash === '#_=_') {
	window.location.hash = '#!';
}

