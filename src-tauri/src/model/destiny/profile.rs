use serde::{Deserialize, Serialize};

use crate::{
	model::{user::UserInfoCard, util::BungieMembershipType, IconUrl},
	util::API_BASE,
};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DestinyProfileUserInfoCard {
	pub is_overridden: bool,
	pub is_cross_save_primary: bool,
	pub supplemental_display_name: Option<String>,
	pub icon_path: Option<String>,
	pub cross_save_override: i32,
	pub applicable_membership_types: Vec<BungieMembershipType>,
	pub is_public: bool,
	pub membership_type: BungieMembershipType,
	#[serde(with = "crate::util::values_as_strings")]
	pub membership_id: i64,
	pub display_name: String,
	pub bungie_global_display_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DestinyLinkedProfilesResponse {
	pub profiles: Vec<DestinyProfileUserInfoCard>,
	// TODO: fix the deser errors
	// pub bnet_membership: UserInfoCard,
}
