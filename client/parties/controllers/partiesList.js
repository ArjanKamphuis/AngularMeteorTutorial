angular.module('socially').controller('PartiesListCtrl', function($scope, $meteor, $rootScope, $state) {
	$scope.parties = $meteor.collection(function() {
		return Parties.find({}, {
			sort: $scope.getReactively('sort')
		});
	});
	
	$scope.page = 1;
	$scope.perPage = 3;
	$scope.sort = { name: 1 };
	$scope.orderProperty = '1';
	
	$scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
	
	$meteor.autorun($scope, function() {
		$meteor.subscribe('parties', {
			limit: parseInt($scope.getReactively('perPage')),
			skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
			sort: $scope.getReactively('sort')
		}, $scope.getReactively('search')).then(function() {
			$scope.partiesCount = $meteor.object(Counts, 'numberOfParties', false);
			
			$scope.parties.forEach(function(party) {
				party.onClicked = function() {
					$state.go('partyDetails', { partyId: party._id });
				};
			});
			
			$scope.map = {
				center: {
					latitude: 52,
					longitude: 5
				},
				zoom: 8
			};
		});
	});
	
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
	
	$scope.pageChanged = function(newPage) {
		$scope.page = newPage;
	};
	$scope.$watch('orderProperty', function() {
		if ($scope.orderProperty) {
			$scope.sort = { name: parseInt($scope.orderProperty) };
		}
	});
	
	$scope.getUserById = function(userId) {
		return Meteor.users.findOne(userId);
	};
	$scope.creator = function(party) {
		if (!party) {
			return;
		}
		var owner = $scope.getUserById(party.owner);
		if (!owner) {
			return 'nobody';
		}
		if ($rootScope.currentUser) {
			if ($rootScope.currentUser._id) {
				if (owner._id === $rootScope.currentUser._id) {
					return 'me';
				}
			}
		}
		return 'owner';
	};
	
	$scope.rsvp = function(partyId, rsvp) {
		$meteor.call('rsvp', partyId, rsvp).then(
			function(data) {
				console.log('success responding', data);
			}, function(error) {
				console.log('failed', error);
			}
		);
	};
	
	$scope.outstandingInvitations = function(party) {
		return _.filter($scope.users, function(user) {
			return (_.contains(party.invited, user._id) && !_.findWhere(party.rsvps, { user: user._id } ));
		});
	};
});