$(function () {
//    sizing();
    $(window).resize(function() {
	var container = document.getElementById("container");
	var rect = container.getBoundingClientRect();
	var cStart = rect.top + rect.height + window.pageYOffset;
	console.log("canvasの開始位置:" + cStart);    // y座標(絶対座標)
	sizing(cStart);
    });
    $(window).load(function(){
	var container = document.getElementById("container");
	var rect = container.getBoundingClientRect();
	var cStart = rect.top + rect.height + window.pageYOffset;
	console.log("canvasの開始位置:" + cStart);    // y座標(絶対座標)
	sizing(cStart);
    });

});

function sizing(cStart){
    console.log("In sizing:" + cStart);
    var newHeight = $("#wrapper").height() - cStart;
    $("#myCanvas").attr({height:newHeight});
    $("#myCanvas").css({top:cStart});
    $("#myCanvas").attr({width:$("#wrapper").width()});
}

    // Canvas上の座標を計算する為の関数たち
function scrollX(){
    return document.documentElement.scrollLeft || document.body.scrollLeft;
}
function scrollY(){
    return document.documentElement.scrollTop || document.body.scrollTop;
}
function getPos (canvas,event) {
    var mouseX = event.clientX - $(canvas).position().left + scrollX();
          var mouseY = event.clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
}
function getPosT (canvas,event) {
    var mouseX = event.touches[0].clientX - $(canvas).position().left + scrollX();
    var mouseY = event.touches[0].clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
}

function drawLines() {
    console.log("wrapper");
    var socket = io.connect("/");
    var canvas = document.getElementById("myCanvas");
    var c = canvas.getContext("2d");
//    var w = 450;
//    var h = 400;
//    var drawing = false;
//    var oldPos;

    // Canvasを初期化する
//    c.fillStyle = "rgba(" + [0, 0, 255, 0] + ")";
    // Canvas上の座標を計算する為の関数たち                                                                                        

//    canvas.addEventListener("click", function (event) {
        console.log("click");
        var pos = getPos(canvas,event);
        console.log("x=" + pos.x + ", y=" + pos.y);
	console.log(document.getElementById('question'));
        socket.emit("clicked", pos);
//    }, false);


/*
    socket.on("clicked", function (data) {
        console.log("on click : " + data);
	c.drawImage(document.getElementById('question'),data.x,data.y,40,40);
    })
*/

}
