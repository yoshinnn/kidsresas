function getUniqueStr(){
    var strong = 1000;
    var uuid = new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
    console.log(uuid);
    document.body.setAttribute("value",uuid);
}
