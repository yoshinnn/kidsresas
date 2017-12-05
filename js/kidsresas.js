var baseUrl = 'https://opendata.resas-portal.go.jp/';
var apiKey = 'M1o2g9y0ORtM4StEcRPMBxiBwFr6lTPrZa9cXyJh';


google.charts.load('current', {packages: ['corechart', 'bar']});


function selectType(types) {
    
    var node = document.getElementById('chart_div');
    if(node != null){
	node.parentNode.removeChild(node);
    }
    //container下に
    var div = document.createElement('div');

    div.setAttribute("id","chart_div");
    //document.getElementById("container").appendChild(div);
    document.body.appendChild(div);

    var selector = "div#";
    for (var i = 0; i < types.length; i++) {
	if (i > 0) {
	    selector += "-";
	}
	selector += types[i];
    }
    
    console.log(selector);
    $(selector).removeClass("hidden");
    
    var bigSelectors = ["div#1","div#2","div#3","div#4"];    //セレクタがdiv#1,2,3,4のどれか選択された時他のセレクタをhiddenにする
    var middleSelectors = ["div#3-1","div#3-2","div#3-3","div#3-4","div#3-5"];
    if(bigSelectors.indexOf(selector) > -1){
	var index = bigSelectors.indexOf(selector);
	if(selector != "div#3") {
	    middleSelectors.forEach(function(value, i, midArray){
		$(midArray[i]).addClass("hidden");
	    });
	}
	
	bigSelectors.splice(index,1);
	bigSelectors.forEach(function(value, i, bigArray){
	    $(bigArray[i]).addClass("hidden");
	    console.log(bigSelectors[index]);
	});
    }else if(middleSelectors.indexOf(selector) > -1){
	var index = middleSelectors.indexOf(selector);
	middleSelectors.splice(index,1);
	middleSelectors.forEach(function(value, i, midArray){
	    $(midArray[i]).addClass("hidden");
	    console.log(middleSelectors[index]);
	});
	}
    
}

function citySet(){
    var baseUrl = "https://opendata.resas-portal.go.jp/";
    var apiKey = "M1o2g9y0ORtM4StEcRPMBxiBwFr6lTPrZa9cXyJh";
    var apiPath = "api/v1/cities?prefCode=";
    var prefCode = document.selbox.pref.selectedIndex;
    //console.log(prefCode);
    $.ajax({
	type: 'GET',
	url: baseUrl + apiPath + prefCode,
	headers: { 'X-API-KEY': apiKey},
	dataType: 'json',
	success: function(ret){
	    console.log(ret.result);
	    var parent = document.getElementById("city");
	    while (parent.firstChild) parent.removeChild(parent.firstChild);
	    
	    let op = document.createElement("option");
	    op.value = "-";
	    op.text = "市町村を選ぶ";
	    document.getElementById("city").appendChild(op);
	    

	    for(var i = 0; i < ret.result.length; i++){
		//console.log(ret.result[i].cityName);
		let op = document.createElement("option");
		op.value = ret.result[i].cityCode;
		op.text = ret.result[i].cityName;
		document.getElementById("city").appendChild(op);
	    }
	}	
    });   
}

//RESASの人口構成のページに直接リンクする
function linkToPopComp() {

    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope;
    if(citycode == "-"){
        scope = 3;//都道府県全体を選択                                                                                              
    }else{
        scope = 2;//市町村を選択                                                                                                    
    }    
    var linkTo = "https://resas.go.jp/population-composition/#/transition/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    window.open(linkTo,'_blank');

}

//RESASの人口ピラミッドのページに直接リンクする
function linkToPyramid() {

    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope = 0;
    if(citycode == "-"){
        scope = 0;//都道府県全体を選択                                                                                              
    }else{
        scope = 2;//市町村を選択                                                                                                    
    }    

    var linkTo = "https://resas.go.jp/population-composition/#/pyramid/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    window.open(linkTo,'_blank');

}

//RESASの人口増減率のページに直接リンクする
function linkToPopSum() {

    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var scope = 0;
    if(citycode == "-"){
        scope = 1;//都道府県全体を選択                                                                                                                          
    }else{
        scope = 2;//市町村を選択                                                                                                                                
    }

    var linkTo = "https://resas.go.jp/population-sum/#/graph/"+prefcode+"/"+citycode+"/2015/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    window.open(linkTo,'_blank');

}


