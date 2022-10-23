use serde::{Serialize, Deserialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct BungieResponse {
	pub response: Value,
	pub error_code: i32,
	pub throttle_seconds: f32,
	pub error_status: String,
	pub message: String,
	pub message_data: std::collections::HashMap<String, String>,
	pub detailed_error_trace: Option<String>,
}
