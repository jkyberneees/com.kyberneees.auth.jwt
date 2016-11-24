const jwt = require('jsonwebtoken');
const unless = require('express-unless');

const verify = (token, config) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.pubkey, config.checks, (err, payload) => {
            if (err) reject(err);
            else {
                (config.isExpired ? config.isExpired(payload) : Promise.resolve(false)).then((expired) => {
                    if (expired) reject(new Error('Access token has expired!'));
                    else resolve(payload);
                }).catch(reject);
            }
        });
    });
};

module.exports = {
    middleware: (config) => {
        let middleware = function (req, res, next) {
            let token = req.headers.authorization || req.headers['x-authorization'] || req.query.token || '';
            if (token.split(' ')[0] === 'Bearer') {
                token = token.split(' ')[1];
            }

            verify(token, config).then((payload) => {
                req.token = payload;
                req.user = {
                    id: payload.id,
                    roles: payload.roles,
                    email: payload.email,
                    phone: payload.phone,
                    spubkey: payload.spubkey
                };
                delete payload.id;
                delete payload.roles;
                delete payload.email;
                delete payload.phone;
                delete payload.spubkey;

                next();
            }).catch((err) => {
                if (config.onUnauthorized) config.onUnauthorized(req, err);

                err = err instanceof Error ? err : new Error(err.toString());
                err.status = 401;
                next(err);
            });
        };
        middleware.unless = require('express-unless');

        return middleware;
    }
};