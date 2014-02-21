
var IOConnectorTUIO = (function () {
    "use strict";
    
    function IOConnectorTUIO() {
        console.log('starting');
        this.client = new Tuio.Client({host: "http://localhost:5000"});
        
        this.client.on("addTuioCursor", onAddTuioCursor);
        this.client.on("updateTuioCursor", onUpdateTuioCursor);
        this.client.on("removeTuioCursor", onRemoveTuioCursor);
        this.client.on("addTuioObject", onAddTuioObject);
        this.client.on("updateTuioObject", onUpdateTuioObject);
        this.client.on("removeTuioObject", onRemoveTuioObject);
        this.client.on("refresh", onRefresh);
        this.client.connect();
    };
    
    IOConnectorTUIO.prototype.init = function () {
    };
    
    
    IOConnectorTUIO.prototype.onAddTuioCursor = function(addCursor) {
        console.log(addCursor);
    };
    
    IOConnectorTUIO.prototype.onUpdateTuioCursor = function(updateCursor) {
        console.log(updateCursor);
    };
    
    IOConnectorTUIO.prototype.onRemoveTuioCursor = function(removeCursor) {
        console.log(removeCursor);
    };
    
    IOConnectorTUIO.prototype.onAddTuioObject = function(addObject) {
        console.log(addObject);
    };
    
    IOConnectorTUIO.prototype.onUpdateTuioObject = function(updateObject) {
        console.log(updateObject);
    };
    
    IOConnectorTUIO.prototype.onRemoveTuioObject = function(removeObject) {
        console.log(removeObject);
    };
    
    IOConnectorTUIO.prototype.onRefresh = function(time) {
        console.log(time);
    };
    
    return IOConnectorTUIO;
})();




