export interface Options {
	cwd: string;
	tmpdir: boolean;
}

export function pkgcache(name: string, opts: { tmpdir: true } & Partial<Options>): string;
export function pkgcache(name: string, opts?: Partial<Options>): string | void;
