var fs = require('fs');
// set up server
var request = require('request-json');
var express = require('express');
var app = express();
var address = require('network-address');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var JsonSocket = require('json-socket');
var port = 4869;
var ip = address();//"192.168.43.239"

app.use(express.static(__dirname + '/public'));


////  Front End   ////

http.listen(port, ip, function () {
    console.log('listening on ' + ip + ':' + port);
});

var url = "http://192.168.0.50:3000/api/"
var namespace = "org.example.waternetwork."
var USER = "Organisation"
var ASSET1 = "Money"
var ASSET2 = "Wrc"
var ASSET3 = "Iotdata"
var Transaction1 = "WRCTrade"


function createOrg(OrgId, classes, pass) {
    payload = { "$class": namespace + USER, "OrgId": OrgId, "classes": classes, "password": pass };
    return payload
}

function createIotData(user, currentMeterAVol, currentMeterBVol, TotalMeterAVol, TotalMeterBVol, MeterBPH, MeterBSolid, MeterBHardness, MeterBOil, MeterBBOD, TimeStamp, qualityFactor, qualityWrcWeight, quantityWrcWeight, count, decision) {
    payload = {
        "$class": namespace + ASSET3,
        "IotdataId": user,
        "currentMeterAVol": currentMeterAVol,
        "currentMeterBVol": currentMeterBVol,
        "TotalMeterAVol": TotalMeterAVol,
        "TotalMeterBVol": TotalMeterBVol,
        "MeterBPH": MeterBPH,
        "MeterBSolids": MeterBSolid,
        "MeterBHardness": MeterBHardness,
        "MeterBOil": MeterBOil,
        "MeterBBOD": MeterBBOD,
        "TimeStamp": TimeStamp,
        "qualityFactor": qualityFactor,
        "qualityWrcWeight": qualityWrcWeight,
        "quantityWrcWeight": quantityWrcWeight,
        "count": count,
        "waterCleanOrDirty":decision,
        "owner": "resource:" + namespace + USER + "#" + user
    };
    return payload
}

function createMoney(user, money) {
    payload = {
        "$class": namespace + ASSET1,
        "MoneyId": user,
        "Money_data": money,
        "owner": "resource:" + namespace + USER + "#" + user
    };
    return payload
}

function createWRCdue(user, WRC) {
    payload = {
        "$class": namespace + ASSET2,
        "WrcId": user,
        "WrcDue": WRC,
        "money": "resource:" + namespace + ASSET1 + "#" + user,
        "owner": "resource:" + namespace + USER + "#" + user
    };
    return payload
}

function WRCtrade(user, seller, Value) {
    payload = {
        "$class": namespace + Transaction1,
        "wrcTradeValue": Value,
        "data": "resource:" + namespace + "Iotdata" + "#" + user,
        "wrcBuyer": "resource:" + namespace + "Wrc" + "#" + user,
        "wrcSeller": "resource:" + namespace + "Wrc" + "#" + seller
    }
    return payload
}
var client = request.createClient('http://localhost:8888/');

// client.post(url+USER, createOrg("2","2"), function(err, res, body) {
//   return console.log(res.statusCode);
// });

// client.get(url + USER + "/" + "1", function (err, res, body) {
//     return console.log(body);
// });

// {
//     "$class": "org.example.waternetwork.Money",
//     "MoneyId": "string",
//     "Money_data": 0,
//     "owner": {}
//   }
// client.get(url + ASSET + "/" + "BPCL", function (err, res, body) {
//     return console.log(body);
// });


