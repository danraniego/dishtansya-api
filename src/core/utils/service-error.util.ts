import { logger } from "./logger.util";

export interface IServiceError {
	file?: string;
	method?: string;
	code: number;
	error?: Error | string | unknown;
}

export class ServiceError extends Error {

	public readonly file?: string;
	public readonly method?: string;
	public readonly code: number;
	public readonly error?: Error | string | unknown;

	constructor({ file, method, code, error, }: IServiceError) { 
		super(typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error)); 
		this.file = file; 
		this.method = method; 
		this.code = code;
		this.error = error; 

		Object.setPrototypeOf(this, ServiceError.prototype);

		logger.warn(`${code} - ${this.toString()}`);

		return this;
	}

	toString() {
		const message = typeof this.error === 'string' ? this.error : this.error instanceof Error ? this.error.message : JSON.stringify(this.error);
		return `${this.file ?? 'Unknown file'}.${this.method ?? 'Unknown method'}: ${message}`;
	}

	toJSON(): IServiceError { 
		return { 
			file: this.file, 
			method: this.method, 
			code: this.code,
			error: this.error, 
		} as IServiceError; 
	}
}
