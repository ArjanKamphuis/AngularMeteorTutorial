angular.module('socially').controller('AddNewPartyCtrl', function($scope, $meteor, $rootScope, $state, $modalInstance, parties) {
	$scope.addNewParty = function() {
		$scope.newParty.owner = $rootScope.currentUser._id;
		parties.save($scope.newParty);
		$scope.newParty = '';
		$modalInstance.close();
	};
});