// 
var flag = true;
var y = []
var n = false;
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('auth', function (usr, pass) {
        // console.log('Auth' + msg + nin);
        client.get(url + USER + "/" + usr, function (err, res, body) {
            // console.log(res.statusCode);
            if (res.statusCode == 200) {
                // console.log(body)
                // console.log("password"+body["password"]);
                if (body["password"] == pass) {
                    io.emit('sts', body)

                    client.get(url + ASSET1 + "/" + usr, function (err, res, body) {
                        io.emit('asset1', body["Money_data"]);
                    });
                    client.get(url + ASSET2 + "/" + usr, function (err, res, body) {
                        // console.log()
                        io.emit('asset2', body["WrcDue"]);
                        if (body["WrcDue"] < 0) {
                            flag = false;
                        }
                    });
                    client.get(url + ASSET3 + "/" + usr, function (err, res, body) {
                        io.emit('asset3', body);
                    })
                    client.get(url + USER, function (err, res, body) {
                        // console.log(body);
                        // console.log("length of body"+body.length)
                        client.get(url + ASSET2, function (err, res, msg) {
                            // console.log(msg);
                            client.get(url + ASSET3, function (err, res, l) {
                                // console.log(l);
                                for (i = 0; i < body.length; i++) {
                                    if (l[i]["count"] > 24 * 60 && flag && msg[i]["WrcDue"] < 0) {
                                        var n = true;

                                    } else {
                                        var n = false;
                                    }
                                    if(msg[i]["WrcDue"]<0){
                                        var mi = msg[i]["WrcDue"];
                                        var ni =0;
                                    }else{
                                        var mi = 0;
                                        var ni =msg[i]["WrcDue"];
                                    }
                                    console.log("n"+n)
                                    y.push({
                                        "Name": body[i]["OrgId"],
                                        "Type": body[i]["classes"],
                                        "WrcDue": ni,
                                        "WrcProfit":mi,
                                        "QualityFactor": l[i]["qualityFactor"],
                                        "buy": n
                                    });
                                }
                                io.emit('tabledata', y);
                                y = [];
                                flag=true;
                            });
                        });
                    });

                    socket.on('amount', function (amount, name) {
                        // console.log(amount+value)
                        client.post(url + Transaction1, WRCtrade(usr, name, amount), function (err, res, body) {
                            // console.log(body);
                            io.emit('err', res.statusCode);
                        });
                    })


                } else {
                    console.log("password incorrect")
                    io.emit('sts', 404)
                }
            } else {
                console.log('User not found')
                io.emit('sts', res.statusCode)
            }

            // console.log('Auth  ' + msg + nin);
        });
    });

    socket.on('rorg', function (msg) {
        console.log(msg);
        // setTimeout(function(){ alert("Hello"); 
        
        // }, 3000);

        setTimeout(function count() {
            if (count-- <= 0) {
                console.log('0!')
            } else {
                client.get(url + ASSET3 + "/" + msg, function (err, res, body) {
                    console.log(body["TotalMeterBVol"]+ body["count"]);
                    io.emit('CHART1', body["TotalMeterBVol"], body["count"],body["TotalMeterAVol"], body["TotalMeterBVol"],body["MeterBPH"],body["MeterBSolids"],body["MeterBHardness"],body["MeterBOil"],body["MeterBBOD"],body["waterCleanOrDirty"]);
                })

                setTimeout(count, 500)
            }
        }, 500)
    });

    socket.on('reg', function (user, classes, pass) {
        // console.log(user+" "+classes+" "+pass)
        client.post(url + USER, createOrg(user, classes, pass), function (err, res, body) {
            // console.log(body);
            if (res.statusCode == 200) {
                io.emit('ty', 200)
                if (classes == "Large Industries & Industrial Park") {
                    client.post(url + ASSET1, createMoney(user, 10000), function (err, res, body) {
                        console.log(body);
                        if (res.statusCode == 200) {
                            client.post(url + ASSET3, createIotData(user, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, "0"), function (err, res, body) {
                                console.log(body);
                                if (res.statusCode == 200) {
                                    client.post(url + ASSET2, createWRCdue(user, 300), function (err, res, body) {
                                        console.log(body);
                                    });
                                }
                            });
                        }
                    });


                } else if (classes == "Urban Local Bodies & Municipal Councils") {
                    client.post(url + ASSET1, createMoney(user, 5000), function (err, res, body) {
                        // console.log(body);
                        if (res.statusCode == 200) {
                            client.post(url + ASSET3, createIotData(user, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, "0"), function (err, res, body) {
                                // console.log(body);
                                if (res.statusCode == 200) {
                                    client.post(url + ASSET2, createWRCdue(user, 200), function (err, res, body) {
                                        // console.log(body);
                                    });
                                }
                            });
                        }
                    });
                } else if (classes == "Housing Complexes & Gated Communities") {
                    client.post(url + ASSET1, createMoney(user, 1000), function (err, res, body) {
                        // console.log(body);
                        if (res.statusCode == 200) {
                            client.post(url + ASSET3, createIotData(user, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, "0"), function (err, res, body) {
                                // console.log(body);
                                if (res.statusCode == 200) {
                                    client.post(url + ASSET2, createWRCdue(user, 100), function (err, res, body) {
                                        // console.log(body);
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });


    })
});
