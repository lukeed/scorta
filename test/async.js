import { test } from 'uvu';
import { join } from 'path';
import * as assert from 'uvu/assert';
import { pkgcache } from '../src/async';
import * as utils from './fixtures';
import { tmpdir } from 'os';

const toCacheDir = (base, name='') => join(base, 'node_modules', '.cache', name);

const TMPDIR = tmpdir();
const fixtures = join(__dirname, 'fixtures');
const CACHE = toCacheDir( join(__dirname, '..') );

test('should export a function', () => {
	assert.type(pkgcache, 'function');
});

test('should assume process.cwd', async () => {
	assert.is(
		await pkgcache('bundt'),
		join(CACHE, 'bundt')
	);

	assert.is(
		await pkgcache('foobar'),
		join(CACHE, 'foobar')
	);
});

test('should accept custom cwd', async () => {
	let cwd = __dirname;

	assert.is(
		await pkgcache('bundt', { cwd }),
		join(CACHE, 'bundt')
	);

	assert.is(
		await pkgcache('foobar', { cwd }),
		join(CACHE, 'foobar')
	);

	assert.is(
		await pkgcache('hello', { cwd: fixtures }),
		toCacheDir(fixtures, 'hello')
	);

	cwd = join(fixtures, 'nested');

	assert.is(
		await pkgcache('hello', { cwd }),
		toCacheDir(fixtures, 'hello')
	);
});

test('should return `undefined` if no `package.json` found', async () => {
	assert.is(
		await pkgcache('hello', { cwd: TMPDIR }),
		undefined
	);
});

if (!utils.isWin) {
	test('should return `undefined` if `node_modules` is read-only', async () => {
		let cwd = join(fixtures, 'readonly1');
		let modules = join(cwd, 'node_modules');
		utils.readonly(modules);

		assert.is(
			await pkgcache('hello', { cwd }),
			undefined
		);

		utils.revert(modules);
	});

	test('should return `undefined` if `node_modules` is missing within read-only', async () => {
		let cwd = join(fixtures, 'readonly2');
		utils.readonly(cwd);

		assert.is(
			await pkgcache('hello', { cwd }),
			undefined
		);
		utils.revert(cwd);
	});
}

test('should ignore `opts.tmpdir` if found `package.json`', async () => {
	assert.is(
		await pkgcache('bundt', { tmpdir: true }),
		join(CACHE, 'bundt')
	);

	assert.is(
		await pkgcache('hello', { cwd: fixtures, tmpdir: true }),
		toCacheDir(fixtures, 'hello')
	);
});

test('should invoke `os.tmpdir()` instead of `undefined` output', async () => {
	let output = await pkgcache('hello', {
		cwd: TMPDIR,
		tmpdir: true
	});
	assert.is.not(output, undefined);
	assert.type(output, 'string');
});

test('should ignore `CACHE_DIR` env if invalid', async () => {
	const expect = join(CACHE, 'hello');

	process.env.CACHE_DIR = '1';
	assert.is(await pkgcache('hello'), expect);

	process.env.CACHE_DIR = '0';
	assert.is(await pkgcache('hello'), expect);

	process.env.CACHE_DIR = 'true';
	assert.is(await pkgcache('hello'), expect);

	process.env.CACHE_DIR = 'false';
	assert.is(await pkgcache('hello'), expect);
	delete process.env.CACHE_DIR;
});

test('should return `CACHE_DIR` env if found', async () => {
	process.env.CACHE_DIR = 'hello';
	assert.is(await pkgcache('world'), 'hello');
	delete process.env.CACHE_DIR;
});

test.run();
