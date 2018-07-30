/*
var app = angular.module('myApp', []);

app.controller("MainController",['$scope','$http',function($scope,$http){


	$scope.getData = function() {
		console.log("Button pressed	");
		// Simple GET request example:
		$http({
		  method: 'GET',
		  url: 'http://smarthome.myftp.org:5566/notes'
		}).then(function successCallback(response) {
			// this callback will be called asynchronously
			console.log(JSON.stringify( response.data));
			$scope.data = response.data;
			$scope.empoyees = angular.copy( $scope.data);
			angular.toJson($scope.empoyees );
			
			// when the response is available
		  }, function errorCallback(response) {
			// called asynchronously if an error occurs
			console.log("errorCallback	" +  JSON.stringify(response));
		   // or server returns response with an error status.
		});
	}
	
	$scope.enabledEdit =[];

    $scope.addEmployee = function(index){
	    var emp ={ firstName:"",lastName:"",email:"",
	                   project:"",designation:"",empId:"",disableEdit:false};
		$scope.empoyees.push(emp);
		$scope.enabledEdit[$scope.empoyees.length-1]=true;
	}
	
	$scope.editEmployee = function(index){
		console.log("edit index: "+index);
		$scope.enabledEdit[index] = !$scope.enabledEdit[index];
	//	$scope.enabledEdit[index] = true;
	}
	
	$scope.enterEmployee = function(content){
		var obj = content.toString().split(","); 
		console.log("Title: "+ obj[0]);
		console.log("Content: "+ obj[1]);
		if((obj[0] != "") && (obj[1] != ""))
		{
			console.log("Valid data");
			var json_string = '{"title": "' + obj[0] + '", "content":"' + obj[1] + '"}'
			console.log("json_string: ",json_string);
			var json_obj = JSON.parse(json_string);
			console.log("json_obj: ",json_obj);
		    $.ajax({
			url:  'http://smarthome.myftp.org:5566/notes/', 
			type: "POST", 
			dataType: "JSON",
			contentType: 'application/json',
			data: JSON.stringify(json_obj),
			timeout: 45000,
			success: function (source) {
				console.log("data: ",source);
				console.log("lenght: ",source.length);
					status_code = true;
					swal(
					  'Success',
					  'Data saved',
					  'success'
					)
					$scope.getData();
				}, 
			error: function (xhr, textStatus, thrownError) {
				status_code = false;
					swal(
					  'Error',
					  JSON.stringify(xhr),
					  'error'
					)
				}
			}); 
		}
	}
	$scope.saveEmployee = function(index){
	   console.log("edit index: " + index);
	   //console.log("ID: " + $scope.empoyees[index]._id);
	   //console.log("Title: " + $scope.empoyees[index].title);
	   //console.log("Content: " + $scope.empoyees[index].content);
	  if(index == $scope.empoyees.length-1) // Them moi
	  {
		  if($scope.enabledEdit[index] == true) // Neu dang cho phep edit
		   {
			   var json_string = '{"title": "' + $scope.empoyees[index].title + '", "content":"' + $scope.empoyees[index].content + '"}'
				console.log("json_string: ",json_string);
				var json_obj = JSON.parse(json_string);
				console.log("json_obj: ",json_obj);
			   $.ajax({
					url:  'http://smarthome.myftp.org:5566/notes/', 
					type: "POST", 
					dataType: "JSON",
					contentType: 'application/json',
					data: JSON.stringify(json_obj),
					timeout: 45000,
					success: function (source) {
						console.log("data: ",source);
						console.log("lenght: ",source.length);
							status_code = true;
							swal(
							  'Success',
							  'Data saved',
							  'success'
							)
							$scope.getData();
						}, 
					error: function (xhr, textStatus, thrownError) {
						status_code = false;
							swal(
							  'Error',
							  JSON.stringify(xhr),
							  'error'
							)
						}
					}); 
		   }
		   else
		   {
			   swal({
				  type: 'error',
				  title: 'Nothing to update',
				  text: 'You must click edit button before save it'
				})
		   }  
	  }
	  else // update lai noi dung
	  {
		   if($scope.enabledEdit[index] == true) // Neu dang cho phep edit
		   {
			   var json_string = '{"title": "' + $scope.empoyees[index].title + '", "content":"' + $scope.empoyees[index].content + '"}'
				console.log("json_string: ",json_string);
				var json_obj = JSON.parse(json_string);
				console.log("json_obj: ",json_obj);
			   $.ajax({
					url:  'http://smarthome.myftp.org:5566/notes/' + $scope.empoyees[index]._id, 
					type: "PUT", 
					dataType: "JSON",
					contentType: 'application/json',
					data: JSON.stringify(json_obj),
					timeout: 45000,
					success: function (source) {
						console.log("data: ",source);
						console.log("lenght: ",source.length);
							status_code = true;
							swal(
							  'Success',
							  'Data saved',
							  'success'
							)
							$scope.getData();
						}, 
					error: function (xhr, textStatus, thrownError) {
						status_code = false;
							swal(
							  'Error',
							  JSON.stringify(xhr),
							  'error'
							)
						}
					}); 
		   }
		   else
		   {
			   swal({
				  type: 'error',
				  title: 'Nothing to update',
				  text: 'You must click edit button before save it'
				})
		   }  
	  }

	  
	}
	
	$scope.deleteEmployee = function(index) {
		
		var id_to_delete = $scope.empoyees[index]._id;
		
		const swalWithBootstrapButtons = swal.mixin({
		  confirmButtonClass: 'btn btn-success',
		  cancelButtonClass: 'btn btn-danger',
		  buttonsStyling: false,
		})

		swalWithBootstrapButtons({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  reverseButtons: true
		}).then((result) => {
		  if (result.value) {
			
			$.ajax({
			url:  'http://smarthome.myftp.org:5566/notes/' +  id_to_delete, type: "DELETE", dataType: "JSON", 
			timeout: 45000,
			success: function (source) {
					status_code = true;
					swalWithBootstrapButtons(
					  'Deleted!',
					  'Your file has been deleted.',
					  'success'
					)
					
					$scope.empoyees.splice(index,1);
					$scope.getData();
				}, 
			error: function (xhr, textStatus, thrownError) {
				status_code = false;
					alert(JSON.stringify(xhr));
				}
			});
		  } else if (
			// Read more about handling dismissals
			result.dismiss === swal.DismissReason.cancel
		  ) {
			swalWithBootstrapButtons(
			  'Cancelled',
			  'Your imaginary file is safe :)',
			  'error'
			)
		  }
		})
		
		  
	}

	$scope.enterInfo = function()
	{
		swal.mixin({
		  input: 'text',
		  confirmButtonText: 'Next &rarr;',
		  showCancelButton: true,
		  progressSteps: ['1', '2']
		}).queue([
		  {
			title: 'Enter Title',
			text: 'Please enter the title here'
		  },
		  {
			title: 'Enter Content',
			text: 'Please enter the content here'
		  }
		]).then((result) => {
		  if (result.value) {
			
			$scope.enterEmployee((result.value));
			
			swal({
			  title: 'All done!',
			  html:
				'Your answers: <pre><code>' +
				  JSON.stringify(result.value) +
				'</code></pre>',
			  confirmButtonText: 'Add'
			})
		  }
		})
	}

	$scope.submitEmployee = function(){

		console.log("form submitted:" + angular.toJson($scope.empoyees ));
	}
	
}]);
*/
Circles.create({
	id:           'task-complete',
	radius:       75,
	value:        80,
	maxValue:     100,
	width:        8,
	text:         function(value){return value + '%';},
	colors:       ['#eee', '#1D62F0'],
	duration:     400,
	wrpClass:     'circles-wrp',
	textClass:    'circles-text',
	styleWrapper: true,
	styleText:    true
})

