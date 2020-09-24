import { join } from 'path';
import { promisify } from 'util';
import { access, existsSync } from 'fs';
import escalade from 'escalade';
import { tmpdir } from 'os';

const toAccess = promisify(access);
const isWrite = str => toAccess(str, 2).then(() => true).catch(() => false);

export async function pkgcache(name, opts) {
	let env = process.env.CACHE_DIR || '';
	if (env && !/^(true|false|1|0)$/.test(env)) return env;

	let fallback;
	opts = opts || {};
	if (opts.tmpdir) fallback = tmpdir();

	let base = await escalade(opts.cwd || '.', (dir, files) => {
		if (files.includes('package.json')) return dir;
	});

	if (!base) return fallback;

	let dir = join(base, 'node_modules');
	if (existsSync(dir) && !(await isWrite(dir))) return fallback;

	return join(dir, '.cache', name);
}
