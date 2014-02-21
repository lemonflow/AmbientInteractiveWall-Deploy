var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');

var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var sockjs_echo = sockjs.createServer(sockjs_opts);

var uuid_ids = [];
var uuid_map = {};
var obj;


sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        obj = JSON.parse(message); 
        
        //map if new connection 
        if(uuid_map[obj.id] == undefined || uuid_map[obj.id] == null) {
            uuid_ids.push(obj.id);
            uuid_map[obj.id] = conn;
        }
        
        //broadcast message to all connections
        for(var i=0;i<uuid_ids.length;i++){
            var tconn = uuid_map[uuid_ids[i]];
            if(tconn == null) continue;
            tconn.write(JSON.stringify(obj));
            console.log("sending to: "+uuid_ids[i]);
        }
    });
    
    conn.on('close', function(message) {
        for(var i=0;i<uuid_ids.length;i++){
            var tconn = uuid_map[uuid_ids[i]];
            if(tconn == conn) {
                uuid_map[uuid_ids[i]] = null;
                console.log("removing: "+uuid_ids[i]);
                uuid_ids.splice(i,1);
            }
        }
    });
});



// 2. Static files server
var static_directory = new node_static.Server("./../src");


var server = http.createServer();

server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});

sockjs_echo.installHandlers(server, {prefix:'/echo'});

console.log('Listening to 3000');
server.listen(3000);

//var http = require('http');
//var server = http.createServer(function (request, response) {
//  response.writeHead(200, {"Content-Type": "text/plain"});
//  response.end("Hello World\n");
//});


//var connect = require('connect');
//connect.createServer(
//    connect.static('../')
//).listen(3000);
//
//console.log("Server running at http://127.0.0.1:3000/");

//var io = require('socket.io').listen(3000);
//
//io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});