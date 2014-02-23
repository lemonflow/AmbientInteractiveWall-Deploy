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
        document.getElementById('debugtxt').textContent = 'Mouse MOVE: ' + mousePos.x + ',' + mousePos.y;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#343434";
        context.fillRect(mousePos.x-25, mousePos.y-25, 50, 50);
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
    };
    
    onAddTuioCursor = function(addCursor) {
        var $addCursor = $('<div class="tuioCursor"></div>');
        $("body").append($addCursor);
        cursors[addCursor.getCursorId()] = $addCursor;
        onUpdateTuioCursor(addCursor);
    };
    
    onUpdateTuioCursor = function(updateCursor) {
        var $updateCursor = cursors[updateCursor.getCursorId()];
        $updateCursor.css({
            left: updateCursor.getScreenX(screenW),
            top: updateCursor.getScreenY(screenH)
        });
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
//    client.on("addTuioCursor", onAddTuioCursor);
//    client.on("updateTuioCursor", onUpdateTuioCursor);
//    client.on("removeTuioCursor", onRemoveTuioCursor);
//    client.on("addTuioObject", onAddTuioObject);
//    client.on("updateTuioObject", onUpdateTuioObject);
//    client.on("removeTuioObject", onRemoveTuioObject);
//    client.on("refresh", onRefresh);
        client.connect();
});


