console.time('find-cache-dir');
const findcache = require('find-cache-dir');
console.timeEnd('find-cache-dir');

console.time('scorta');
const scorta = require('scorta');
console.timeEnd('scorta');

console.time('scorta/sync');
const sync = require('scorta/sync');
console.timeEnd('scorta/sync');
