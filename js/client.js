
$(function () {

/*
//    sizing();
    $(window).resize(function() {
	var container = document.getElementById("container");
	var rect = container.getBoundingClientRect();
	//var cStart = rect.top + rect.height + window.pageYOffset;

	var cStart = $("#up").height();
	console.log("canvasの開始位置:" + cStart);    // y座標(絶対座標)
	//sizing(cStart);
	//sizingIframe(cStart);
	
    });
    $(window).load(function(){
	var container = document.getElementById("container");
	var rect = container.getBoundingClientRect();
	//var cStart = rect.top + rect.height + window.pageYOffset;
	
	var cStart = $("#up").height();
	console.log("canvasの開始位置:" + cStart);    // y座標(絶対座標)
	//sizing(cStart);
	//sizingIframe(cStart);
	
    });
*/
    windowUserID = 0;


    quesCoord = [];//
    

    window.onload = function(){
	windowUserID += 1;
	console.log(windowUserID);
    };
	
});
function clearCanvas(){
    console.log("clear");
    var canvas = document.getElementById("myCanvas");
    var c = canvas.getContext("2d");
    c.clearRect(0,0,$("#myCanvas").width(),$("#myCanvas").height());
    quesCoord = [];
}

function sizing(cStart){
    console.log("In sizing:" + cStart);
//    $("#wrapper").height(document.body.clientHeight - $("#up").height());
    $("#wrapper").height(800);
    $("#wrapper").width(1200);
    
    var newHeight = $("#wrapper").height();
    $("#myCanvas").attr({height:newHeight});
    $("#myCanvas").css({top:cStart});
    $("#myCanvas").attr({width:$("#wrapper").width()});
    $("#chart_div").height(newHeight);
    $("#chart_div").css({top:cStart});
    $("#chart_div").width($("#wrapper").width());
    console.log("chartW: "+$("#wrapper").width());
}

function sizingIframe(cStart){
    console.log("In sizing:" + cStart);
    var newHeight = $("#wrapper").height();
    $("#myFrame").height(newHeight);
    $("#myFrame").css({top:cStart});
    $("#myFrame").width($("#wrapper").width());
    console.log("frameWidth: "+$("#wrapper").width());
}


    // Canvas上の座標を計算する為の関数たち
function scrollX(){
    return document.documentElement.scrollLeft || document.body.scrollLeft;
}
function scrollY(){
    return document.documentElement.scrollTop || document.body.scrollTop;
}

function getPos (event) {
    var canvas = document.getElementById("myCanvas");
    var mouseX = event.clientX - $(canvas).position().left + scrollX();
    var mouseY = event.clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
}

/*
function getPosT (canvas,event) {
    var mouseX = event.touches[0].clientX - $(canvas).position().left;
    var mouseY = event.touches[0].clientY - $(canvas).position().top;
    return {x:mouseX, y:mouseY};
}
*/
function ioconnect() {
    var socket = io.connect("http://www.srmt.nitech.ac.jp/");
    return socket;

}

function drawQuestion() {
    console.log("wrapper");
    //var socket = io.connect("http:www.srmt.nitech.ac.jp/gtskler");
    //var socket = io.connect("/");
    var socket = ioconnect();
    var canvas = document.getElementById("myCanvas");
    var c = canvas.getContext("2d");
    console.log("click");
    var pos = getPos(event);
    var cWidth = canvas.clientWidth;
    var cHeight = canvas.clientHeight;
    console.log(cWidth + " px / " + cHeight + " px");
    //var cSize = {width:cWidth, height:cHeight};
    console.log("x=" + pos.x + ", y=" + pos.y);
    console.log(document.getElementById('question'));
    var uid = document.selbox.userid.value;
    socket.emit("clicked", {pos,uid});
}

//wrapper要素とその子要素(canvas,chart_div)を初期化                                                                                                                 
function canvasInitialize() {
    //続けて項目を選択した時に、前に表示している地図を削除する
    quesCoord = [];
    var node = document.getElementById('chart_div');
    if(node != null){
        node.parentNode.removeChild(node);
        var node = document.getElementById('wrapper');
        node.parentNode.removeChild(node);
    }
    windowUserID += 1;
    var wrapper = document.createElement('div');
    wrapper.setAttribute("id","wrapper");
    wrapper.setAttribute("class","wrapper");
    document.body.appendChild(wrapper);

    var canvas = document.createElement('canvas');
    canvas.setAttribute("id","myCanvas");
    canvas.setAttribute("onClick","drawQuestion()");

    //canvas.addEventListener("mouseover","questionAlert()");
    wrapper.appendChild(canvas);
    canvas.addEventListener('mousemove',onMousemove,false);

    var chart_div = document.createElement('div');
    chart_div.setAttribute("id","chart_div");
    wrapper.appendChild(chart_div);

    var container = document.getElementById("container");
    var rect = container.getBoundingClientRect();
    //var cStart = rect.top + rect.height + window.pageYOffset;
    var cStart = $("#up").height();
    console.log("canvas開始位置:" + cStart);
    sizing(cStart);
    sizingIframe(cStart);
}

function socketQuestion() {
    //var socket = io.connect("/");
    var socket = ioconnect();
    var canvas = document.getElementById("myCanvas");
    var c = canvas.getContext("2d");
    var height = 40;
    var width = 40;
    var cWidth = canvas.clientWidth;
    var cHeight = canvas.clientHeight;

    socket.on("clicked", function (data) {
        console.log("on click, pos: " + JSON.stringify(data.pos));
        //画面サイズによってdrawAgrichartなどで描画するグラフの縮小率が変化してしまうためグラフを分解してdrawImageの位置を変える必要があるが
        //同じサイズのタブレットを使っているとして割愛
	var newQuest = document.getElementById('question');
	//posの値と個人IDをグローバル変数として保持,posから範囲内のマウスオーバーでIDをアラートする方向で
	
        c.drawImage(newQuest, data.pos.x - width/2, data.pos.y - height/2, width, height);
	
	quesCoord.push([data.uid,data]);
        //c.drawImage(document.getElementById('question'), (cWidth/data.cSize.width)*data.pos.x - width/2 ,(cHeight/data.cSize.height)*data.pos.y - height/2 , width ,height);
    });
}
function throttle(targetFunc, time) {
    var _time = time || 100;
    clearTimeout(this.timer);
    this.timer = setTimeout(function () {
        targetFunc();
    }, _time);
}
function objCheck(event){
    throttle(function() {
	
	var pos = getPos(event);
	console.log("クリック"+JSON.stringify(pos));
	for(i = 0;i < quesCoord.length; i++){
            console.log(quesCoord[i][1].pos.x+" " +pos.x);
            if(((quesCoord[i][1].pos.x - 10) <= pos.x && (quesCoord[i][1].pos.x + 10) >= pos.x) && ((quesCoord[i][1].pos.y - 10) <= pos.y && (quesCoord[i][1].pos.y + 10) >= pos.y)){
		alert("ID:"+quesCoord[i][0]);	
            }
	}		
        // 描画処理
    }, 100);
    
}

function onMousemove(event){
    objCheck(event);
}
