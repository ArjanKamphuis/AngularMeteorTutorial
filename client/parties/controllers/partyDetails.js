angular.module('socially').controller('PartyDetailsCtrl', function($scope, $stateParams, $meteor) {
	$scope.party = $meteor.object(Parties, $stateParams.partyId, false).subscribe('parties');
	$scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
	$scope.save = function() {
		$scope.party.save().then(function(numberOfDocs) {
			console.log('Save success doc affected', numberOfDocs);
		}, function(error) {
			console.log('Save error', error);
		});
	};
	$scope.reset = function() {
		$scope.party.reset();
	};
});