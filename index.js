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
                    res.end(
                        JSON.stringify(data)
                    );
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                        JSON.stringify({
                            title: 'Ошибка',
                            msg: err
                        })
                    );
                })
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(
            'Not found'   
        );
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});