const {promises, createReadStream} = require('fs')
const http = require('http')
const path = require('path')



const server = http.createServer((req, res) => {
    promises.readFile('./index.html')
        .then(data => res.end(data))
    if (req.url.match('\.css$')) {
        const cssPath = path.join(__dirname, req.url)
        const fileStream = createReadStream(cssPath)
        res.writeHead(200, { 'Content-Type': 'text/css' })
        fileStream.pipe(res)
    }
    if (req.url.match('\.js$')) {
        const jsPath = path.join(__dirname, req.url)
        const fileStream = createReadStream(jsPath)
        res.writeHead(200, { 'Content-Type': 'text/javascript' })
        fileStream.pipe(res)
    }
})

server.listen(5050, () => {
    console.log('server is running at port 5050')
})