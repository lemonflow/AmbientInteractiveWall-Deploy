//
//var IOConnectorTUIO = (function () {
//    "use strict";
//    
//    function IOConnectorTUIO() {
//        console.log('starting');
//        this.client = new Tuio.Client({host: "http://localhost:5000"});
//        
//        this.client.on("addTuioCursor", onAddTuioCursor);
//        this.client.on("updateTuioCursor", onUpdateTuioCursor);
//        this.client.on("removeTuioCursor", onRemoveTuioCursor);
//        this.client.on("addTuioObject", onAddTuioObject);
//        this.client.on("updateTuioObject", onUpdateTuioObject);
//        this.client.on("removeTuioObject", onRemoveTuioObject);
//        this.client.on("refresh", onRefresh);
//        this.client.connect();
//    };
//    
//    IOConnectorTUIO.prototype.init = function () {
//    };
//    
//    
//    IOConnectorTUIO.prototype.onAddTuioCursor = function(addCursor) {
//        console.log(addCursor);
//    };
//    
//    IOConnectorTUIO.prototype.onUpdateTuioCursor = function(updateCursor) {
//        console.log(updateCursor);
//    };
//    
//    IOConnectorTUIO.prototype.onRemoveTuioCursor = function(removeCursor) {
//        console.log(removeCursor);
//    };
//    
//    IOConnectorTUIO.prototype.onAddTuioObject = function(addObject) {
//        console.log(addObject);
//    };
//    
//    IOConnectorTUIO.prototype.onUpdateTuioObject = function(updateObject) {
//        console.log(updateObject);
//    };
//    
//    IOConnectorTUIO.prototype.onRemoveTuioObject = function(removeObject) {
//        console.log(removeObject);
//    };
//    
//    IOConnectorTUIO.prototype.onRefresh = function(time) {
//        console.log(time);
//    };
//    
//    return IOConnectorTUIO;
//})();



$(function() {
    var client = new Tuio.Client({
        //                host: "http://192.168.3.52:3333"
        host: "http://127.0.0.1:5000"
    });
    
    var   screenW = $(document).width();
    var   screenH = $(document).height();
    var canvas = null;
    var context = null;
    
    time = new Date().getTime();
    canvas = $("#tuioCanvas").get(0);
    canvas.width = screenW;
    canvas.height = screenH;
    context = canvas.getContext("2d");
    
    console.log("____________"+canvas);
    
    document.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos =  {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
//        document.getElementById('debugtxt').textContent = 'Mouse MOVE: ' + mousePos.x + ',' + mousePos.y;
        context.clearRect(0, 20, canvas.width, canvas.height);
        context.fillStyle = "#454545";
        context.fillRect(mousePos.x-25, mousePos.y-25, 50, 50);
        context.fillStyle = "#898989";
        context.fillText(mousePos.x + ',' + mousePos.y, mousePos.x-20, mousePos.y-30);
    }, false);
    
    canvas.addEventListener('mouseup', function(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos =  {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        document.getElementById('debugtxt').textContent = 'Mouse UP: ' + mousePos.x + ',' + mousePos.y;
    }, false);
    
    
    canvas.addEventListener('mousedown', function(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos =  {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        document.getElementById('debugtxt').textContent = 'Mouse DOWN: ' + mousePos.x + ',' + mousePos.y;
    }, false);
    
    cursors = {};
    
    onConnect = function() {
        document.getElementById('debugtxt').textContent = "TUIO connected";
        context.clearRect(0, 0, canvas.width, 20);
        context.fillStyle = "#457745";
        context.fillRect(0,0, 20, 20);
        context.fillStyle = "#898989";
        context.fillText("TUIO connected",25,12);
    };
    
    onAddTuioCursor = function(c) {
        
        context.clearRect(50, 0, canvas.width, 20);
        context.fillStyle = "#457745";
        context.fillRect(50 ,0, 20, 20);
        context.fillStyle = "#898989";
        context.fillText("TUIO addCursor",75,12);
        
        cursors[c.getCursorId()] = c.getCursorId();
        onUpdateTuioCursor(c);
    };
    
    onUpdateTuioCursor = function(c) {
        var value = cursors[c.getCursorId()];
        
        context.clearRect(0, 20, canvas.width, canvas.height);
        context.fillStyle = "#784545";
        context.fillRect(mousePos.x-25, mousePos.y-25, 50, 50);
        context.fillStyle = "#776666";
        context.fillText(mousePos.x + ',' + mousePos.y, c.getScreenX(screenW)-20, c.getScreenY(screenH)-30);
    };
    
    onRemoveTuioCursor = function(removeCursor) {
        var $removeCursor = cursors[removeCursor.getCursorId()];
        $removeCursor.remove();
        delete[removeCursor.getCursorId()];
    };
    
    onAddTuioObject = function(addObject) {
        console.log(addObject);
    };
    
    onUpdateTuioObject = function(updateObject) {
        console.log(updateObject);
    };
    
    onRemoveTuioObject = function(removeObject) {
        console.log(removeObject);
    };
    
    onRefresh = function(time) {
    };
    
    client.on("connect", onConnect);
    client.on("addTuioCursor", onAddTuioCursor);
    client.on("updateTuioCursor", onUpdateTuioCursor);
    client.on("removeTuioCursor", onRemoveTuioCursor);
    client.on("addTuioObject", onAddTuioObject);
    client.on("updateTuioObject", onUpdateTuioObject);
    client.on("removeTuioObject", onRemoveTuioObject);
    client.on("refresh", onRefresh);
        client.connect();
});


