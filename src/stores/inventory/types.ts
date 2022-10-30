import type { DestinyClass, DestinyColor } from 'bungie-api-ts/destiny2';
import type { DestinyVersion } from '../account/types';

export interface Inventory<Item = null> {
	id: string;
	name: string;
	isVault: boolean;
	destinyVersion: DestinyVersion;
	classType: DestinyClass;
	className: string;
	gender: string;
	race: string;
	genderRace: string;
	genderName: 'male' | 'female' | '';
	items: readonly Item[];
	icon: string;
	current: boolean;
	lastPlayed: Date;
	background: string;
	color?: DestinyColor;
	level: number;
	percentToNextLevel: number;
	powerLevel: number;
}

export interface Title {
	title: string;
	gildedNum: number;
	isGildedForCurrentSeason: boolean;
}

export interface InventoryItem {
	index: string;
	id: string;
	hash: number;
	instanced: boolean;
	classified: boolean;
}