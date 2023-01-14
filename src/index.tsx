import {
	definePlugin,
	Router,
	ServerAPI,
	staticClasses,
} from "decky-frontend-lib"
import { useContext } from "react"
import { FaCogs } from "react-icons/fa"
import { ShareDeckContext, ShareDeckProvider } from "./context"
import GamePicker from "./pages/gamePicker"
import GameReports from "./pages/reportViewer"
import SettingsPage from "./pages/settings"
import sdhqlogo from "../assets/sdhqlogo.jpg"
import sharedecklogo from "../assets/sharedecklogo.png"
import {
	getReports,
	getSDHQReview,
	getSettings,
	getToastedGames,
} from "./requests"

const ShareDecky = ({ serverApi }: { serverApi: ServerAPI }) => {
	const { selectedGame, showSettings } = useContext(ShareDeckContext)

	if (showSettings) return <SettingsPage />

	if (selectedGame === null) return <GamePicker />

	return <GameReports serverApi={serverApi} />
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
					if (reports.length > 0)
						serverApi.toaster.toast({
							title: "Settings Reports Available",
							body: "There are ShareDeck settings reports for this game!",
							playSound: true,
							logo: <img src={sharedecklogo} />,
						})
				})

			if (userSettings.showSDHQToasts)
				getSDHQReview(strAppId, serverApi, ["none"]).then((review) => {
					if (review !== null)
						serverApi.toaster.toast({
							title: "SDHQ Review Available",
							body: "SteamDeckHQ has done a performance review of this game!",
							playSound: true,
							logo: <img width="64" height="64" src={sdhqlogo} />,
						})
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
