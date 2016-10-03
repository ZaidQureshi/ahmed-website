(function(){
	
var app = angular.module('Lates', ['ngCookies', 'ngRoute']); 
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



app.controller('ViewController', ['$http', '$location', function($http, $location){
	var vm = this;
	vm.template = [];
	//vm.id = $cookies.get('templateID');
	
	var x = $location.search();
	vm.id = x['id'];
	
	$http.get('/templates/' + vm.id).success(function(response){
				vm.template = response;
			});
}]);


app.controller('RegisterController', ['$http', '$cookies', '$location', '$route', '$window', function($http, $cookies, $location, $route, $window){
	var vm = this;
	var password = document.getElementById("password");
	var confirm = document.getElementById("confirm");

	function validatePassword(){
	  if(password.value != confirm.value) {
		confirm.setCustomValidity("Passwords Don't Match");
	  } else {
		confirm.setCustomValidity('');
	  }
	}
	
	/*
	var username = document.getElementById("username");
	function validateUsername(){
		console.log("kgahkgakah");
		$http.get('/templates/' + username).success(function(response){
				console.log(response);
			});
	}
	username.onchange = validateUsername;
	*/
	
	
	password.onchange = validatePassword;
	confirm.onkeyup = validatePassword;
	
	
	vm.submitForm = function(){
		//var json = angular.toJson(vm); 
		//console.log(json);
		//console.log("Making POST request");
		$http.post('/templates', vm).success(function(response){
				//vm.template = response;
				console.log(response);
				$location.path('/login');
				$route.reload();
				$window.location.reload();
				
			});
	};
	
}]);



app.controller('LoginController', ['$http', 'authService', '$location','$window',
  function ($http, authService, $location, $window) {
    var vm = this;
	

	vm.submit = function () {
      $http.post('/login', vm)
        .then(function (response) {

          // save json web token in session storage
          authService.saveToken(response.data);

          // redirect to projects page
          $location.path('/');
		  $window.location.reload();

        }, function () {
          // wipe out the stored token
          authService.logout();
        })
    };
}]);

app.controller('NavController', ['authService', '$scope', '$location',
  function (authService, $scope, $location) {

    $scope.user = authService.getUser();

	//access token from user
    authService.observeUser().then(null, null, function(user){
      $scope.user  = user;
    });
	
	$scope.loggedin = authService.isAuthed();
	console.log($scope.user);
	console.log($scope.loggedin);

    $scope.logout = function () {
      authService.logout();
      $location.path('/');
    };

  }]);



app.service('authService', ['$window', '$q', function ($window, $q) {

  var self = this;
  this.user = {};
  var defer = $q.defer();

  // This exposes the user object as a promise.
  // First two arguments of then are success and error callbacks, third one is notify callback.
  this.getUser = function () {
    self.setUser();
    return self.user;
  };

  this.observeUser = function() {
    return defer.promise;
  };

  this.setUser = function () {
    self.user = self.parseJwt(self.getToken());
    defer.notify(self.user);
  };

  this.parseJwt = function (token) {
    if (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    } else return {};
  };

  this.saveToken = function (token) {
    $window.localStorage.jwtToken = token;
    self.setUser();
  };

  this.getToken = function () {
    return $window.localStorage.jwtToken;
  };

  this.isAuthed = function () {
    var token = this.getToken();
    if (token) {
      var params = self.parseJwt(token);
      var notExpired = Math.round(new Date().getTime() / 1000) <= params.exp;

      // if the user is expired, log them out
      if (!notExpired) {
        self.logout();
      }
      return notExpired;
    } else {
      return false;
    }
  };

  this.logout = function () {
    delete $window.localStorage.jwtToken;
    self.setUser();
  };
}]);

app.factory('authInterceptor', ['$q', '$location', 'authService', function ($q, $location, authService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (authService.isAuthed()) {
        config.headers.Authorization = 'Bearer ' + authService.getToken();
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {

        // delete the token
        authService.logout();

        // handle the case where the user is not authenticated
        $location.path("/login");
      }
      return response || $q.when(response);
    }
  };
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