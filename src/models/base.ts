export abstract class Base<T> {
	public constructor(protected _data: T) {}

	public get raw(): T {
		return this._data;
	}
}

export interface IconURL {
	iconURL(): URL;
}
