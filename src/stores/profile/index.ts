import { defineStore } from "pinia";
import { useAccountStore } from "..";

export default defineStore('profile', () => {
	const account = useAccountStore();
})