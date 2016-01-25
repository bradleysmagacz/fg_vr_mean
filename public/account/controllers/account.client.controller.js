angular.module('account').controller('AccountController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		
		$scope.authentication = Authentication;

		if (Authentication.user==null) {
			window.location.href = "/login";
		}
	}
]);