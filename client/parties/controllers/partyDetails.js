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
	
	$scope.canInvite = function() {
		if (!$scope.party) {
			return false;
		}
		return !$scope.party.public && $scope.party.owner === Meteor.userId();
	};
	
	$scope.map = {
		center: {
			latitude: 52,
			longitude: 5
		},
		zoom: 8,
		events: {
			click: function(mapModel, eventName, originalEventArgs) {
				if (!$scope.party) { return; }
				if (!$scope.party.location) {
					$scope.party.location = {};
				}
				$scope.party.location.latitude = originalEventArgs[0].latLng.lat();
				$scope.party.location.longitude = originalEventArgs[0].latLng.lng();
				// scope apply required because this event handler is outside of the angular domain
				$scope.$apply();
			}
		},
		marker: {
			options: { draggable: true },
			events: {
				dragend: function(marker, eventName, args) {
					if (!$scope.party.location) {
						$scope.party.location = {};
					}
					$scope.party.location.latitude = marker.getPosition().lat();
					$scope.party.location.longitude = marker.getPosition().lng();
				}
			}
		}
	};
});