angular.module('chat').controller('ChatController', ['$scope', 'Socket', 
	function($scope, Socket) {
		
		$scope.messages = [];

		Socket.on('chatMessage', function(message){ 
			$scope.messages.push(message);
		});

		Socket.on("typing", function(data) {

			//if (data.typing) {
				$('#updates').append('TYPING');
				timeout = setTimeout(timeoutFunction, 5000);
			//}

		});

		$scope.sendMessage = function() {
			var message = {
				text: this.messageText
			}

			Socket.emit('chatMessage', message);

			this.messageText = '';
		};

		$scope.checkTyper = function() {

			var typing = false;  
			var timeout = undefined;

			$("#msg").keypress(function(e) { 
				if (e.which !== 13) {
					//$("#updates").append('TYPING...');
					typing = true;
					Socket.emit("typing", true);
				} else {
					clearTimeout(timeout);
					timeout = setTimeout(timeoutFunction, 5000);
				}
			});
			

			function timeoutFunction() {  
			  typing = false;
			  Socket.emit("typing", false);
			}
		}

		$scope.$on('$destroy', function() {
			Socket.removeListener('chatMessage');
		})
	}
]);