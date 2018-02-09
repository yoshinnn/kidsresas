// 必要なモジュールを読み込みます。

var PORT = 2222;//add

var fs = require("fs");
var url = require('url');
var path = require('path');
var mime = require('mime');
var http = require("http");
var socketIO = require("socket.io");
//var app = require("express")();//add
//var http = require("http").Server(app);//add


// node.jsでWebServerを作ります。                                                                                     
// アクセスされたら、クライアントに表示するsyncCanvas.htmlを返します。                                                
var server = http.createServer(function (req, res) {
    
    var path;
    if(req.url == '/') {
	path = './index.html';
    } else {
	path = '.' + req.url;
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
/*    res.writeHead(200, {"Content-Type": "text/html"});
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
*/

});
server.listen(PORT);

// socket.IOを用いたリアルタイムWebを実装します。
var io = socketIO(server);
//var io = require("socket.io")(http);//add
//io.set("origins", "*:*");//add
// 接続されたら、connected!とコンソールにメッセージを表示します。                                                     
io.sockets.on("connection", function (socket) {
        console.log("connected");
        // 描画情報がクライアントから渡されたら、接続中の他ユーザーへ                                                 
        // broadcastで描画情報を送ります。                                                                            
        // ちなみに、最近のsocket.IOでは、イベント名(以下だとdraw)は                                                  
        // 自由にネーミング出来るようになったようです。便利！！                                                       
        socket.on("draw", function (data) {
                console.log(data);
                socket.broadcast.emit("draw", data);
            });
        socket.on("clicked", function (data) {
                console.log(data);
                socket.broadcast.emit("clicked", data);
            });
    
        // 色変更情報がクライアントからきたら、                                                                       
        // 他ユーザーへ変更後の色を通知します。                                                                       
        socket.on("color", function (color) {
                console.log(color);
                socket.broadcast.emit("color", color);
            });

        // 線の太さの変更情報がクライアントからきたら、                                                               
        // 他ユーザーへ変更後の線の太さを通知します。                                                                 
        socket.on("lineWidth", function (width) {
                console.log(width);
                socket.broadcast.emit("lineWidth", width);
            });
    });



