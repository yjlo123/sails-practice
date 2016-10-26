angular.module('MainModule').controller('SignupController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {

	$scope.signupForm = {
		loading: false
	}
	
	$scope.loggedin = window.SAILS_LOCALS && window.SAILS_LOCALS.me;
	
	$scope.submitSignupForm = function() {
		$scope.signupForm.loading = true;
		$http.post('/signup',{
			name: $scope.signupForm.name,
			email: $scope.signupForm.email,
			password: $scope.signupForm.password
		}).then(function onSuccess(){
			window.location = '/';
		}).catch(function onError(sailsResponse){
			var emailAddressAlreadyInUse = sailsResponse.status == 400;
			if(emailAddressAlreadyInUse){
				toastr.error('Email address has already been taken.', 'Error');
				return;
			}
		}).finally(function eitherWay(){
			$scope.signupForm.loading = false;
		});
	};
}]);