import { defineStore } from "pinia";
import { watch } from "vue";
import { useAccountStore } from "..";

export default defineStore('profile', () => {
	const account = useAccountStore();
})