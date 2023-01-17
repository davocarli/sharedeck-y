import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib"
import { useContext, useEffect } from "react"
import { FaCogs } from "react-icons/fa"
import { ShareDeckContext, ShareDeckProvider } from "./context"
import GamePicker from "./pages/gamePicker"
import GameReports from "./pages/reportViewer"
import SettingsPage from "./pages/settings"
import {
	getReports,
	getSDHQReview,
	getSettings,
	getToastedGames,
	sendSDHQToast,
	sendShareDeckToast,
} from "./requests"
//@ts-ignore
if (window.DeckyPluginLoader?.hasPlugin("ShareDeck-y"))
	//@ts-ignore
	window.DeckyPluginLoader?.unloadPlugin("ShareDeck-y")

const ShareDecky = ({ serverApi }: { serverApi: ServerAPI }) => {
	// removePlugin("ShareDeck-y")

	const { selectedGame, showSettings, setServerApi } =
		useContext(ShareDeckContext)

	useEffect(() => {
		setServerApi(serverApi)
	})

	if (showSettings) return <SettingsPage />

	if (selectedGame === null) return <GamePicker />

	return <GameReports />
}

export default definePlugin((serverApi: ServerAPI) => {
	const onGameChange =
		SteamClient.GameSessions.RegisterForAppLifetimeNotifications(
			// Using GameSessions.Register... because Apps.RegisterForGameActionStart
			// runs immediately upon hitting play, but toasts won't play sounds at that time.
			(appState) => {
				if (!appState.bRunning) return
				// Get settings
				const userSettings = getSettings()

				const appId = appState.unAppID

				// Handle repeat toasts
				if (!userSettings.showAlways) {
					let toastedGames = getToastedGames()
					if (toastedGames.includes(appId)) return

					toastedGames.push(appId)
					window.localStorage.setItem(
						"sharedecky-toasted-games",
						JSON.stringify(toastedGames)
					)
				}

				// Send toasts
				if (userSettings.showShareDeckToasts)
					getReports(appId, serverApi).then((reports) => {
						if (reports.length > 0) sendShareDeckToast(serverApi)
					})

				if (userSettings.showSDHQToasts)
					getSDHQReview(appId, serverApi, ["none"]).then((review) => {
						if (review !== null) sendSDHQToast(serverApi)
					})
			}
		)

	return {
		title: <div className={staticClasses.Title}>DeckSettings</div>,
		content: (
			<ShareDeckProvider>
				<ShareDecky serverApi={serverApi} />
			</ShareDeckProvider>
		),
		icon: <FaCogs />,
		alwaysRender: true,
		onDismount() {
			onGameChange.unregister()
		},
	}
})
