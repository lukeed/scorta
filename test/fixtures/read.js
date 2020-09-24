#!/usr/bin/env node
const { chmodSync } = require('fs');
const [dirname, toRead] = process.argv.slice(2);
chmodSync(dirname, toRead ? 0o444 : 0o777);
