# scorta [![CI](https://github.com/lukeed/scorta/workflows/CI/badge.svg)](https://github.com/lukeed/scorta/actions) [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/scorta)](https://codecov.io/gh/lukeed/scorta)

> A tiny (330B to 357B) and fast utility to find a module's hidden supply / cache directory.

With `scorta`, you can locate a module's private `.cache` directory by name.
This is a common practice among many popular libraries, including AVA, `nyc`, Babel, etc.

```sh
# Others
./node_modules/.cache/ava
./node_modules/.cache/babel
./node_modules/.cache/nyc
# Yours!
./node_modules/.cache/hello-world
```

When searching, the following steps are taken:

1) Echo the value of `process.env.CACHE_DIR` if defined and truthy
2) [Traverse parent directories](https://github.com/lukeed/escalade) until a `package.json` file is found
3) If a `package.json` was found, return a `node_modules/.cache/{name}` path _only_ if it's not read-only
4) All other cases return a `fallback`, which is either `undefined` or a [`os.tmpdir`](https://nodejs.org/api/os.html#os_os_tmpdir) value

> **Why "scorta"?** It's Italian for a stock or a supply, which is generally the purpose for a `.cache` directory.


## Install

```
$ npm install --save scorta
```


## Modes

There are two "versions" of `scorta` available:

#### "async"
> **Node.js:** >= 8.x<br>
> **Size (gzip):** 357 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/scorta/dist/index.js), [ES Module](https://unpkg.com/scorta/dist/index.mjs)

This is the primary/default mode. It makes use of `async`/`await` and [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original).

#### "sync"
> **Node.js:** >= 6.x<br>
> **Size (gzip):** 330 bytes<br>
> **Availability:** [CommonJS](https://unpkg.com/scorta/sync/index.js), [ES Module](https://unpkg.com/scorta/sync/index.mjs)

This is the opt-in mode, ideal for scenarios where `async` usage cannot be supported.


## Usage

***Example Structure***

```
/example
  ├── fixtures
    └── empty.js
  └── demo
    └── node_modules/...
    └── package.json
    └── index.js
```

***Example Usage***

```js
// demo/index.js

import { join } from 'path';
import { scorta } from 'scorta';

const fixtures = join(__dirname, '..', 'fixtures');

await scorta('hello');
//=> "/example/demo/node_modules/.cache/hello"

await scorta('hello', { cwd: fixtures });
//=> undefined

await scorta('hello', { cwd: fixtures, tmpdir: true });
//=> "/var/folders/77/hdmgkj_x2l7454w0y5lwv2l80000gn/T"
```

> **Note:** To run the above example with "sync" mode, import from `scorta/sync` and remove the `await` keyword.


## API

### scorta(name, options)
Returns: `Promise<string|void>` or `string|void`

When `scorta` locates a valid directory, the value will always be an absolute path (`string`).

However, if `scorta` cannot locate a valid, writable directory, then the return value is `undefined` by default. However, this can be changed via the [`tmpdir`](#optionstmpdir) option.

> **Important:**<br>The `sync` and `async` versions share the same API.<br>The **only** difference is that `sync` is not Promise-based.

#### name
Type: `string`

The target module's name.

This value is used to construct the final `.cache` directory path. For example:

```js
await scorta('hello');
//=> /.../node_modules/.cache/hello
```

#### options.cwd
Type: `string`<br>
Default: `.`

The directory where path resolution should begin.
Defauls to the `process.cwd()` – aka, the directory that your `process` is run within.


#### options.tmpdir
Type: `boolean`<br>
Default: `false`

When truthy, `scorta` will return a [`os.tmpdir()`](https://nodejs.org/api/os.html#os_os_tmpdir) value instead of `undefined`.

> **Important:** When this option is in use, `scorta` always yields a string!


## Related

- [escalade](https://github.com/lukeed/escalade) - A tiny (183B to 210B) utility to ascend parent directories
- [totalist](https://github.com/lukeed/totalist) - A tiny (195B to 224B) utility to recursively list all (total) files in a directory
- [mk-dirs](https://github.com/lukeed/mk-dirs) - A tiny (380B to 420B) utility to make a directory and its parents, recursively


## License

MIT © [Luke Edwards](https://lukeed.com)
