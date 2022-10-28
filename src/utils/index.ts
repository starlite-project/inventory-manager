import { watch, WatchOptions } from 'vue';

export const API_BASE: URL = new URL('https://www.bungie.net/');

export const makeBungieURL = (path: string): URL => new URL(path, API_BASE);

export const waitForChange = <T>(watcher): Promise<T> =>
	new Promise<T>((resolve) => {
		watch(watcher, (newData): void => resolve(newData));
	});
