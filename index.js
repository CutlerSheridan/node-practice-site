// import * as fs from 'node:fs';
import * as fs from 'node:fs/promises';
import * as http from 'node:http';
import * as url from 'node:url';

const port = 3000;

const server = http.createServer((req, res) => {
  const urlQuery = url.parse(req.url, true);
  let filename = '.' + urlQuery.pathname + '.html';
  if (filename === './.html') {
    filename = './index.html';
  }
  res.setHeader('Content-Type', 'text/html');
  // promises version - requires importing fs/promises instead of fs
  return fs
    .readFile(filename)
    .then((result) => {
      res.statusCode = 200;
      // could also just return res.end(result) as that's equivalent to calling res.write(result) -> res.end()
      res.write(result);
      return res.end();
    })
    .catch((err) => {
      return fs.readFile('./404.html').then((result) => {
        res.statusCode = 404;
        res.write(result);
        return res.end();
      });
    });
  // non-promises version
  // fs.readFile(filename, (err, data) => {
  //   if (err) {
  //     res.statusCode = 404;
  //     fs.readFile('./404.html', (e, d) => {
  //       res.write(d);
  //       return res.end();
  //     });
  //   } else {
  //     res.statusCode = 200;
  //     res.write(data);
  //     return res.end();
  //   }
  // });
});

server.listen(port);
