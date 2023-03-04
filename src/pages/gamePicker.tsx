import {
	ButtonItem,
	PanelSection,
	PanelSectionRow,
	Router,
} from "decky-frontend-lib"
import { useContext, useEffect, useState } from "react"

import LoadingPanel from "../components/loadingPanel"
import { ignoreSteam } from "../constants"
import { GameInfo, ShareDeckContext } from "../context"
import { getSettings } from "../requests"

const getInstalledGames = async () =>
	SteamClient.InstallFolder.GetInstallFolders().then((installFolders) => {
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
		games.sort((a, b) => (a.sortAs > b.sortAs ? 1 : -1))
		return { games, runningGame }
	})

const getAllGames = async () => {
	const { collectionStore }: { collectionStore: CollectionStore } =
		window as any
	const games: Required<GameInfo>[] = []
	const currentRunningGame = Router.MainRunningApp

	let runningGame: GameInfo | undefined = undefined

	collectionStore.allGamesCollection.allApps.forEach((app) => {
		if (!ignoreSteam.includes(app.appid)) {
			if (
				!runningGame &&
				currentRunningGame?.appid == app.appid.toString()
			)
				runningGame = {
					title: app.display_name,
					appId: app.appid,
				}
			games.push({
				title: app.display_name,
				appId: app.appid,
				sortAs: app.sort_as,
			})
		}
	})

	games.sort((a, b) => (a.sortAs > b.sortAs ? 1 : -1))
	return { games, runningGame }
}

const useGamePicker = () => {
	const { setSelectedGame, setShowSettings } = useContext(ShareDeckContext)
	const [runningGame, setRunningGame] = useState<GameInfo>()
	const [games, setGames] = useState<GameInfo[]>()
	const [userSettings] = useState(getSettings())

	useEffect(() => {
		const userSettings = getSettings()

		if (userSettings.showAllApps)
			getAllGames().then(({ games, runningGame }) => {
				setGames(games)
				setRunningGame(runningGame)
			})
		else
			getInstalledGames().then(({ games, runningGame }) => {
				setGames(games)
				setRunningGame(runningGame)
			})
	}, [])

	return {
		runningGame,
		games,
		setSelectedGame,
		setShowSettings,
		userSettings,
	}
}

const GamePicker = () => {
	const {
		runningGame,
		games,
		setShowSettings,
		setSelectedGame,
		userSettings,
	} = useGamePicker()

	if (!games) return <LoadingPanel />

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
			<PanelSection
				title={
					userSettings.showAllApps ? "All Games" : "Installed Games"
				}
			>
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
