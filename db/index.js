const mongojs = require('mongojs');
const databaseUrl = 'store';
const collections = ['user'];
const db = mongojs(databaseUrl, collections);
const log = console.log;

db.on('error', () => {
    log('Database error');
});

db.on('connect', () => {
    log('MongoDB connected');
});

module.exports = db;