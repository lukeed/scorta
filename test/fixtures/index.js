import { join } from 'path';
import { spawnSync } from 'child_process';

const BIN = join(__dirname, 'read.js');

export const isWin = process.platform === 'win32';

export function readonly(dir) {
	spawnSync('node', [BIN, dir, '1']);
}

export function revert(dir) {
	spawnSync('node', [BIN, dir]);
}
