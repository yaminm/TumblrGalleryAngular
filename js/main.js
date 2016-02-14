var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
 
	$scope.errorMsg ='';
	$scope.imgUrlArray = [];
	$scope.filter ='all';
	var key =  'SOiMe7M47zoEcQYKtnuzjO6Kcq2M1dAZESAQ9ipStoqvpMMYpT';
	var url = 'https://api.tumblr.com/v2/blog/passport-life.tumblr.com/posts/photo';
	$http({
		method: 'jsonp',
		url: url+'?callback=JSON_CALLBACK',
		params: { api_key: key ,notes_info:true}
	}).success(function(data, status , header, config) {
		if(($scope.errorMsg=validateJson(data)) === '')
		{
			$scope.imgUrlArray = successHandler(data);
		}
	}).error(function(data, status , header, config) {
		console.log('error');
	})

	$scope.filterByLike = function(img) {
		if($scope.filter == 'all')
			return !img.remove;
		if($scope.filter == 'true')
			return img.like == true;
		if($scope.filter == 'remove')
			return img.remove ==true;
    };

	$scope.clickLike =function(x)
	{
		x.like = !(x.like);
	}


	$scope.clickremovePic = function(x){

   		x.remove = !(x.remove);
  		if(x.like)
  			x.like = !x.like;
  	}

	function validateJson(data)
	{
		ans = '';
			 // check if  input is returning object with data
		if((data.response).length === 0)
		{
			ans ='no data returned- ajax call not have a response';
			
		}
		else if(data.response.posts === 0 )
		{
			ans ='no posts returned';
		}
		return ans;
	}
	function successHandler(data)
	{
		
		var objectPosts = data.response.posts;
		var imgUrlArray = [];
		// each loop to go through all the post
		angular.forEach(objectPosts, function(value,key){
			//just retrieving post that have photos
			if(value.type === "photo"){
				// inner each loop to go through all the photos for each post
				angular.forEach(value.photos, function(v, k){

						//append image
						imgUrlArray.push({url:v.original_size.url,like:false,remove:false})
					});// end inner each
			}
		});// end each
		return imgUrlArray;
	}
});

app.directive('confirmClick', function ($window) {
  var i = 0;
  return {
    restrict: 'A',
    priority:  1,
    compile: function (tElem, tAttrs) {
      var fn = '$$confirmClick' + i++,
          _ngClick = tAttrs.ngClick;
      tAttrs.ngClick = fn + '($event)';

      return function (scope, elem, attrs) {
        var confirmMsg = attrs.confirmClick || 'Are you sure?';

        scope[fn] = function (event) {
          if($window.confirm(confirmMsg)) {
            scope.$eval(_ngClick, {$event: event});
          }
        };
      };
    }
  };
});