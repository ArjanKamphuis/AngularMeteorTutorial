if (Meteor.isClient) {
	angular.module('socially', ['angular-meteor', 'ui.router']);
	
	angular.module('socially').config(function($urlRouterProvider, $stateProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
			.state('parties', {
				url: '/parties',
				templateUrl: 'parties-list.html',
				controller: 'PartiesListCtrl'
			})
			.state('partyDetails', {
				url: '/parties/:partyId',
				templateUrl: 'party-details.html',
				controller: 'PartyDetailsCtrl'
			});
		$urlRouterProvider.otherwise('/parties');
	});
	
	angular.module('socially').controller('PartiesListCtrl', function($scope, $meteor) {
		$scope.parties = $meteor.collection(Parties);
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
	
	angular.module('socially').controller('PartyDetailsCtrl', function($scope, $stateParams, $meteor) {
		$scope.party = $meteor.object(Parties, $stateParams.partyId, false);
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
}