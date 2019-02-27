var socket = io()
var isLoggedIn = localStorage.getItem('session')
if (isLoggedIn && isLoggedIn.length > 0) {
    $("#login").css('display', 'none');
    $("#homepage").css('display', 'block');
    socket.emit('auth', localStorage.getItem('username'), localStorage.getItem('pass'));
}
$(document).ready(function () {

    $("#register-p").click(function () {
        $("#login").css('display', 'none');
        $("#register").css('display', 'block');
    });
    $("#login-p").click(function () {

        $("#register").css('display', 'none');
        $("#login").css('display', 'block');
    });
    $('#loginbutton').click(function () {
        $('#logform').submit(function (e) {
            localStorage.setItem('session', 'true')
            e.preventDefault(); // prevents page reloading

            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            localStorage.setItem('username', username)
            localStorage.setItem('pass', password)
            socket.emit('auth', username, password);
        });
    })

    $('#registerbutton').click(function () {
        $('#regform').submit(function (e) {
            e.preventDefault(); // prevents page reloading
            var username = document.getElementById("ruser").value;
            var password = document.getElementById("rpass").value;
            var classes = document.getElementById("rtype").value;
            // console.log(username, password, classes)
            socket.emit('reg', username, classes, password);
        });

    })

    $("#logoutbutton").click(function () {
        localStorage.clear();
        window.location.reload();
    })
    $('#anchor1').click(function () {
        var identity = document.getElementById("anchor1").value;
        console.log(identity);
    });


    $('#amountbutton').click(function () {
        var amount = document.getElementById("amount").value;
        var name = document.getElementById("orgname").value;
        // console.log(amount+name)
        socket.emit('amount', amount, name);
    })

    socket.on('err', function (msg) {
        if (msg == 404) {
            alert("Transaction failed")
        } else if (msg == 200) {
            alert("Transaction successful");
            window.location.reload();
        }
    })
    socket.on('sts', function (msg) {
        console.log(msg);
        if (msg == 404) {
            alert("Please login again");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        } else {
            $('#homepage').css('display', 'block');
            $('#loginregisterpage').css('display', 'none');
            $("#participant").append("<h1>" + "Org: " + msg["OrgId"] + "</h1><br /><p>" + "Type: " + "</p><p>" + msg["classes"] + "</p>");
        }
    });
    socket.on('asset1', function (msg) {
        // console.log(msg);
        $("#usertable").append("<tr><td>Money</td><td>" + msg + "</td></tr>");
    })
    socket.on('asset2', function (msg) {
        console.log(msg);
        $("#usertable").append("<tr><td>Wrc Due</td><td>" + msg + "</td></tr>");
    })
    socket.on('asset3', function (msg) {
        console.log(msg)
        $("#usertable").append("<tr><td>currentMeterAVol</td><td>" + msg["currentMeterAVol"] + "</td></tr>");
        $("#usertable").append("<tr><td>TotalMeterAVol</td><td>" + msg["TotalMeterAVol"] + "</td></tr>");
        $("#usertable").append("<tr><td>TotalMeterBVol</td><td>" + msg["TotalMeterBVol"] + "</td></tr>");
        $("#usertable").append("<tr><td>MeterBPH</td><td>" + msg["MeterBPH"] + "</td></tr>");
        $("#usertable").append("<tr><td>MeterBSolids</td><td>" + msg["MeterBSolids"] + "</td></tr>");
        $("#usertable").append("<tr><td>MeterBHardness</td><td>" + msg["MeterBHardness"] + "</td></tr>");
        $("#usertable").append("<tr><td>MeterBOil</td><td>" + msg["MeterBOil"] + "</td></tr>");
        $("#usertable").append("<tr><td>TimeStamp</td><td>" + msg["TimeStamp"] + "</td></tr>");
        $("#usertable").append("<tr><td>qualityFactor</td><td>" + msg["qualityFactor"] + "</td></tr>");
        $("#usertable").append("<tr><td>qualityWrcWeight</td><td>" + msg["qualityWrcWeight"] + "</td></tr>");
        $("#usertable").append("<tr><td>quantityWrcWeight</td><td>" + msg["quantityWrcWeight"] + "</td></tr>");
        $("#usertable").append("<tr><td>Day</td><td>" + (msg["count"] / 24) + "</td></tr>");
    })
    socket.on('tabledata', function (msg) {
        console.log(msg);
        for (i = 0; i < msg.length; i++) {
            $("#ORGtable").append("<tr><td><a value=" + msg[i]['Name'] + ">" + msg[i]["Name"] + "</a></td><td>" + msg[i]["Type"] + "</td><td class='text-center'>" + (msg[i].WrcDue) + "</td><td class='text-center'>" + (msg[i].WrcProfit * (-1)) + "</td><td class='text-center'>" + msg[i]["QualityFactor"] + "</td><td><span class='dot' id=" + msg[i]["WrcDue"] + msg[i]["Name"] + "></span></td><td><button type='button' class='btn buybutton' value=" + msg[i]['Name'] + " data-toggle='modal' data-target='#myModalbutton' disabled id=" + msg[i]["Name"] + ">Buy</button></td></tr>");

            if (msg[i]["WrcDue"] > 0) {
                // $("#BuyButton").attr("disabled", "disabled");
                console.log("P " + msg[i]["WrcDue"])
                $("#" + msg[i]["WrcDue"] + msg[i]["Name"]).css("background-color", "red");
            } else {
                console.log("T " + msg[i]["WrcDue"])
                $("#" + msg[i]["WrcDue"] + msg[i]["Name"]).css("background-color", "green");
            }

            if (msg[i]["buy"] === false) {
                console.log("true")
                $("#" + msg[i]["Name"]).prop('disabled', true);
            } else {
                console.log("false")
                $("#" + msg[i]["Name"]).prop('disabled', false);
            }

        }

    })

    $("#chartbutton").click(function () {
        var name = document.getElementById('rorg').value;
        socket.emit('rorg', name);
    });
    socket.on('ty', function (msg) {
        console.log(msg);
        if (msg == 200) {
            alert("Registered Successfully");
        } else {
            alert("Registration Failed")
        }
    })


    /////////////////////////////////////////////////////////////////////////////////////////////


    //////          CHART  JS  ////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////
    var voltfull = {
        type: 'line',
        backgroundColor: "#000000",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "Volume B",
                    borderColor: "green",
                    fill: false
                }
            ]
        },
        options: {
            fill: true,
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'MeterB_Volume'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Timestamp'
                    },

                    ticks: {
                        autoskip: true,
                        maxTicksLimit: 10
                    }
                }]
            },
            animation: true,
            animationSteps: 60,
            datasetStroke: true,
            datasetStrokeWidth: 100,
            animationEasing: "easeOutQuart",
            animation: {
                duration: 200,
                easing: 'linear'
            }

        }
    };



    var voltphase = {
        type: 'line',
        backgroundColor: "#000000",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "MeterB_PH",
                    borderColor: "green",
                    fill: false
                },
                {
                    data: [],
                    label: "MeterB_Solid",
                    borderColor: "brown",
                    fill: false
                },
                {
                    data: [],
                    label: "MeterB_Hardness",
                    borderColor: "blue",
                    fill: false
                },
                {
                    data: [],
                    label: "MeterB_Oil",
                    borderColor: "yellow",
                    fill: false
                },
                {
                    data: [],
                    label: "MeterB_BOD",
                    borderColor: "black",
                    fill: false
                }
            ]
        },
        options: {
            fill: true,
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Properties'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Timestamp'
                    },

                    ticks: {
                        autoskip: true,
                        maxTicksLimit: 10
                    }
                }]
            },
            animation: true,
            animationSteps: 60,
            datasetStroke: true,
            datasetStrokeWidth: 100,
            animationEasing: "easeOutQuart",
            animation: {
                duration: 200,
                easing: 'linear'
            }

        }
    };

    var currentfull = {
        type: 'line',
        backgroundColor: "#000000",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "Vol A vs Vol B",
                    borderColor: "green",
                    fill: false
                }
            ]
        },
        options: {
            fill: true,
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'MeterA_Volume'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'MeterB_Volume'
                    },

                    ticks: {
                        autoskip: true,
                        maxTicksLimit: 10
                    }
                }]
            },
            animation: true,
            animationSteps: 60,
            datasetStroke: true,
            datasetStrokeWidth: 100,
            animationEasing: "easeOutQuart",
            animation: {
                duration: 200,
                easing: 'linear'
            }

        }
    };
    // var currentphase = {
    //     type: 'line',
    //     backgroundColor:"#000000",
    //     data: {
    //         labels: [],
    //         datasets: [
    //             {
    //                 data: [],
    //                 label: "Current A phase",
    //                 borderColor: "green",
    //                 fill: false
    //             },
    //             {
    //                 data: [],
    //                 label: "Current B phase",
    //                 borderColor: "brown",
    //                 fill: false
    //             },
    //             {
    //                 data: [],
    //                 label: "Current C phase",
    //                 borderColor: "blue",
    //                 fill: false
    //             }
    //         ]
    //     },
    //     options: {fill: true,
    //         title: {
    //             display: true,
    //         },
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }],
    //             xAxes: [{

    //                 ticks: {
    //                     autoskip: true,
    //                     maxTicksLimit: 10
    //                 }
    //             }]
    //         },
    //         animation: true,
    //         animationSteps: 60,
    //         datasetStroke: true,
    //         datasetStrokeWidth: 100,
    //         animationEasing: "easeOutQuart",
    //         animation: {
    //             duration: 200,
    //             easing: 'linear'
    //         }

    //     }
    // };

    var vf1 = document.getElementById("vf");
    var vp1 = document.getElementById("vp");
    var cf1 = document.getElementById("cf");
    // var cp1 = document.getElementById("cp");

    var vfull1 = new Chart(vf1, voltfull);
    var vphase = new Chart(vp1, voltphase);
    var cfull1 = new Chart(cf1, currentfull);
    // var cphase = new Chart(cp1, currentphase);
    var checker = ""
    var checker1 = ""
    socket.on('CHART1', function (y, x, y1, x1, y2, y3, y4, y5, y6, decision) {
        
        if(checker!==x){
            vfull1.update();
            vphase.update();
            console.log(y, x, y1, x1, y2, y3, y4, y5, y6)
            voltfull.data.labels.push(x);
            voltfull.data.datasets[0].data.push(y);
            voltphase.data.labels.push(x);
            voltphase.data.datasets[0].data.push(y2);
            voltphase.data.datasets[1].data.push(y3);
            voltphase.data.datasets[2].data.push(y4);
            voltphase.data.datasets[3].data.push(y5);
            voltphase.data.datasets[4].data.push(y6);
        }
        if(checker1!==x1){
            cfull1.update();
            currentfull.data.labels.push(x1);
            currentfull.data.datasets[0].data.push(y1);
        }

        


        checker = x;
        checker1 = x1;
    });


});