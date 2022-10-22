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
import type { Nullable } from '@/utils/types';
import useSWRV from 'swrv';
import type { IResponse } from 'swrv/dist/types';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';

interface BaseTypes {
	get_current_user: GeneralUser;
	get_bungie_applications: Application[];
	get_linked_profiles: DestinyLinkedProfilesResponse;
}

const internalFetch = async <K extends keyof BaseTypes>(
	key: K
): Promise<Nullable<BaseTypes[K]>> => {
	const token = await getActiveToken();

	if (!token) return null;

	let data: unknown = null;
	try {
		data = await invoke(key, { token });
	} catch (e) {
		await error(e as string);
		throw e;
	}

	if (data === null) return null;

	switch (key) {
		case 'get_bungie_applications':
			return (data as RawApplication[]).map(
				(raw): Application => new Application(raw)
			) as unknown as BaseTypes[K];
		case 'get_current_user':
			return new GeneralUser(
				data as RawGeneralUser
			) as unknown as BaseTypes[K];
		case 'get_linked_profiles':
			return new DestinyLinkedProfilesResponse(
				data as RawDestinyLinkedProfilesResponse
			) as unknown as BaseTypes[K];
		default:
			throw new Error(`Unexpected key ${key}`);
	}
};

export const useModel = <K extends keyof BaseTypes>(
	key: K
): IResponse<BaseTypes[K]> =>
	useSWRV<BaseTypes[K]>(key, internalFetch, {
		shouldRetryOnError: false,
		cache: new LocalStorageCache(`im-${key}`),
	});

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
