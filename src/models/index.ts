import {
	type AuthTokens,
	getToken,
	removeToken,
	hasTokenExpired,
	setToken,
} from '@/utils/token';
import { invoke } from '@tauri-apps/api';
import { error } from '@/plugins';
import { Application, type RawApplication } from './application';
import {
	DestinyLinkedProfilesResponse,
	type RawDestinyLinkedProfilesResponse,
} from './destiny2';
import { GeneralUser, type RawGeneralUser } from './user';

/* eslint-disable prefer-arrow-functions/prefer-arrow-functions */
export function fetch(
	key: 'get_bungie_applications'
): Promise<Array<Application> | null>;
export function fetch(key: 'get_current_user'): Promise<GeneralUser | null>;
export function fetch(
	key: 'get_linked_profiles'
): Promise<DestinyLinkedProfilesResponse | null>;
export async function fetch(key: string): Promise<unknown> {
	const token = await getActiveToken();

	if (!token) {
		return null;
	}

	let data: unknown = null;
	try {
		data = await invoke(key, { token });
	} catch (e) {
		await error(e as string);
		throw e;
	}

	if (data === null) {
		return null;
	}

	switch (key) {
		case 'get_bungie_application':
			return (data as RawApplication[]).map(
				(raw): Application => new Application(raw)
			);
		case 'get_current_user':
			return new GeneralUser(data as RawGeneralUser);
		case 'get_linked_profiles':
			return new DestinyLinkedProfilesResponse(
				data as RawDestinyLinkedProfilesResponse
			);
		default:
			throw new Error(`Unexpected key ${key}`);
	}
}
/* eslint-enable prefer-arrow-functions/prefer-arrow-functions */

const getActiveToken = async (): Promise<AuthTokens> => {
	const token = getToken();

	if (!token) {
		removeToken();
		throw new FatalTokenError('No auth token, redirect to login');
	}

	const accessTokenIsValid = token && !hasTokenExpired(token.accessToken);
	if (accessTokenIsValid) {
		return token;
	}

	const refreshTokenIsValid = token && !hasTokenExpired(token.refreshToken);
	if (!refreshTokenIsValid) {
		removeToken();
		throw new FatalTokenError(
			'Refresh token invalid, clearing auth tokens and going to login'
		);
	}

	let newToken: AuthTokens | null = null;
	try {
		newToken = await invoke('refresh_token', { token });
		setToken(newToken!);
		return getToken()!;
	} catch (e) {
		await error(e as string);
		throw new FatalTokenError('failed to fetch token');
	}
};

export class FatalTokenError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'FatalTokenError';
	}
}
