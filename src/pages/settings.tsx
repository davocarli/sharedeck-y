import {
	ButtonItem,
	PanelSection,
	PanelSectionRow,
	ToggleField,
} from "decky-frontend-lib"
import React, { useContext, useState } from "react"

import BackButton from "../components/backButton"
import { PluginSettings, ShareDeckContext } from "../context"
import { getSettings, sendSDHQToast, sendShareDeckToast } from "../requests"

const SettingsPage = () => {
	const [currentSettings, setCurrentSettings] = useState(() => getSettings())
	const { serverApi, setShowSettings } = useContext(ShareDeckContext)

	const updateSetting = (label: keyof PluginSettings, value: any) => {
		currentSettings[label] = value
		window.localStorage.setItem(
			"sharedecky-settings",
			JSON.stringify(currentSettings)
		)
		setCurrentSettings(Object.assign({}, currentSettings))
	}

	const sendToasts = () => {
		if (!serverApi) return
		if (currentSettings.showShareDeckToasts) sendShareDeckToast(serverApi)
		if (currentSettings.showSDHQToasts) sendSDHQToast(serverApi)
	}

	return (
		<React.Fragment>
			<BackButton onClick={() => setShowSettings(false)} />

			<PanelSection title="Settings">
				<PanelSectionRow>
					<ToggleField
						checked={currentSettings.showAllApps}
						label="Show Entire Library in Games List"
						description="If enabled, all Steam games in your library will be shown in the Games List. If disabled, only installed games will be shown."
						onChange={(n) => updateSetting("showAllApps", n)}
					/>
				</PanelSectionRow>
				<PanelSectionRow>
					<ToggleField
						checked={currentSettings.showShareDeckToasts}
						label="Show ShareDeck Notifications"
						description="Send a notification when opening a game if ShareDeck reports are available."
						onChange={(n) =>
							updateSetting("showShareDeckToasts", n)
						}
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
				{serverApi ? (
					<PanelSectionRow>
						<ButtonItem layout="below" onClick={() => sendToasts()}>
							Test Notifications
						</ButtonItem>
					</PanelSectionRow>
				) : null}
			</PanelSection>
		</React.Fragment>
	)
}

export default SettingsPage
