angular.module('moduleSearch',[])
.factory('TarotsService',function($http,$q){
	var service={		
		listmajorArcana:function(){
			var deferred = $q.defer();			  
			    $http.defaults.headers.common['Authorization'] = 'Basic ZGllZ29tYXJ5OkF0cmVpdXNANjI=';
				$http.get('https://expressclusterq-diegomary-5.c9.io/majorarcanatarots', { cache: false }).success(function (data) {
                deferred.resolve(data);
                }).error(function () {
                    deferred.reject();
                });
                return deferred.promise;},
        listminorArcana:function(){
			var deferred = $q.defer();			   
			    $http.defaults.headers.common['Authorization'] = 'Basic ZGllZ29tYXJ5OkF0cmVpdXNANjI=';
				$http.get('https://expressclusterq-diegomary-5.c9.io/minorcanatarots', { cache: false }).success(function (data) {
                deferred.resolve(data);
                }).error(function () {
                    deferred.reject();
                });
                return deferred.promise;
            }
	};

	return service;})
.directive('arcanaSearcher', function() {
    return {
      restrict: 'AE',    
      replace: false,
      transclude: true,
      scope: {arcanas: '@'},
      templateUrl: 'templates/tarotSearcher.html',
      controller: ['$scope', 'TarotsService', '$http', function($scope, TarotsService, $http) {
      $scope.dataLoaded=false;
      $scope.changesearchText=function(){
      	if($scope.dataLoaded===false)
      	{
      	  $scope.getArcana($scope.arcanas);
		  $scope.resultseffective=false;
		  $scope.dataLoaded=true;
      	}
      	console.log($scope.search);      	
      }

	  $scope.getArcana=function(arcanaKind){
		  if(arcanaKind ==='major')  var promise = TarotsService.listmajorArcana()
		  else if(arcanaKind ==='minor')  var promise = TarotsService.listminorArcana()
		  else {alert('Error'); return;} 	
		  promise.then(function (arcana){
							$scope.arcana = arcana;
							startwatchingFiltering();
						},function(err) {$scope.AjaxError = err;}
					);};
	  function startwatchingFiltering(){
		  $scope.$watch("filteredarcana.length",function( newValue, oldValue ) {
	                    	if(newValue < $scope.arcana.length)
	                    	$scope.resultseffective=true;
	                    	else $scope.resultseffective=false;
	                        console.log('was: ' + oldValue + '  is now: ' + newValue);
	                    },true
	                );}	  
          
      }],
      link: function(scope, element, attrs, ctrl) {}
      // element is the component of the directive. In this case the div that wraps the two spans
      // W A R N I N G do not rely on jquery lite in Angular. but use FULL JQUERY 
      // for searching inside the element. 
	  // element.find('#mybutton').css('background-color','green').css('color','yellow');   	
    };
  })