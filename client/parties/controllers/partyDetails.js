angular.module('socially').controller('PartyDetailsCtrl', function($scope, $stateParams, $meteor) {
	$scope.party = $meteor.object(Parties, $stateParams.partyId, false);
	$scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
	$scope.$meteorSubscribe('parties');
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
	
	$scope.invite = function(user) {
		$meteor.call('invite', $scope.party._id, user._id).then(
			function(data) {
				console.log('success inviting', data);
			}, function(error) {
				console.log('failed', error)
			}
		);
	};
});