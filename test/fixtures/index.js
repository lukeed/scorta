import { join } from 'path';
import { spawnSync } from 'child_process';

const BIN = join(__dirname, 'read.js');

export function readonly(dir) {
	let pid = spawnSync('node', [BIN, dir, '1']);
	console.log('~> PID:', pid.status, pid.stdout.toString(), pid.stderr.toString());
}

export function revert(dir) {
	let pid = spawnSync('node', [BIN, dir]);
	console.log('~> PID:', pid.status, pid.stdout.toString(), pid.stderr.toString());
}
