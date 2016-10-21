(function(){
	
var app = angular.module('Lates', ['ngCookies', 'ngRoute']); 


app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


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
	//$httpProvider.interceptors.push('authInterceptor');


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
		console.log(response);
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
				console.log(response);
				/*for(i = 0; i < response.length; i++){
					console.log(response[i]);
					if(response[i]._id == vm.id){
						vm.template = response[i];
						break;
					}
				}*/
				vm.template = response;
			});
}]);


app.controller('RegisterController', ['$http', '$cookies', '$location', '$route', '$window', function($http, $cookies, $location, $route, $window){
	var vm = this;
	var password = document.getElementById("password");
	var confirm = document.getElementById("confirm");
	var username = document.getElementById("username");

	function validatePassword(){
	  if(password.value != confirm.value) {
		confirm.setCustomValidity("Passwords Don't Match");
	  } else {
		confirm.setCustomValidity('');
	  }
	}
	
	function validateUsername(){
		console.log(vm.username);
		$http.post('/users', vm).success(function(response){
				//console.log(response);
				if(response){
					username.setCustomValidity('');
				}
				else{
					username.setCustomValidity("Username exists already");
				}
			});
	}
		
	password.onchange = validatePassword;
	confirm.onkeyup = validatePassword;
	username.onchange = validateUsername;
	
	
	vm.submitForm = function(){
		$http.post('/registration', vm).success(function(response){
				//vm.template = response;
				console.log(response);
				$window.alert("Congratulations! Registration was successful, please log in to continue.");
				$location.path('/login');
				//$route.reload();
				$window.location.reload();
				
			});
	};
	
}]);


app.controller('LoginController', ['$http', 'authService', '$location','$window',
  function ($http, authService, $location, $window) {
    var vm = this;
	vm.invalid = false;
	

	vm.submit = function () {
	  vm.invalid = false;
      $http.post('/login', vm)
        .then(function (response) {
		console.log("Response is: " + response);
		console.log(response.data);
		if(response.data != false){
			console.log("authenticated");
          // save json web token in session storage
          //authService.saveToken(response.data);

          // redirect to projects page
          //$location.path('/');
		  //$window.location.reload();

		}
		else{
			$location.path('/login');
			//$window.location.reload();
			vm.invalid = true;
		}
		
		}
		 , function () {
          // wipe out the stored token
          authService.logout();
        })
		
		
    };

}]);

app.controller('NavController', ['authService', '$scope', '$location',
  function (authService, $scope, $location) {

    //$scope.user = authService.getUser();

	/*access token from user
    authService.observeUser().then(null, null, function(user){
      $scope.user  = user;
    });*/
	
	//$scope.loggedin = authService.isAuthed();
	//console.log($scope.user);
	//console.log($scope.loggedin);

    $scope.logout = function () {
      //authService.logout();
      $location.path('/');
    };

  }]);
  
app.controller('CartController', ['authService', '$scope', '$location',
  function (authService, $scope, $location) {

    
	$scope.addToCart = function () {
		$scope.added = true;
	}
	$scope.removeFromCart = function () {
		$scope.added = false;
	}
	
	//access token from user
    authService.observeUser().then(null, null, function(user){
      $scope.user  = user;
    });
	
	//$scope.loggedin = authService.isAuthed();
	//console.log($scope.user);
	//console.log($scope.loggedin);

    $scope.logout = function () {
      authService.logout();
      $location.path('/');
    };

}]);


app.controller('CreateTemplateController', ['$http', '$cookies', '$location', '$route', '$window', 'authService', function($http, $cookies, $location, $route, $window, authService){
	var vm = this;
	var user;
	
	//Get the current user's username and store it into the templates author
	//vm.author = authService.getUser().username;
	//console.log(vm.author);
	
	vm.submitForm = function(){
		$http.post('/user_templates', vm).success(function(response){
				//vm.template = response;
				console.log(response);
				//$window.alert("Congratulations! Registration was successful, please log in to continue.");
				//$location.path('/login');
				//$route.reload();
				//$window.location.reload();
				
			});
	};
	
	
	
	//window.onbeforeunload = function (e) { return 'Are you sure?'; };	
	
	
}]);




// Handles JSON Web Token (JWT) functionalities 
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


})();