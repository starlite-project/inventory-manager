import { Content } from 'bungie-api-ts';
import type {
	BungieMembershipType,
	DestinyLinkedProfilesResponse,
	DestinyProfileUserInfoCard,
} from 'bungie-api-ts/destiny2';
import type { UserInfoCard } from 'bungie-api-ts/user';

const { BungieMembershipType: InternalMembershipType } = Content;

type DestinyVersion = 1 | 2;

export interface DestinyAccount {
	readonly displayName: string;
	readonly originalPlatformType: BungieMembershipType;
	readonly platformLabel: string;
	readonly membershipId: string;
	readonly destinyVersion: DestinyVersion;
	readonly platforms: BungieMembershipType[];
	readonly lastPlayed: Date;
}

const PLATFORM_LABELS = {
	[InternalMembershipType.TigerXbox]: 'Xbox',
	[InternalMembershipType.TigerPsn]: 'PlayStation',
	[InternalMembershipType.TigerBlizzard]: 'Blizzard',
	[InternalMembershipType.TigerDemon]: 'Demon',
	[InternalMembershipType.TigerSteam]: 'Steam',
	[InternalMembershipType.TigerStadia]: 'Stadia',
	[InternalMembershipType.TigerEgs]: 'Epic',
	[InternalMembershipType.BungieNext]: 'Bungie.net',
	[InternalMembershipType.None]: 'None',
	[InternalMembershipType.All]: 'All',
};

export const generateDestinyAccounts = (
	response: DestinyLinkedProfilesResponse
): DestinyAccount[] =>
	response.profiles.flatMap((destinyAccount) => {
		const account: DestinyAccount = {
			displayName: formatBungieName(destinyAccount),
			originalPlatformType: destinyAccount.membershipType,
			membershipId: destinyAccount.membershipId,
			platformLabel: PLATFORM_LABELS[destinyAccount.membershipType],
			destinyVersion: 2,
			platforms: destinyAccount.applicableMembershipTypes,
			lastPlayed: new Date(destinyAccount.dateLastPlayed),
		};

		if (destinyAccount.isOverridden) return [];
		else return [account];
	});

const formatBungieName = (
	destinyAccount: DestinyProfileUserInfoCard | UserInfoCard
): string =>
	destinyAccount.bungieGlobalDisplayName +
	(destinyAccount.bungieGlobalDisplayNameCode
		? `#${destinyAccount.bungieGlobalDisplayNameCode
				.toString()
				.padStart(4, '0')}`
		: '');
