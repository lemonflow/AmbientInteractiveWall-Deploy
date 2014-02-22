var connect = require('connect'),
    shell = require('shelljs'),
    flick = require('flick'),
    app = connect();

function gitPull(root, options)
{
    return function(req, res, next) {
        var cmd = 'git pull' + (options.rebase ? ' --rebase' : '');
        
        shell.cd(root);
        shell.exec(cmd, function(code, output) {
            console.log(cmd + ' exited with code ' + code);
        });
        
        next();
    };
}

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