var brokerPrefix = '/echo';
var brokerIP = 'http://192.168.3.56:3000';


//_________________________________________
//update capability (connect to github webhooks and update content)
var connect = require('connect'),
    shell = require('shelljs'),
    flick = require('flick');
//    sockjsm = require('sockjs-client');
//var ws = new sockjsm.create(brokerIP+brokerPrefix);
//ws.on('connection', function() { console.log("connected to master")});
//ws.on('data',  function(data) { console.log("update module received:"+ data)});


function gitPull(root, options) {
    return function(req, res, next) {
        console.log('Got WebHook from Github: '+JSON.stringify(options));
        
        var cmd = 'git pull' + (options.rebase ? ' --rebase' : '');
        
        shell.cd(root);
        shell.exec(cmd, function(code, output) {
            console.log(cmd + ' exited with code ' + code);
//            var obj = {'reload':1};
//            console.log("state: "+sockjsm.readyState);

//            obj['id'] = 100;
//            console.log("sending: "+JSON.stringify(obj));
//            ws.write(JSON.stringify(obj));
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