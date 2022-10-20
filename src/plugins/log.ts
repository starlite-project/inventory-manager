import { invoke } from '@tauri-apps/api/tauri';
import { type Event, listen, type UnlistenFn } from '@tauri-apps/api/event';

enum LogLevel {
	Trace = 1,
	Debug,
	Info,
	Warn,
	Error,
}

const log = async (level: LogLevel, message: string): Promise<void> => {
	const traces = new Error().stack
		?.split('\n')
		.map((line): string[] => line.split('@'));

	const filtered = traces?.filter(
		([name, location]): boolean =>
			!!name.length && location !== '[native code]'
	);

	await invoke('plugin:log|log', {
		level,
		message,
		location: filtered?.[0]?.join('@'),
	});
};

export const error = async (message: string): Promise<void> => {
	await log(LogLevel.Error, message);
};

export const warn = async (message: string): Promise<void> => {
	await log(LogLevel.Warn, message);
};

export const info = async (message: string): Promise<void> => {
	await log(LogLevel.Info, message);
};

export const debug = async (message: string): Promise<void> => {
	await log(LogLevel.Debug, message);
};

export const trace = async (message: string): Promise<void> => {
	await log(LogLevel.Trace, message);
};

interface RecordPayload {
	level: LogLevel;
	message: string;
}

export const attachConsole = (): Promise<UnlistenFn> =>
	listen('log://log', (event: Event<RecordPayload>) => {
		const payload = event.payload;

		switch (payload.level) {
			case LogLevel.Trace:
				console.log(payload.message);
				break;
			case LogLevel.Debug:
				console.debug(payload.message);
				break;
			case LogLevel.Info:
				console.info(payload.message);
				break;
			case LogLevel.Warn:
				console.warn(payload.message);
				break;
			case LogLevel.Error:
				console.error(payload.message);
				break;
			default:
				throw new Error(`unknown log level ${payload.level}`);
		}
	});
