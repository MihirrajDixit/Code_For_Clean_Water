

// function myFunction() {
//     var x = document.getElementById("menu");
//     if (x.style.display === "none") {
//         x.classList.add("slideInLeft", true);
//         x.style.display = "block";
//     } else {
// 		x.style.display = "none";
// 		// x.classList.add("slideInLeft", false);
// 	}
// }

// function mySecondFunction() {
// 	var x = document.getElementById("right_sidebar");
// 	if (x.style.display === "none") {
// 		x.classList.add("slideInRight");
// 		x.style.display = "block";
// 	} else {
// 		x.style.display = "none";
// 		}
// }

// function myThirdFunction() {
// 	var x = document.getElementById("search_responsive");
// 	if (x.style.display !== 'block') {
// 		x.classList.add("bounceInDown");
// 		x.style.display = "block";
// 		x.style.padding = "15px";
		
// 	} else {	
// 		x.style.display = "none";	
// 	}
// }

// function myFourthFunction() {
// 	var x = document.getElementById("notifs");
// 	var y = document.querySelector(".notif_num");
// if (x.style.display !== 'block') {	
// 	x.style.display = "block";	
// } else {
// 	x.style.display = "none";	
// 	}
// 	y.style.display = "none";
// }



//  // GRAPHS HERE

//     //BAR GRAPH


//     var ctx = document.getElementById("myBarChart").getContext('2d');
//     Chart.defaults.global.tooltips = false; 
//     Chart.defaults.global.legend.display = false;
//     Chart.scaleService.updateScaleDefaults('linear', {
//     ticks: {
//         min: 0
//     }
// });
// Chart.defaults.global.tooltips = false;
// var myBarChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
//         datasets: [{
//             label: '',
//             data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
//             borderWidth: 0
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 gridLines: {
//                     drawOnChartArea: false
//             },
//             display: false
//             }],
//             xAxes: [{
//                 gridLines: {
//                     drawOnChartArea: false
//             },
//             display: false
//             }]
//         }
//     }
// });

// //LINE GRAPH

// var ctx1= document.getElementById('myLineChart').getContext('2d');


// 		var config = {
// 			type: 'line',
// 			data: {
// 				labels: ["", "", "", "", "", "", "", "", "", "", "", "", ],
// 				datasets: [{
					
//                     borderWidth: 1,
//                     borderColor:'#ff8863',
// 					backgroundColor:['#ffddaa'],
//                     label: '',
// 					data: [12, 19, 3, 5, 2, 3, 12, 12, 19, 3, 5, 2],
// 					fill: true,
// 				}]
// 			},
// 			options: {
// 				// responsive: true,
// 				elements: {
//                     point:{
//                         radius: 2
//                     }
//                 },
// 				scales: {
// 					xAxes: [{
// 						display: true,
// 						scaleLabel: {
// 							display: false
							
//                         },
                        
//             display: false
// 					}],
// 					yAxes: [{
// 						display: true,
// 						scaleLabel: {
// 							display: false,
							
// 						},
//             display: false
//                     }]
            
// 				}
// 			}
// 		};
//         var myLineChart = new Chart(ctx1, config);  
	
			
// //horizontal bar graph

// var ctx3= document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx3, {
//     type: 'horizontalBar',
//     data: {
        
// 				labels: [""],
// 				datasets: [{
//                     showTooltips: false,
// 					backgroundColor:'#00acc0',
//                     label: '',
// 					data: [50],
// 					fill: true,
//                 },{
//                     backgroundColor:'#00acc06b',
// 					data: [100],
// 					fill: true,
// 				}]
// 			},
//     options: {
// 				responsive: true,
				
// 				scales: {
// 					xAxes: [{
//                         stacked: true,
// 						display: true,
// 						scaleLabel: {
// 							display: false
							
// 						},
// 						ticks: {
// 							display: false,
// 							max: 100
// 						},
                        
//             display: false
// 					}],
// 					yAxes: [{
//                         display: true,
//                         stacked: true,
// 						scaleLabel: {
// 							display: false,
							
// 						},
// 						ticks: {
// 							display: false
// 						},
//             display: false
//                     }]
            
// 				}
// 			}
// });


// //radar graph
     
// 		var randomScalingFactor = function() {
// 			return Math.round(Math.random() * 100);
// 		};

// 		var color = Chart.helpers.color;
// 		var primary = '#ccbe3c';
// 		var secondary = '#3cbbcc';
// 		var config = {
// 			type: 'radar',
// 			data: {
// 				labels: [['Eat'], ['Drink'], 'Sleep', ['Design'], 'Code', 'Work', 'Run'],
// 				datasets: [{
// 					borderWidth:2,
// 					backgroundColor: color(primary).alpha(0.2).rgbString(),
// 					borderColor: primary,
// 					pointBackgroundColor: primary,
// 					data: [
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor()
// 					]
// 				}, {
					
// 					backgroundColor: color(secondary).alpha(0.2).rgbString(),
// 					borderColor: secondary,
// 					borderWidth: 2,
// 					pointBackgroundColor: secondary,
// 					data: [
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor(),
// 						randomScalingFactor()
// 					]
// 				}]
// 			},
// 			options: {
// 				responsive: true,
				
// 				scale: {
// 					ticks: {
// 						beginAtZero: true,
// 						display:false,
// 					}
// 				},
// 				elements: {
//                     point:{
//                         radius: 0
//                     }
//                 }
// 			}
// 		};

		
// 	myRadar = new Chart(document.getElementById('stat'), config);

	