import {
	ButtonItem,
	PanelSection,
	PanelSectionRow,
	Router,
	ServerAPI,
} from "decky-frontend-lib"
import { useContext, useEffect, useState } from "react"
import LoadingPanel from "../components/loadingPanel"
import { Report, ReportInterface } from "../context"
import { ShareDeckContext } from "../context"
import {
	SHAREDECK_NEW_REPORT_URL,
	SHAREDECK_REPORT_ENDPOINT,
} from "../constants"
import { ReportElement } from "./reportElement"
import BackButton from "../components/backButton"
import { Scrollable, ScrollArea, scrollableRef } from "../components/Scrollable"

const getReports = async (appId: number, serverApi: ServerAPI) => {
	const url = SHAREDECK_REPORT_ENDPOINT.replaceAll("${appid}", `${appId}`)
	const res = await serverApi.fetchNoCors<{ body: string }>(url, {
		method: "GET",
	})

	if (res.success) {
		const reports = JSON.parse(res.result.body) as ReportInterface[]
		return reports.map((reportData) => new Report(reportData))
	} else {
		return []
	}
}

const GameReports = ({ serverApi }: { serverApi: ServerAPI }) => {
	const { selectedGame, setSelectedGame } = useContext(ShareDeckContext)
	const [isLoading, setLoading] = useState(true)
	const [reports, setReports] = useState<Report[]>([])
	const [selectedReport, setSelectedReport] = useState<Report | null>(null)
	const ref = scrollableRef()

	const openWeb = (url: string) => {
		Router.NavigateToExternalWeb(url)
		Router.CloseSideMenus()
	}

	useEffect(() => {
		if (typeof selectedGame?.appId === "number") {
			getReports(selectedGame.appId, serverApi).then((res) => {
				if (res !== undefined) setReports(res)

				setLoading(false)
			})
		} else {
			setLoading(false)
		}
	}, [selectedGame])

	if (isLoading)
		return (
			<div>
				<BackButton onClick={() => setSelectedGame(null)} />
				<LoadingPanel />
			</div>
		)

	if (selectedReport) {
		return (
			<div>
				<BackButton onClick={() => setSelectedReport(null)} />
				<Scrollable ref={ref}>
					<ScrollArea scrollable={ref}>
						<PanelSection
							title={selectedGame?.title}
						></PanelSection>
						<ReportElement report={selectedReport} />
					</ScrollArea>
				</Scrollable>
			</div>
		)
	}

	return (
		<div>
			<BackButton onClick={() => setSelectedGame(null)} />
			<PanelSection title={selectedGame?.title}>
				{reports.map((report) => (
					<PanelSectionRow>
						<ButtonItem
							layout="below"
							onClick={() => setSelectedReport(report)}
						>
							{report.playtime} |{" "}
							<small>
								{report.power_draw} | {report.fps} |{" "}
								{report.graphics_preset}
							</small>
						</ButtonItem>
					</PanelSectionRow>
				))}
				<PanelSectionRow>
					{reports.length === 0
						? "No Reports were found for this game. Maybe you can add one? Check out https://sharedeck.games"
						: "Using your own configuration? Share it at https://sharedeck.games"}
					{/* <ButtonItem
						onClick={() =>
							openWeb(
								SHAREDECK_NEW_REPORT_URL.replaceAll(
									"${appid}",
									selectedGame?.appId?.toString() || ""
								)
							)
						}
						layout="below"
						label={
							reports.length === 0
								? "No Reports were found for this game. Maybe you can add one?"
								: "Using your own configuration? Share it here!"
						}
					>
						Submit Report
					</ButtonItem> */}
				</PanelSectionRow>
			</PanelSection>
		</div>
	)

	return <div></div>
}

export default GameReports