/*
$.notify({
	icon: 'la la-bell',
	title: 'Smart Home System',
	message: 'Welcome to Smart Home System',
},{
	type: 'info',
	placement: {
		from: "top",
		align: "right"
	},
	time: 1000,
});
*/

$.ajax({
		method: "GET",
		url: "https://query.yahooapis.com/v1/public/yql",
		data: {
			q: "select * from weather.forecast where woeid in (select woeid from geo.places(1) where woeid='91877608') and u='c'",
			format: "json",
		}
	})
	.done(function(data_weather) 
	{	
		var weather = data_weather.query.results.channel;
		//console.log(JSON.stringify(weather.item.condition.code));
		//swal("Smart Home" ,"Welcome to Smart Home dashboard !" ,"success" );

		$.notify({
			icon: 'la la-bell',
			title: 'Smart Home System',
			message: 'Current temperature: ' + weather.item.condition.temp + " and Humidity: " + weather.atmosphere.humidity,
		},{
			type: 'info',
			placement: {
				from: "top",
				align: "right"
			},
			time: 1000,
		});
		
		
		//console.log(JSON.stringify(weather.item.condition.temp));
		$("#weather_current_temperature").html(weather.item.condition.temp + " °C");
		$("#weather_current_humidity").html(weather.atmosphere.humidity + " %");
	});
	