//RESASの人口増減率のページに直接リンクする
function linkToPopFur() {
//グラフは市町村単位でのみ表示
    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    var citynum = document.selbox.city.selectedIndex;
    var citycode = document.selbox.city.options[citynum].value;
    var cityname;
    var year = 2012;
    var scope = 0;
    if(citycode == "-"){
        scope = 0;//都道府県全体を選択
    }else{
        scope = 0;//市町村を選択
    }

    var linkTo = "https://resas.go.jp/population-future/#/graph/"+prefcode+"/"+citycode+"/"+year+"/"+scope+"/9.139551352398794/35.07185405/137.44284295";
    console.log(linkTo);
    window.open(linkTo,'_blank');

}







//RESASの国籍別訪問者数のグラフに直接リンクする
function linkToTourVisitor() {
//都道府県単位でのみ選択
//市町村コードは県内ならどれでも可、URLを見る限り県庁所在地で固定している模様

    var prefnum = document.selbox.pref.selectedIndex;
    var prefcode = document.selbox.pref.options[prefnum].value;
    var prefname = document.selbox.pref.options[prefnum].innerText;
    
    var citycode = document.selbox.city.options[0].value;
    console.log(citycode);
    var cityname;
    var scope = 0;
    var year = 2011;
    var term = "1";//すべての期間:1, 1-3月期:2, 4-6月期:3, 7-9月期:4, 10-12月期:5
    var region = "-";
    var country = "-";
    var purpose = "1";//すべての目的:1, 観光・レジャー目的:2
    
    var linkTo = "https://resas.go.jp/tourrism-foreigners/#/to-visitor/9.139551352398794/35.07185405/137.44284295/"+prefcode+"/"+citycode+"/1/"+year+"/"+term+"/"+region+"/"+country+"/"+purpose;
    console.log(linkTo);
    window.open(linkTo,'_blank');

}




//農業部門別販売金額を表示
function drawAgriChart() {
    var deferred = new $.Deferred();
    var apiPath = "api/v1/agriculture/all/forStacked";

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
    var data = new google.visualization.DataTable();
    data.addColumn('string', '種類');
    data.addColumn('number', '販売金額（百万円）');
    
    $.ajax({
	type: 'GET',
	url: baseUrl + apiPath,
	headers: { 'X-API-KEY': apiKey },
	data: {cityCode: citycode, prefCode: prefcode, year: 2010},
	dataType: 'json',
	success: function(ret){
	    console.log(ret);
	    for (var i = 0; i < ret.result.data.length; i++) {
		var label = ret.result.data[i].sectionName;
		var val = ret.result.data[i].value;
		data.addRow([label, val]);
            }

	    var options = {
		title: '農産物ごとの売上金額（'+prefname+cityname+'）',
		isStacked: false, // trueにすると積み上げ棒グラフになる
		animation: {
		    duration: 2000,
		    easing: 'out',
		    startup: true,
                
		},
                height: 600 
	    };
	    
	    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
	    chart.draw(data, options);
	    deferred.resolve();
        }
    });

}

function drawManuChart() {

    var deferred = new $.Deferred();
    var apiPath = "api/v1/municipality/manufacture/perYear";

    var data = new google.visualization.DataTable();
    data.addColumn('string', '種類');
    data.addColumn('number', '販売金額（百万円）');

    $.ajax({
	type: 'GET',
	url: baseUrl + apiPath,
	headers: { 'X-API-KEY': apiKey },
	data: {cityCode: cityCode, prefCode: prefCode, year: 2010},
	dataType: 'json',
	success: function(ret){
	    for (var i = 0; i < ret.result.data.length; i++) {
		var label = ret.result.data[i].sectionName;
		var val = ret.result.data[i].value;
		data.addRow([label, val]);
            }

	    var options = {
		title: '農産物ごとの売上金額（）',
		isStacked: false, // trueにすると積み上げ棒グラフになる
		animation: {
		    duration: 2000,
		    easing: 'out',
		    startup: true,
                
		},
                height: 600 
	    };
	    
	    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
	    chart.draw(data, options);
	    deferred.resolve();
        }
    });
}





function geo2CityCode(lat, lng) {
    var deferred = new $.Deferred();
    $.ajax({
	type: 'GET',
	url: "https://www.cotogoto.ai/hikyoekirank/city",
	data: {lat: lat, lng: lng},
	dataType: 'json',
	success: function(ret){
	    $('#locinfo').attr("cityCode", ret.cityCode);
	    $('#locinfo').attr("prefCode", ret.prefCode);
	    deferred.resolve();
	}
    });    
    return deferred.promise();
}

