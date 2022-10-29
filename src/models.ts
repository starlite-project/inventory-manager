import {
	type AuthTokens,
	getToken,
	removeToken,
	hasTokenExpired,
	setToken,
} from './utils/token';
import { invoke } from '@tauri-apps/api';
import { error } from './plugins';
import type { Nullable } from './utils/types';
import type { InvokeArgs } from '@tauri-apps/api/tauri';
import type {
	DestinyLinkedProfilesResponse,
	DestinyProfileResponse,
} from 'bungie-api-ts/destiny2';
import type { GeneralUser } from 'bungie-api-ts/user';
import type { Application } from 'bungie-api-ts/app';

interface BaseTypes {
	get_current_user: GeneralUser;
	get_bungie_applications: Application[];
	get_linked_profiles: DestinyLinkedProfilesResponse;
	get_profile: DestinyProfileResponse;
}

interface ModelFetch {
	<K extends keyof BaseTypes>(
		key: K,
		args?: Omit<InvokeArgs, 'token'>
	): Promise<Nullable<BaseTypes[K]>>;
}

export const fetch: ModelFetch = async <K extends keyof BaseTypes>(
	key: K,
	args?: Omit<InvokeArgs, 'token'>
): Promise<Nullable<BaseTypes[K]>> => {
	const token = await getActiveToken();

	if (!token) return null;

	try {
		const data = await invoke<BaseTypes[K]>(key, { token, ...args });
		return data;
	} catch (e) {
		await error(e as string);
		throw e;
	}
};

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