// monthlyChart

Chartist.Pie('#monthlyChart', {
	labels: ['50%', '20%', '30%'],
	series: [50, 20, 30]
}, {
	plugins: [
	Chartist.plugins.tooltip()
	]
});
// trafficChart
var chart = new Chartist.Line('#trafficChart', {
	labels: [1, 2, 3, 4, 5, 6, 7],
	series: [
	[5, 9, 7, 8, 5, 3, 5],
	[6, 9, 5, 10, 2, 3, 7],
	[2, 7, 4, 10, 7, 6, 2]
	]
}, {
	plugins: [
	Chartist.plugins.tooltip()
	],
	low: 0,
	height: "245px",
});

// salesChart
var dataSales = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	series: [
	[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
	[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
	]
}

var optionChartSales = {
	plugins: [
	Chartist.plugins.tooltip()
	],
	seriesBarDistance: 10,
	axisX: {
		showGrid: false
	},
	height: "245px",
}

var responsiveChartSales = [
['screen and (max-width: 640px)', {
	seriesBarDistance: 5,
	axisX: {
		labelInterpolationFnc: function (value) {
			return value[0];
		}
	}
}]
];

Chartist.Bar('#salesChart', dataSales, optionChartSales, responsiveChartSales);

$(".mapcontainer").mapael({
	map : {
		name : "world_countries",
		zoom: {
			enabled: true,
			maxLevel: 10
		},
		defaultPlot: {
			attrs: {
				fill: "#004a9b"
				, opacity: 0.6
			}
		},
		defaultArea: {
			attrs: {
				fill: "#e4e4e4"
				, stroke: "#fafafa"
			}
			, attrsHover: {
				fill: "#59d05d"
			}
			, text: {
				attrs: {
					fill: "#505444"
				}
				, attrsHover: {
					fill: "#000"
				}
			}
		}
	},
	areas: {
				// "department-56": {
				// 	text: {content: "Morbihan", attrs: {"font-size": 10}},
				// 	tooltip: {content: "<b>Morbihan</b> <br /> Bretagne"}
				// },
				"ID": {
					tooltip: {content: "<b>Indonesia</b> <br /> Tempat Lahir Beta"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}
				},
				"RU": {
					tooltip: {content: "<b>Russia</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}
				},
				"US": {
					tooltip: {content: "<b>United State</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}
				},
				"AU": {
					tooltip: {content: "<b>Australia</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}
				}
			},
		});
