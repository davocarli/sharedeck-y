export const SHAREDECK_REPORT_ENDPOINT =
	"https://sharedeck.games/api/experimental/reports?app_id=${appid}"
export const SDHQ_REPORT_ENDPOINT =
	"https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?meta_key=steam_app_id&meta_value=${appid}&_fields=acf.optimized_and_recommended_settings.steamos_settings,link,acf.optimized_and_recommended_settings.proton_version,acf.optimized_and_recommended_settings.game_settings,acf.optimized_and_recommended_settings.projected_battery_usage_and_temperature,acf.sdhq_rating,excerpt.rendered"

export const SHAREDECK_NEW_REPORT_URL =
	"https://sharedeck.games/apps/${appid}/reports/new"
export const ignoreSteam = [
	1887720, // Proton 7.0
	1493710, // Proton Experimental
	1070560, // Steam Linux Runtime
	1391110, // Steam Linux Runtime - Soldier
	228980, // Steamworks Common Redistributables
]
export const ignoreNonSteam = [
	"EmulationStation-DE-x64_SteamDeck",
	"Google Chrome",
	"Cemu",
	"Citra",
	"Dolphin (emulator)",
	"DuckStation (Emulator)",
	"PCSX2",
	"PPSSPP",
	"PrimeHack",
	"RetroArch",
	"RPCS3",
	"xemu (emulator)",
	"Yuzu",
	"Moonlight",
	"pcsx2-qt",
	"Ryujinx",
	"ScummVM",
	"Vita3K",
	"Chiaki",
	"Heroic Games Launcher",
	"MAME",
]
