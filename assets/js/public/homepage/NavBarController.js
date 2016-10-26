angular.module('MainModule').controller('NavBarController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {

	$scope.loginForm = {
		loading: false
	}
	
	$scope.loggedin = window.SAILS_LOCALS && window.SAILS_LOCALS.me;
	if($scope.loggedin) $scope.me = window.SAILS_LOCALS.me;
	
	$scope.submitLoginForm = function() {
		$scope.loginForm.loading = true;
		$http.put('/login',{
			email: $scope.loginForm.email,
			password: $scope.loginForm.password
		}).then(function onSuccess(){
			window.location = '/';
		}).catch(function onError(sailsResponse){
			$scope.loginForm.loading = false;
			if(sailsResponse.status === 400 | 404){
				toastr.error('Invalid email/password combination.', 'Error',{
					closeButton: true
				});
				
				return;
			}
			
			toastr.error('An unexpected error occured, please try again.', 'Error', {
				closeButton: true
			});

		}).finally(function eitherWay(){
			//$scope.loginForm.loading = false;
		});
	};
}]);