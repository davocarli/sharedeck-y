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

const ShareDecky = ({ serverApi }: { serverApi: ServerAPI }) => {
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
	const onGameActionStart = SteamClient.Apps.RegisterForGameActionStart(
		(_, strAppId, __) => {
			// Get settings
			const userSettings = getSettings()

			// Handle repeat toasts
			if (!userSettings.showAlways) {
				let toastedGames = getToastedGames()
				if (toastedGames.includes(strAppId)) return

				toastedGames.push(strAppId)
				window.localStorage.setItem(
					"sharedecky-toasted-games",
					JSON.stringify(toastedGames)
				)
			}

			// Send toasts
			if (userSettings.showShareDeckToasts)
				getReports(strAppId, serverApi).then((reports) => {
					if (reports.length > 0) sendShareDeckToast(serverApi)
				})

			if (userSettings.showSDHQToasts)
				getSDHQReview(strAppId, serverApi, ["none"]).then((review) => {
					if (review !== null) sendSDHQToast(serverApi)
				})
		}
	)

	return {
		title: <div className={staticClasses.Title}>ShareDeck-y</div>,
		content: (
			<ShareDeckProvider>
				<ShareDecky serverApi={serverApi} />
			</ShareDeckProvider>
		),
		icon: <FaCogs />,
		alwaysRender: true,
		onDismount() {
			onGameActionStart.unregister()
		},
	}
})
