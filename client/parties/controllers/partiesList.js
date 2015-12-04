angular.module('socially').controller('PartiesListCtrl', function($scope, $meteor) {
	$scope.parties = $meteor.collection(function() {
		return Parties.find({}, {
			sort: $scope.getReactively('sort')
		});
	});
	
	$scope.page = 1;
	$scope.perPage = 3;
	$scope.sort = { name: 1 };
	$scope.orderProperty = '1';
	
	$meteor.autorun($scope, function() {
		$meteor.subscribe('parties', {
			limit: parseInt($scope.getReactively('perPage')),
			skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
			sort: $scope.getReactively('sort')
		}, $scope.getReactively('search')).then(function() {
			$scope.partiesCount = $meteor.object(Counts, 'numberOfParties', false);
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
});