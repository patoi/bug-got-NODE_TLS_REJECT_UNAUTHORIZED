// reporducing got bu v12.5.2: ignored NODE_TLS_REJECT_UNAUTHORIZED in https

import got from 'got'
import fs from 'node:fs'
import https from 'node:https'

// test server with self-signed certificate

https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('test.self-signed.cert.pem'),
    },
    function (req, res) {
      res.writeHead(200)
      res.end('hello world\n')
    }
  )
  .listen(1443)

// production code: https request

const options = {
  hostname: 'localhost',
  port: 1443,
  path: '/',
  method: 'GET',
  ca: fs.readFileSync('./prod.cert.pem'),
}

// Node.js http request

const req = https.request(options, res => {
  console.log('\n\n***** Node.js http.request response *****')
  res.on('data', d => {
    process.stdout.write(d)
  })
})
req.on('error', e => {
  console.error(e)
})
req.end()

// GOT http request
// With NODE_TLS_REJECT_UNAUTHORIZED='0' v11 works fine, but is doesn't work with v12

try {
  const response = await got
    .get('https://localhost:1443', {
      https: {
        certificateAuthority: fs.readFileSync('./prod.cert.pem'),
      },
    })
    .text()
  console.log('\n\n***** GOT response *****')
  console.log(response)
} catch (error) {
  console.log('\n\n***** GOT response error *****')
  console.error(error.message)
}
