var brokerPrefix = '/echo';
var brokerIP = 'http://192.168.3.56:3000';



var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');

var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var sockjs_echo = sockjs.createServer(sockjs_opts);

var uuid_ids = [];
var uuid_map = {};
var obj;

//____________________________
//brocker communication with all the nodes on all render clients
sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        console.log("receive: "+message);
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


//_________________________________________
//static web server functionality
var static_directory = new node_static.Server("./../src");
var server = http.createServer();

server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});

sockjs_echo.installHandlers(server, {prefix:brokerPrefix});
console.log('Listening to 3000');
server.listen(3000);

//_________________________________________
//update capability (connect to github webhooks and update content)
var connect = require('connect'),
    shell = require('shelljs'),
    flick = require('flick'),
    sockjsm = require('sockjs-client');

var ws = new sockjsm.create(brokerIP+brokerPrefix);
ws.on('connection', function() { console.log("connected to master")});
ws.on('data',  function(data) { console.log("update module received:"+ data)});


function gitPull(root, options) {
    return function(req, res, next) {
        //console.log('Got WebHook for %s/%s', repository.owner.name, repository.name);
        
        var cmd = 'git pull' + (options.rebase ? ' --rebase' : '');
        
        shell.cd(root);
        shell.exec(cmd, function(code, output) {
            console.log(cmd + ' exited with code ' + code);
            var obj = {'reload':1};
            console.log("state: "+sockjsm.readyState);

            obj['id'] = 100;
            console.log("sending: "+JSON.stringify(obj));
            ws.write(JSON.stringify(obj));
        });
        
        next();
    };
}

app = connect();

var handler = flick();
handler.use('lemonflow/AmbientInteractiveWall-Deploy', gitPull('~/Workspace/AmbientInteractiveWall-Deploy', { rebase: true }));

app.use(connect.bodyParser());
app.use(flick.whitelist({ local: true }));
app.use(flick.payload());
app.use(handler);

app.use(function(req, res) {
    res.writeHead(200);
    res.end('Thank you.\n');
});

app.listen(4567);
console.log('update server listening on port 4567');