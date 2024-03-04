import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';


export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    // const file_path = __dirname + (req.url === '/' ? '../frontend/index.html' : '../frontend' + req.url);
    const reqURL: string = req.url === '/' ? 'index.html' : req.url || '';
    const file_path = path.join('./src/frontend', reqURL);

    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            console.error(err);
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});