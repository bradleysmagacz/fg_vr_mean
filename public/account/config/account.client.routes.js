angular.module('account').config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'account/views/account.client.view.html'
  }).otherwise({
    redirectTo: '/'
  });
}]);