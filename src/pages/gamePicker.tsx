import { useContext, useEffect, useState } from "react"
import { ShareDeckContext, GameInfo } from "../context"
import {
	ButtonItem,
	PanelSection,
	PanelSectionRow,
	Router,
} from "decky-frontend-lib"
import { ignoreSteam, ignoreNonSteam } from "../constants"
import LoadingPanel from "../components/loadingPanel"

const GamePicker = () => {
	const { setSelectedGame, setShowSettings } = useContext(ShareDeckContext)
	const [runningGame, setRunningGame] = useState<GameInfo | null>(null)
	const [games, setGames] = useState<GameInfo[] | null>(null)

	// This useEffect hook for retrieving games is borrowed from DeckFAQs
	useEffect(() => {
		const getGames = async (): Promise<{
			games: GameInfo[]
			runningGame?: GameInfo
		}> => {
			// Steam Games
			const installFolders =
				await SteamClient.InstallFolder.GetInstallFolders()
			const games: Required<GameInfo>[] = []
			const currentRunningGame = Router.MainRunningApp
			let runningGame: GameInfo | undefined = undefined
			installFolders.forEach((folder) => {
				folder.vecApps.forEach((app) => {
					if (!ignoreSteam.includes(app.nAppID)) {
						if (
							!runningGame &&
							currentRunningGame?.appid == app.nAppID.toString()
						)
							runningGame = {
								title: app.strAppName,
								appId: app.nAppID,
							}
						games.push({
							title: app.strAppName,
							appId: app.nAppID,
							sortAs: app.strSortAs,
						})
					}
				})
			})

			// Commenting out Non-Steam Games for the time being, since they are not
			// supported by ShareDeck.

			// // Non-Steam Games
			// const shortcuts = await SteamClient.Apps.GetAllShortcuts()
			// shortcuts.forEach(({ data: { strSortAs, strAppName } }) => {
			// 	if (!ignoreNonSteam.includes(strAppName)) {
			// 		if (
			// 			!runningGame &&
			// 			currentRunningGame?.display_name == strAppName
			// 		)
			// 			runningGame = {
			// 				title: currentRunningGame?.display_name,
			// 			}
			// 		games.push({ title: strAppName, sortAs: strSortAs })
			// 	}
			// })
			// const apps = games.map((o) => o.title)
			// const unique = games.filter(
			// 	({ appName }, index) => !apps.includes(appName, index + 1)
			// )

			// Sort games list
			games.sort((a, b) => (a.sortAs > b.sortAs ? 1 : -1))

			return {
				games,
				runningGame,
			}
		}

		getGames().then(({ games, runningGame }) => {
			setGames(games)
			setRunningGame(runningGame || null)
		})
	}, [])

	if (games === null) return <LoadingPanel />

	return (
		<div>
			<PanelSection>
				<PanelSectionRow>
					<ButtonItem
						layout="below"
						onClick={() => setShowSettings(true)}
					>
						Go To Settings
					</ButtonItem>
				</PanelSectionRow>
			</PanelSection>
			{runningGame ? (
				<PanelSection title="Current Game">
					<PanelSectionRow>
						<ButtonItem
							layout="below"
							onClick={() => setSelectedGame(runningGame)}
						>
							{runningGame.title}
						</ButtonItem>
					</PanelSectionRow>
				</PanelSection>
			) : null}
			<PanelSection title="Installed Games">
				{games.map((game) => (
					<PanelSectionRow key={`${game.appId}${game.title}`}>
						<ButtonItem
							layout="below"
							onClick={() => setSelectedGame(game)}
						>
							{game.title}
						</ButtonItem>
					</PanelSectionRow>
				))}
			</PanelSection>
		</div>
	)
}

export default GamePicker
