angular.module('videos').controller('VideosController', ['$scope', '$routeParams', '$location', 'Authentication', 'Videos',
	function($scope, $routeParams, $location, Authentication, Videos) {
		
		$scope.authentication = Authentication;

		$scope.orderProp = '-created';
		$scope.quantity = '3';

		$scope.create = function() {

			var categoryField = this.categories;
			categoryField = categoryField.replace(/\s+/g, '').toLowerCase();

			var categoryArray = [];
    		categoryArray = categoryField.split(",");

			var video = new Videos({
				title: this.title,
				description: this.description,
				categories: categoryArray
			});

			video.$save(function(response) { 
				$location.path('videos/' + response._id);
			}, function(errorResponse) { 
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.videos = Videos.query();
		};

		$scope.findOne = function() {
			$scope.video = Videos.get({
				videoId: $routeParams.videoId
			});
		};

		$scope.update = function() {
			$scope.video.$update(function() {
				$location.path('videos/' + $scope.video._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.delete = function(video) {
			if (video) {
				video.$remove(function() {
					for (var i in $scope.videos) {
						if ($scope.videos[i] === video) {
							$scope.videos.splice(i, 1);
						}
					}
				});
			} else {
				$scope.video.$remove(function() {
					$location.path('videos');
				});
			}
		};
	}
]);