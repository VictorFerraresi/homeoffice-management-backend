"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    name: 'API',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://robot:homehome@ds255309.mlab.com:55309/homgmt'
    },
    logger: {
        level: 'info'
    },
    prefix: '/api',
    api: {
        version: 'v1'
    },
    jwt: {
        secret: 'hobackend123'
    }
};
