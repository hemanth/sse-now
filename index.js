'use strict';
const http = require('http');
const fs = require('fs');
const marked = require('marked');
const readFile = require('fs').readFile;
const headers = {};

http.createServer((req, res) => {
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
  headers['Access-Control-Allow-Credentials'] = true
  headers['Access-Control-Max-Age'] = '86400' // 24 hours
  headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept'

  // forget favicon for now.
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    sendSSE(req, res)
  } else {
    readFile('./readme.md', {encoding: 'utf-8'}, (err, markdownString) => {
      marked(markdownString, (err, content) => {
        if (err) {
          res.end(JSON.stringify({ error: 'Yikes! Report to @gnumanth'}))
        }
        headers['Content-Type'] = 'text/html';
        res.writeHead(200,headers);
        res.end(content);
      })
    })
  }
}).listen(8000)

const sendSSE = (req, res) => {
  headers['Content-Type'] = 'text/event-stream';
  headers['Cache-Control'] = 'no-cache';
  headers['Connection'] = 'keep-alive';
  res.writeHead(200, headers);

  const id = (new Date()).toLocaleTimeString()

  // SSE every 5sec.
  setInterval(() => {
    constructSSE(res, id, (new Date()).toLocaleTimeString())
  }, 5000)

  constructSSE(res, id, (new Date()).toLocaleTimeString())
}

const constructSSE = (res, id, data) => {
  // @ebidel's impl.
  res.write(`id: ${id}\n`)
  res.write(`data: ${data}\n\n`)
}
