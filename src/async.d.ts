export interface Options {
	cwd: string;
	tmpdir: boolean;
}

export function pkgcache(name: string, opts: { tmpdir: true } & Partial<Options>): Promise<string>;
export function pkgcache(name: string, opts?: Partial<Options>): Promise<string | void>;
