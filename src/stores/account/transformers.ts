import type { BungieMembershipType, PlatformErrorCodes } from 'bungie-api-ts/common';
import type {
	DestinyGameVersions,
	DestinyLinkedProfilesResponse,
	DestinyProfileUserInfoCard,
} from 'bungie-api-ts/destiny2';
import type { UserInfoCard } from 'bungie-api-ts/user';
import { Content } from 'bungie-api-ts';

const { BungieMembershipType: InternalBungieMembershipType, PlatformErrorCodes: InternalErrorCodes } = Content;

type DestinyVersion = 1 | 2;

const PLATFORM_LABELS = {
	[InternalBungieMembershipType.TigerXbox]: 'Xbox',
	[InternalBungieMembershipType.TigerPsn]: 'PlayStation',
	[InternalBungieMembershipType.TigerBlizzard]: 'Blizzard',
	[InternalBungieMembershipType.TigerDemon]: 'Demon',
	[InternalBungieMembershipType.TigerSteam]: 'Steam',
	[InternalBungieMembershipType.TigerStadia]: 'Stadia',
	[InternalBungieMembershipType.TigerEgs]: 'Epic',
	[InternalBungieMembershipType.BungieNext]: 'Bungie.net',
	[InternalBungieMembershipType.None]: 'None',
	[InternalBungieMembershipType.All]: 'All',
};

export interface DestinyAccount {
	readonly displayName: string;
	readonly originalPlatformType: BungieMembershipType;
	readonly platformLabel: string;
	readonly membershipId: string;
	readonly destinyVersion: DestinyVersion;
	readonly versionsOwned?: DestinyGameVersions;
	readonly platforms: BungieMembershipType[];
	readonly lastPlayed?: Date;
}

const formatBungieName = (
	destinyAccount: DestinyProfileUserInfoCard | UserInfoCard
): string =>
	destinyAccount.bungieGlobalDisplayName +
	(destinyAccount.bungieGlobalDisplayNameCode
		? `#${destinyAccount.bungieGlobalDisplayNameCode
			.toString()
			.padStart(4, '0')}`
		: '');

export const generatePlatforms = (
	accounts: DestinyLinkedProfilesResponse
): DestinyAccount[] => {
	const destinyAccounts = accounts.profiles
		.flatMap((destinyAccount) => {
			const account: DestinyAccount = {
				displayName: formatBungieName(destinyAccount),
				originalPlatformType: destinyAccount.membershipType,
				membershipId: destinyAccount.membershipId,
				platformLabel: PLATFORM_LABELS[destinyAccount.membershipType],
				destinyVersion: 2,
				platforms: destinyAccount.applicableMembershipTypes,
				lastPlayed: new Date(destinyAccount.dateLastPlayed),
			};

			if (destinyAccount.isOverridden) {
				// Ignore overridden accounts
				return [];
			}

			return [account];
		})
		.concat(
			accounts.profilesWithErrors.flatMap((errorProfile) => {
				const destinyAccount = errorProfile.infoCard;
				const account: DestinyAccount = {
					displayName: formatBungieName(destinyAccount),
					originalPlatformType: destinyAccount.membershipType,
					membershipId: destinyAccount.membershipId,
					platformLabel:
						PLATFORM_LABELS[destinyAccount.membershipType],
					destinyVersion: 1,
					platforms: [destinyAccount.membershipType],
					lastPlayed: new Date(),
				};

				if (
					[
						InternalErrorCodes.DestinyAccountNotFound,
						InternalErrorCodes.DestinyLegacyPlatformInaccessible,
					].includes(errorProfile.errorCode)
				) {
					return [];
				} else {
					return [account];
				}
			})
		);

	return destinyAccounts;
};
