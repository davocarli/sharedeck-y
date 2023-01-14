import {
	PanelSection,
	PanelSectionRow,
	SliderField,
	ToggleField,
} from "decky-frontend-lib"
import { useState } from "react"
import { PluginSettings } from "../context"
import { getSettings } from "../requests"

const SettingsPage = () => {
	const [currentSettings, setCurrentSettings] = useState(() => getSettings())

	const updateSetting = (label: keyof PluginSettings, value: any) => {
		currentSettings[label] = value
		window.localStorage.setItem(
			"sharedecky-settings",
			JSON.stringify(currentSettings)
		)
		setCurrentSettings(Object.assign({}, currentSettings))
	}

	return (
		<PanelSection title="Settings">
			<PanelSectionRow>
				<ToggleField
					checked={currentSettings.showShareDeckToasts}
					label="Show ShareDeck Notifications"
					description="Send a notification when opening a game if ShareDeck reports are available."
					onChange={(n) => updateSetting("showShareDeckToasts", n)}
				/>
			</PanelSectionRow>
			<PanelSectionRow>
				<ToggleField
					checked={currentSettings.showSDHQToasts}
					label="Show SteamDeckHQ Notifications"
					description="Send a notification when opening a game if SteamDeckHQ has performance-reviewed the game."
					onChange={(n) => updateSetting("showSDHQToasts", n)}
				/>
			</PanelSectionRow>
			<PanelSectionRow>
				<ToggleField
					checked={!currentSettings.showAlways}
					label="Only Show on First Open"
					description="If enabled, you will only receive notifications the first time you open a game."
					onChange={(n) => updateSetting("showAlways", !n)}
				/>
			</PanelSectionRow>
		</PanelSection>
	)

	return <div />
}

export default SettingsPage
