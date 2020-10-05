const assert = require('assert');
const { resolve } = require('path');
const { Suite } = require('benchmark');

const { scorta } = require('scorta');
const findCache = require('find-cache-dir');
const sync = require('scorta/sync').scorta;

const fixtures = resolve(__dirname, 'fixtures');
const __hello = resolve(fixtures, 'a1/b2/c3/d4/e5/f6', 'hello.txt');
const __world = resolve(fixtures, 'a1/b2/c3/d4/e5/f6/g7/h8/i9/j10', 'world.txt');

const contenders = {
	'find-cache-dir': (name, cwd) => findCache({ name, cwd }),
	'scorta/sync': (name, cwd) => sync(name, { cwd }),
	'scorta': (name, cwd) => scorta(name, { cwd }),
}

function toCache(dir, name) {
	return resolve(dir, 'node_modules', '.cache', name);
}

function pad(str) {
	return str + ' '.repeat(16 - str.length);
}

async function runner(target, cwd, expects) {
	console.log(`\nValidation (target = "${target}"): `);
	for (const name of Object.keys(contenders)) {
		try {
			const output = await contenders[name](target, cwd);

			if (expects) assert.equal(typeof output, 'string', 'returns string');
			assert.equal(output, expects);

			console.log('  ✔', pad(name));
		} catch (err) {
			console.log('  ✘', pad(name), `(FAILED @ "${err.message}")`);
		}
	}
	console.log(`\nBenchmark (target = "${target}"):`);
	const bench = new Suite().on('cycle', e => {
		console.log('  ' + e.target);
	});

	Object.keys(contenders).forEach(name => {
		if (name === 'scorta') {
			bench.add(pad(name), async () => {
				await contenders[name](target, cwd);
			}, { async: true });
		} else {
			bench.add(pad(name), () => {
				contenders[name](target, cwd);
			});
		}
	});

	return new Promise((res, rej) => {
		bench.on('complete', res);
		bench.on('error', rej);
		bench.run();
	});
}

(async function () {
	await runner('foo', fixtures, toCache(fixtures, 'foo')); // ~>  0 lvls
	await runner('bar', __hello, toCache(fixtures, 'bar'));  // ~>  6 lvls
	await runner('baz', __world, toCache(fixtures, 'baz'));  // ~> 11 lvls
})().catch(err => {
	console.error('Oops~!', err)
});
