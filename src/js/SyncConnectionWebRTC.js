var SyncConnectionWebRTC = (function () {
    "use strict";
    
    function SyncConnectionWebRTC() {
        this.serverp = null;
        this.peer = null;
        this.clientc = null;
        this.connections = [];
    }
    
    SyncConnectionWebRTC.prototype.startConnection = function() {
        var self = this;
        var currentdate = new Date().getTime();
        
        
        
        
        if(clientid == 50) {
            this.serverp = new Peer('server',{key: '8a18h0y8o1tqehfr'});
            this.serverp.on('connection', function(serverconn) {
                
                self.connections.push(serverconn);
                
                document.getElementById('debugtxt').textContent = "remote client connected: " +serverconn.peer;
                serverconn.on('open', function() {
                    console.log('server new connection open: '+serverconn.peer);
                    //                    this.connections.push(serverconn.peer);
                    serverconn.on('data', function(data) { //receiving from client
                        console.log('server received data, origin from: '+serverconn.peer);
                        for(var i= 0; i<self.connections.length;i++) {
                            self.connections[i].send(data);
                        }
                    });
                });
            });
        }
        
        this.peer = new Peer('ux'+clientid,{key: '8a18h0y8o1tqehfr'});
        this.peer.on('open', function() {
            //            console.log('Opened Peer: ' + );
            self.clientc = self.peer.connect('server');
            self.clientc.on('open', function() {
                self.clientc.on('data', function(data) {
                    document.getElementById('debugtxt').textContent = "client "+clientid+" received: "+" t: "+data['type']+" 0: "+data['0']+":1 "+data['1'];
                    console.log("client "+clientid+" received: "+data);
                    
                    if(data['type']=='transition') 
                        focusView.controller.executeTransition(data['2'], false);
                });
            });
        });
        
        
    }
    return SyncConnectionWebRTC;
})();
