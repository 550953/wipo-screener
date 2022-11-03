import http from 'http';
import parser from './app/parser.js';

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async (req, res) => {
    if (req.method == 'POST') {
        let body = '';

        req.on('readable', () => {
            const temp = req.read();

            if (temp !== null) body += temp;
        });

        req.on('end', async () => {
            await parser(JSON.parse(body))
                .then(data => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
                    res.end(
                        JSON.stringify(data)
                    );
                })
                .catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
                    res.end(
                        JSON.stringify({
                            title: 'Ошибка',
                            msg: err
                        })
                    );
                })
        });
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.end(
            'Not found'   
        );
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});