export const API_BASE: URL = new URL('https://www.bungie.net/');

export const makeBungieURL = (path: string): URL => new URL(path, API_BASE);
