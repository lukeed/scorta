export interface Options {
	cwd: string;
	tmpdir: boolean;
}

export function scorta(name: string, opts: { tmpdir: true } & Partial<Options>): Promise<string>;
export function scorta(name: string, opts?: Partial<Options>): Promise<string | void>;
