import { useModel } from '@/models';
import {
	DestinyComponentType,
	type DestinyProfileResponse,
} from 'bungie-api-ts/destiny2';
import { defineStore } from 'pinia';
import { computed, reactive, unref, watch } from 'vue';
import { useAccountStore } from '..';

// TODO: figure this out
export default defineStore('characters', () => {
	const characters: DestinyProfileResponse[] = reactive([]);

	const { data: rawProfileData, error } = useAccountStore();

	watch(rawProfileData, (newData): void => {
		console.log('new profile data', newData);
		characters.length = 0;
		for (const { membershipId, originalPlatformType } of newData) {
			const { data } = useModel(
				{ key: 'get_profile' },
				{
					membershipId,
					membershipPlatform: originalPlatformType,
					componentType: [DestinyComponentType.Characters],
				}
			);

			watch(data, (newProfileData) => characters.push(newProfileData!));
		}
	});

	return { data: characters, error };
});
