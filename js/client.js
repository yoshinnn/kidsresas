var socket = null;
var height = 40;
var width = 40;

var userRoom;

$(function () {

    socket = io({path: '/gtskler/socket.io/'});
    console.log(socket);
//    $("#entrance").show();
//    $("#maincontents").hide();

    quesCoord = [];

    socketQuestion();
    socketGraphDist();
    socketEnterRoom();
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
    //$("#wrapper").height(document.body.clientHeight - $("#up").height());
    $("#wrapper").height(1600);
    $("#wrapper").width(1400);
    
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

function drawQuestion() {
    console.log("wrapper");
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
    var newQuest = document.getElementById('question');
    quesCoord.push([uid,{pos,uid}]);
    c.drawImage(newQuest, pos.x - width/2, pos.y - height/2, width, height);

    socket.emit("fileAppending","グラフクリック送信");
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
    var cStart = $("#up").height()+$("#top").height();
    console.log("canvas開始位置:" + cStart);
    sizing(cStart);
    sizingIframe(cStart);
}

function socketQuestion() {
    socket.on("clicked", function (data) {

	socket.emit("fileAppending","グラフクリック受信");
	var canvas = document.getElementById("myCanvas");
	var c = canvas.getContext("2d");
	
	var cWidth = canvas.clientWidth;
	var cHeight = canvas.clientHeight;
        console.log("on click, pos: " + JSON.stringify(data.pos));
        //画面サイズによってdrawAgrichartなどで描画するグラフの縮小率が変化してしまうためグラフを分解してdrawImageの位置を変える必要があるが
        //同じサイズのタブレットを使っているとして割愛
	var newQuest = document.getElementById('question');
	//posの値と個人IDをグローバル変数として保持,posから範囲内のマウスオーバーでIDをアラートする方向で	
        c.drawImage(newQuest, data.pos.x - width/2, data.pos.y - height/2, width, height);
	quesCoord.push([data.uid,data]);
        
    });
}

function socketGraphDist(){
    socket.on("graphDistribution", function(data) {
	socket.emit("fileAppending","グラフ共有受信");
	console.log(data);
	console.log(data.funcName);
	console.log(data.codeNum);
	document.selbox.pref.selectedIndex = data.codeNum.pref;

	var parent = document.getElementById("city");
	while (parent.firstChild) parent.removeChild(parent.firstChild);//市町村のセレクトボックス初期化
	//セレクトボックスにソケットで送られた市町村を追加
	let selCity = document.createElement("option");
        selCity.value = "-";
        selCity.text = "市町村を選ぶ";
        document.getElementById("city").appendChild(selCity);
	let op = document.createElement("option");
	op.value = data.codeNum.city.citycode;
	op.text = data.codeNum.city.cityname;
	document.getElementById("city").appendChild(op);
	document.selbox.city.selectedIndex = 1;//セレクトボックスには「市町村を選ぶ」とソケットで受け取った市町村しかないので選択される
	
	window[data.funcName]();
    });
}

function socketEnterRoom(){
    socket.on("enter", function(data){
	console.log("enter");
	var roomName = data.value;
	console.log(roomName);
	$("#usersRoomId").val(roomName);
	
    });

}

/*
function socketRoomInitialize(){
    socket.on("roomInitialize", function(rooms){
	console.log("roomInit");
	console.log("rooms:"+JSON.stringify(rooms));
	var roomVals = $("#roomNumber").children();
	    for( var i=0; i<roomVals.length; i++ ){
		var roomName = roomVals.eq(i).val();
		var roomText = roomVals.eq(i).text();
		var bar = roomText.match(/(\d+)人使用中/)[1];
		console.log(roomName+":"+roomText+":"+bar);
		console.log("rooms:"+rooms[roomName]);
		console.log(roomText.replace(/\d+人使用中/,rooms[roomName]+"人使用中"));
		roomVals.eq(i).text(roomText.replace(/\d+人使用中/,rooms[roomName]+"人使用中"));
	    }

    });
}
*/

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

function graphDistribution(){
    var funcName = document.getElementById("funcname").value;
    //window[funcName]();
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    console.log(citycode);
    if(citycode == "-"){
        cityname = "全体";
    }else{
        cityname = document.selbox.city.options[citynum].innerText;
    }
    var codeNum = {pref:prefcode,city:{citycode,cityname}};

    socket.emit("graphDistribution",{funcName,codeNum});
    socket.emit("fileAppending","グラフ共有送信");

}
function roomEnter(){
    var roomName = document.forms.room.roomid.value;
    console.log(roomName);
    socket.emit("enter", {value:roomName});
    userRoom = roomName;
    $("#entrance").hide();
    $("#maincontents").show();
    
}

function socketRoom(){
    socket.on("init", function(data){
	console.log("入室完了");
    });    
}
function getRandomNumber() {
   var randnum = Math.floor( Math.random() * 1000 );
   document.getElementById("randomNum").innerHTML = randnum;
}
/*
function roomSelect(){
    var roomName = document.selbox.roomNumber.value;

 
    console.log(roomName);
    socket.emit("init", {value:roomName});
    userRoom = roomName;

}


function socketRoomNum(){
    socket.on("roomCalc", function(rooms){
	console.log("roomCalc");
	console.log(rooms);
        console.log("rooms:"+JSON.stringify(rooms));
        var roomVals = $("#roomNumber").children();
            for( var i=0; i<roomVals.length; i++ ){
                var roomName = roomVals.eq(i).val();
                var roomText = roomVals.eq(i).text();
                var bar = roomText.match(/(\d+)人使用中/)[1];
                console.log(roomName+":"+roomText+":"+bar);
                console.log("rooms:"+rooms[roomName]);
                console.log(roomText.replace(/\d+人使用中/,rooms[roomName]+"人使用中"));
                roomVals.eq(i).text(roomText.replace(/\d+人使用中/,rooms[roomName]+"人使用中"));
            }
    });

}
*/
