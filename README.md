# Introduction
JSON Web Token(JWT) authentication middleware for auth.kyberneees.com service integration. 

# Usage
```js 
const jwt = require('com.kyberneees.auth.jwt');
const fs = require('fs');

const config = {
    pubkey: fs.readFileSync(__dirname + '/keys/pubkey.pem', "utf8"),
    checks: {
        issuer: 'auth.kyberneees.com',
        audience: 'https://yourapp.com'
    },
    isExpired: (payload) => {
        return Promise.resolve(false);
    },
    onUnauthorized: (req, err) => {}
};

const restify = require('restify');
const server = restify.createServer({
    name: 'yourapp.com',
    version: ['1.0.0']
});
server.use(jwt.middleware(const));
```

# WIP