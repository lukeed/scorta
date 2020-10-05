export interface Options {
	cwd: string;
	tmpdir: boolean;
}

export function scorta(name: string, opts: { tmpdir: true } & Partial<Options>): string;
export function scorta(name: string, opts?: Partial<Options>): string | void;
