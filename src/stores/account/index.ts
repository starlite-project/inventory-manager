import { defineStore } from 'pinia';
import { type DestinyAccount, generateDestinyAccounts } from './transformers';
import { useModel } from '../../models';
import { reactive, ref, watch } from 'vue';
import { useLoginStore } from '..';

export default defineStore('account', () => {
	const loginStore = useLoginStore();

	if (!loginStore.isLoggedIn)
		return { error: ref('Not logged in'), data: reactive([]) };

	const { data: rawData, error } = useModel('get_linked_profiles');
	const accounts: DestinyAccount[] = reactive([]);

	watch(rawData, (newData): void => {
		accounts.length = 0;
		accounts.push(...generateDestinyAccounts(newData!));
	});

	return { data: accounts, error };
});
