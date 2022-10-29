use std::fmt::{Display, Formatter, Result as FmtResult};

use tauri::{
	AppHandle, CustomMenuItem, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
	SystemTrayMenuItem, Manager,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum TrayItem {
	Quit,
	Hide,
}

impl TrayItem {
	const fn id(self) -> &'static str {
		match self {
			Self::Quit => "quit",
			Self::Hide => "hide",
		}
	}

	const fn title(self) -> &'static str {
		match self {
			Self::Quit => "Quit",
			Self::Hide => "Hide",
		}
	}
}

impl From<TrayItem> for CustomMenuItem {
	fn from(item: TrayItem) -> Self {
		Self::new(item.id(), item.title())
	}
}

impl TryFrom<String> for TrayItem {
	type Error = ConversionError;

	fn try_from(value: String) -> Result<Self, Self::Error> {
		match value.as_str() {
			"quit" => Ok(Self::Quit),
			"hide" => Ok(Self::Hide),
			_ => Err(ConversionError),
		}
	}
}

#[derive(Debug)]
struct ConversionError;

impl Display for ConversionError {
	fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
		f.write_str("invalid tray item id was given")
	}
}

pub fn setup_tray() -> SystemTray {
	let quit: CustomMenuItem = TrayItem::Quit.into();
	let hide: CustomMenuItem = TrayItem::Hide.into();

	let tray_menu = SystemTrayMenu::new()
		.add_item(quit)
		.add_native_item(SystemTrayMenuItem::Separator)
		.add_item(hide);

	SystemTray::new().with_menu(tray_menu)
}

pub fn handle_system_tray_event<R: Runtime>(app: &AppHandle<R>, event: SystemTrayEvent) {
	match event {
		SystemTrayEvent::LeftClick { .. } => {
			println!("system tray received a left click");
		}
		SystemTrayEvent::RightClick { .. } => {
			println!("system tray received a right click");
		}
		SystemTrayEvent::DoubleClick { .. } => {
			println!("system tray received a double click");
		}
		SystemTrayEvent::MenuItemClick { id, .. } => match id.try_into().unwrap() {
			TrayItem::Quit => {
				std::process::exit(0);
			}
			TrayItem::Hide => {
				let window = app.get_window("main").unwrap();
				window.hide().unwrap();
			}
		},
		_ => {}
	}
}
