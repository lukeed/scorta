import { join } from 'path';
import { accessSync, existsSync } from 'fs';
import escalade from 'escalade/sync';
import { tmpdir } from 'os';

function isWrite(str) {
	try { return (accessSync(str, 2),true) }
	catch (err) { return false }
}

export function pkgcache(name, opts) {
	opts = opts || {};

	let env = process.env.CACHE_DIR || '';
	if (env && !/^(true|false|1|0)$/.test(env)) return env;

	let fallback;
	if (opts.tmpdir) fallback = tmpdir();

	let base = escalade(opts.cwd || '.', (dir, files) => {
		if (files.includes('package.json')) return dir;
	});

	if (!base) return fallback;

	let dir = join(base, 'node_modules');
	if (existsSync(dir) && !isWrite(dir)) return fallback;

	return join(dir, '.cache', name);
}
