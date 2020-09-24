import { join } from 'path';
import { accessSync, existsSync } from 'fs';
import escalade from 'escalade/sync';
import { tmpdir } from 'os';

function isWrite(str) {
	try { return (accessSync(str, 2),true) }
	catch (err) { return false }
}

export function pkgcache(name, opts) {
	let dir, env = process.env.CACHE_DIR || '';
	if (env && !/^(true|false|1|0)$/.test(env)) return env;

	let fallback;
	opts = opts || {};
	if (opts.tmpdir) fallback = tmpdir();

	let base = escalade(opts.cwd || '.', (dir, files) => {
		if (files.includes('package.json')) return dir;
	});

	if (!base) return fallback;

	let writable = isWrite(dir=join(base, 'node_modules'));
	if (!writable && existsSync(dir)) return fallback;
	if (!writable && !isWrite(base)) return fallback;
	return join(dir, '.cache', name);
}
