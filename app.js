//node app.jsで実行
// 必要なモジュールを読み込みます。

/****************************
注意：
socket.ioのバージョンが新しいと
日本語のデータを通信すると文字化けするため、下手にアップデートするのは危険
現状のバージョン1.7.4では文字化けはしない
****************************/

var http = require("http");
//http.globalAgent.maxSockets = 100;  
var socketIO = require("socket.io");
var PORT = 2222;//add

var fs = require("fs");
var url = require("url");
var path = require("path");
var mime = require("mime");

var userIP = null;

// node.jsでWebServerを作ります。                                                                                     
// アクセスされたら、クライアントに表示するindex.htmlを返します。                                                
var server = http.createServer(function (req, res) {

    if (req.headers["x-forwarded-for"]) {
	console.log("A:"+req.headers["x-forwarded-for"]);
	userIP = req.headers["x-forwarded-for"];
    }

    var path;
    if(req.url == "/") {
	path = "./index.html";
    } else {
	path = "." + req.url;
    }
  // Read File and Write
  fs.readFile(path, function (err, data) {
    if(err) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      return res.end(req.url + ' not found.');
    }
    var type = mime.lookup(path);
    res.writeHead(200, {"Content-Type": type});
      res.write(data);

    res.end();
  });    

});
server.listen(PORT);

// socket.IOを用いたリアルタイムWebを実装します。                                                                     
var io = socketIO.listen(server);

// 接続されたら、connected!とコンソールにメッセージを表示します。                                                     
io.sockets.on("connection", function (socket) {

    var roomName = "";

    console.log("connected");

    var socketRooms = {};//"room1":0,"room2":0,"room3":0,"room4":0,"room5":0};
    var adapterRoom = io.sockets.adapter.rooms;
    console.log("adapterrooms:"+JSON.stringify(adapterRoom));
    for(key in adapterRoom){
	if ( key.match(/room/)) {

	    console.log( key  + ":" + JSON.stringify(adapterRoom[key]) + "\n");
	    socketRooms[key] = adapterRoom[key]["length"];
	}

    }

    console.log("socket.id:"+socket.id);
    //io.to(socket.id).emit("roomInitialize", socketRooms);

    //console.log("socketRoom:"+JSON.stringify(socketRooms));


    socket.on("init", function(data) {
	roomName = data.value;
	console.log(roomName);
	//socket.set("room",room);
	socket.join(roomName);
	/*
	var roomusers = io.sockets.adapter.rooms[roomName]["length"];
	console.log("rooms:"+JSON.stringify(io.sockets.adapter.rooms[roomName]));
	socketRooms[roomName] = roomusers;
	*/
	/*
	  var adapterRoom = io.sockets.adapter.rooms;
	  console.log("adapterrooms:"+JSON.stringify(adapterRoom));
	  for(key in adapterRoom){
	  if ( key.match(/room/)) {
	  //strにhogeを含む場合の処理                                                                                                                                                                                                       
	  console.log( key  + ":" + JSON.stringify(adapterRoom[key]) + "\n");
	  socketRooms[key] = adapterRoom[key]["length"];
	  }
	  }
	*/	    

        //var adapterRoom = io.sockets.adapter.rooms;//現在のルーム情報を取得                                                                                                                                                                                 
        //console.log("adapterrooms:"+JSON.stringify(adapterRoom));
	
	/*
        for(key in socketRooms){
            if(adapterRoom[key]){//取得したルーム情報のキーにルーム番号が含まれていた場合にルーム接続数を更新                                                                                                                                               
                //if ( key.match(/room/)) {                                                                                                                                                                                                                 
                console.log( key  + ":" + JSON.stringify(adapterRoom[key]) + "\n");
                socketRooms[key] = adapterRoom[key]["length"];


            }else{//取得したルーム情報のキーにルーム番号が含まれていない場合そのルームは存在していない                                                                                                                                                      
                socketRooms[key] = 0;
            }
        }

	
	console.log(JSON.stringify(socketRooms))
	io.emit("roomCalc",socketRooms);
	*/
    });
    console.log('コネクション数',socket.client.conn.server.clientsCount);

    //ルーム入室機能
    socket.on("enter", function (data) {
	console.log(data);
	roomName = data.value;
	socket.join(roomName);
	var adapterRoom = io.sockets.adapter.rooms;//現在のルーム情報を取得
        console.log("adapterrooms:"+JSON.stringify(adapterRoom));
	io.to(socket.id).emit("enter",{"value":roomName});
    });

    //疑問点共有機能
    socket.on("clicked", function (data) {
        console.log(data);
        socket.broadcast.to(roomName).emit("clicked", data);
    });

    //グラフ共有機能
    socket.on("graphDistribution", function (data) {
        console.log(data);
	/*
	
	socket.get('room', function(err, _room) {
            room = _room;
        });
	*/
	console.log("送信:"+roomName);
        socket.broadcast.to(roomName).emit("graphDistribution", data);
    });

    //機能の接続による遅延確認のための機能
    socket.on("fileAppending", function (data) {
	console.log(data);
	var DD = new Date();
	var Hours = DD.getHours();
	var Minutes = DD.getMinutes();
	var Seconds = DD.getSeconds();
	var MilliSec = DD.getMilliseconds();
	//document.write(Hours,"時",Minutes,"分",Seconds,"秒");                                                                                                                                                                    
	console.log("check");
	console.log(data+","+Hours+"時"+Minutes+"分"+Seconds+"秒");
	var time = data+","+Hours+":"+Minutes+":"+Seconds+":"+MilliSec+"\n";
	fs.appendFile('out.txt',time, function (err) {
	    console.log(err);
	});
    });
    
    socket.on("disconnect", function() {	
	console.log("disconnected:"+socket.id);
	/*
	var adapterRoom = io.sockets.adapter.rooms;//現在のルーム情報を取得
	console.log("adapterrooms:"+JSON.stringify(adapterRoom));
	for(key in socketRooms){
	    if(adapterRoom[key]){//取得したルーム情報のキーにルーム番号が含まれていた場合にルーム接続数を更新
		//if ( key.match(/room/)) {
		console.log( key  + ":" + JSON.stringify(adapterRoom[key]) + "\n");
		socketRooms[key] = adapterRoom[key]["length"];
		
		
	    }else{//取得したルーム情報のキーにルーム番号が含まれていない場合そのルームは存在していない
		socketRooms[key] = 0;
	    }
	}
	io.emit("roomInitialize",socketRooms);
	*/
    });
    
});
