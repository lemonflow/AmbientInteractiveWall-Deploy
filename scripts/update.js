
var connect = require('connect'),
    shell = require('shelljs'),
    flick = require('flick'),
    sockjsm = require('sockjs-client');

var ws = new sockjsm.create('http://127.0.0.1:3000/echo');
//var ws = new sockjsm.create('http://192.168.3.56:3000/echo');

ws.on('connection', function() { console.log("connected to master")});
ws.on('data',  function(data) { console.log(data)});

function triggerStateChange() {
    var obj = {'reload':1};
     console.log("state: "+sockjsm.readyState);
//    if(sockjsm.readyState==1) {
        obj['id'] = 100;
        console.log("sending: "+JSON.stringify(obj));
        ws.write(JSON.stringify(obj));
//    }
}

function gitPull(root, options) {
    return function(req, res, next) {
//        console.log('Got WebHook for %s/%s', repository.owner.name, repository.name);
        
        var cmd = 'git pull' + (options.rebase ? ' --rebase' : '');
        
        shell.cd(root);
        shell.exec(cmd, function(code, output) {
            console.log(cmd + ' exited with code ' + code);
            triggerStateChange();
            
        });
        
        next();
    };
}

app = connect();

var handler = flick();
handler.use('lemonflow/AmbientInteractiveWall-Deploy', gitPull('~/Workspace/AmbientInteractiveWall-Deploy', { rebase: true }));

// Parse body of POST requests
app.use(connect.bodyParser());
app.use(flick.whitelist({ local: true }));
app.use(flick.payload());
app.use(handler);

app.use(function(req, res) {
    res.writeHead(200);
    res.end('Thank you.\n');
});

app.listen(4567);
console.log('flick is listening on port 4567');