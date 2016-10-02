(function(){
	
var app = angular.module('Lates', ['ngCookies']); 
app.config(['$locationProvider', function AppConfig($locationProvider) {
	
	/*
    $routeProvider
        .when(
        '/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: 'templates/home.html'
        })
        .when('/login', {
            templateUrl: 'templates/login.html'
        })
        .when('/news', {
            templateUrl: 'templates/news.html'
        })
        .when('/news/archive', {
            templateUrl: 'templates/newsarchive.html'
        })
        // removed other routes ... *snip
        .otherwise({
            redirectTo: '/home'
        }
    );
	*/
	
    // enable html5Mode for pushstate ('#'-less URLs)
    //$locationProvider.html5Mode(true);
	$locationProvider.html5Mode({
			enabled: true,
			requireBase: false,
			rewriteLinks: false
	});
    $locationProvider.hashPrefix('!');
	//$locationProvider.html5Mode(true).hashPrefix('*');


}]);

/*
app.service('sharedProperties', function() {
    var templateID = 0;
	
    return {
        getTemplateID: function() {
            return templateID;
        },
        setTemplateID: function(newID) {
            templateID = newID;
        }
    }
});
*/



app.controller('TemplatesController', ['$http', '$cookies', function($http, $cookies){
	var vm = this;
	vm.templates = [];
	
	$http.get('/templates').success(function(response){
		vm.templates = response; 
	});
	
	// Function to store the template id inside of a cookie
	// Cookie will be used later to look up the template via id in the database store and display the result
	vm.view = function(id){
			console.log(id);
			// Setting a cookie
			//$cookies.put('templateID', id);
		};
}]);



app.controller('ViewController', ['$http', '$cookies', '$location', function($http, $cookies, $location){
	var vm = this;
	vm.template = [];
	//vm.id = $cookies.get('templateID');
	
	var x = $location.search();
	//console.log(x['id']);
	vm.id = x['id'];
	
	$http.get('/templates/' + vm.id).success(function(response){
				vm.template = response;
				//console.log(vm.template);
			});
}]);






/*
app.controller('AppControl', ['$scope', '$http', '$cookies',	
	function($scope, $http, $cookies){
		console.log("Hello World from controller");
		console.log($cookies.get('template'));
		// Send a request to get data from the database
		$scope.refresh = function(){
			// Request data from the server	
			$http.get('/templates').success(function(response){
				console.log("I got the data I requested");
				
				// $scope to use the templates in the html
				$scope.templates = response;
			
			});
		}
		
		
		var temp = "";
		$scope.view = function(id){
			console.log(id);
			$http.get('/templates/' + id).success(function(response){
				console.log(response);
				temp = response;
				console.log(temp);
				$scope.template = response;
			});
		};
		console.log(temp);
		
		
		$scope.addCart = function(){
			// To be completed
			};
		
		
		// Generate the intial data on page load
		$scope.refresh();
			
			

	}]);

	
	
app.controller('AppControl2', ['$scope', '$http',
	function($scope, $http){
		console.log("Hello World from controller2");
		
		// Send a request to get data from the database
		$scope.refresh = function(){
			// Request data from the server
			$http.get('/templates123').success(function(response){
				console.log("I got the data I requested");
				
				// $scope to use the templates in the html
				$scope.template = response;
			
			});
		}
		
		// Generate the intial data on page load
		$scope.refresh();
	}]);*/
})();