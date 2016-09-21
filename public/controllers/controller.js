/*
Controller to interact with views(what the user sees)
and models(the data, logic, information)

- Allow the view(store.html) to access information regarding templates and display them
- Recieve user input from the view and send it to the model through the server
*/


// [] contains the dependencies
var myApp = angular.module('myApp', []); 


myApp.controller('AppControl', ['$scope', '$http',
	function($scope, $http){
		console.log("Hello World from controller");
		
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
			
			
			
		/*refresh();
		
		$scope.templateInfo = function(id){
			console.log(id);	
			$http.get('/templates/' + id).success(function(response){
				console.log("I got the data I requested");
				//window.location.href = "http://localhost:3000/menu.html";
				$scope.store = response;
				console.log(window.location.href);
			});
		};
		
		// Send data to POST request from server to add to the database
		$scope.addTemplate = function() {
				//console.log($scope.template);
				$http.post('/templates', $scope.template).success(function(response){
					console.log(response);
					refresh();
				});
				
		};
		
		$scope.remove = function(id){
			console.log(id);
			$http.delete('/templates/' + id).success(function(response){
				refresh();
			});
		};
		
		
		$scope.edit = function(id) {
			console.log(id);
			$http.get('/templates/' + id).success(function(response){
				$scope.template = response;
			});
		};
		
		$scope.update = function() {
			console.log($scope.template._id);
			$http.put('/templates/' + $scope.template._id, $scope.template).success(function(response){
				refresh();
			});
		};
		*/

	}]);

	
	
myApp.controller('AppControl2', ['$scope', '$http',
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
	}]);
