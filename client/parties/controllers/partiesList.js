angular.module('socially').controller('PartiesListCtrl', function($scope, $meteor) {
	$scope.parties = $meteor.collection(Parties).subscribe('parties');
	$scope.add = function() {
		$scope.parties.save($scope.newParty);
		$scope.newParty = '';
	};
	$scope.remove = function(party) {
		$scope.parties.remove(party);
	};
	$scope.removeAll = function() {
		$scope.parties.remove();
	};
});