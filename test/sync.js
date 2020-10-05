import { test } from 'uvu';
import { join } from 'path';
import * as assert from 'uvu/assert';
import { scorta } from '../src/sync';
import * as utils from './fixtures';
import { tmpdir } from 'os';

const toCacheDir = (base, name='') => join(base, 'node_modules', '.cache', name);

const TMPDIR = tmpdir();
const fixtures = join(__dirname, 'fixtures');
const CACHE = toCacheDir( join(__dirname, '..') );

test('should export a function', () => {
	assert.type(scorta, 'function');
});

test('should assume process.cwd', () => {
	assert.is(
		scorta('bundt'),
		join(CACHE, 'bundt')
	);

	assert.is(
		scorta('foobar'),
		join(CACHE, 'foobar')
	);
});

test('should accept custom cwd', () => {
	let cwd = __dirname;

	assert.is(
		scorta('bundt', { cwd }),
		join(CACHE, 'bundt')
	);

	assert.is(
		scorta('foobar', { cwd }),
		join(CACHE, 'foobar')
	);

	assert.is(
		scorta('hello', { cwd: fixtures }),
		toCacheDir(fixtures, 'hello')
	);

	cwd = join(fixtures, 'nested');

	assert.is(
		scorta('hello', { cwd }),
		toCacheDir(fixtures, 'hello')
	);
});

test('should return `undefined` if no `package.json` found', () => {
	assert.is(
		scorta('hello', { cwd: TMPDIR }),
		undefined
	);
});

if (!utils.isWin) {
	test('should return `undefined` if `node_modules` is read-only', () => {
		let cwd = join(fixtures, 'readonly1');
		let modules = join(cwd, 'node_modules');
		utils.readonly(modules);

		assert.is(
			scorta('hello', { cwd }),
			undefined
		);

		utils.revert(modules);
	});

	test('should return `undefined` if `node_modules` is missing within read-only', () => {
		let cwd = join(fixtures, 'readonly2');
		utils.readonly(cwd);

		assert.is(
			scorta('hello', { cwd }),
			undefined
		);

		utils.revert(cwd);
	});
}

test('should ignore `opts.tmpdir` if found `package.json`', () => {
	assert.is(
		scorta('bundt', { tmpdir: true }),
		join(CACHE, 'bundt')
	);

	assert.is(
		scorta('hello', { cwd: fixtures, tmpdir: true }),
		toCacheDir(fixtures, 'hello')
	);
});

test('should invoke `os.tmpdir()` instead of `undefined` output', () => {
	let output = scorta('hello', {
		cwd: TMPDIR,
		tmpdir: true
	});
	assert.is.not(output, undefined);
	assert.type(output, 'string');
});

test('should ignore `CACHE_DIR` env if invalid', () => {
	const expect = join(CACHE, 'hello');

	process.env.CACHE_DIR = '1';
	assert.is(scorta('hello'), expect);

	process.env.CACHE_DIR = '0';
	assert.is(scorta('hello'), expect);

	process.env.CACHE_DIR = 'true';
	assert.is(scorta('hello'), expect);

	process.env.CACHE_DIR = 'false';
	assert.is(scorta('hello'), expect);
	delete process.env.CACHE_DIR;
});

test('should return `CACHE_DIR` env if found', () => {
	process.env.CACHE_DIR = 'hello';
	assert.is(scorta('world'), 'hello');
	delete process.env.CACHE_DIR;
});

test.run();
