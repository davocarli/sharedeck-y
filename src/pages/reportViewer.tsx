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
	SDHQ_REPORT_ENDPOINT,
	// SHAREDECK_NEW_REPORT_URL,
	SHAREDECK_REPORT_ENDPOINT,
} from "../constants"
import { ReportElement } from "./reportElement"
import BackButton from "../components/backButton"
import { Scrollable, ScrollArea, scrollableRef } from "../components/Scrollable"
import { SDHQReport, SDHQHeader, SDHQReportElement } from "./sdhqReport"

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

const getSDHQReport = async (appId: number, serverApi: ServerAPI) => {
	const url = SDHQ_REPORT_ENDPOINT.replaceAll("${appid}", `${appId}`)

	const res = await serverApi.fetchNoCors<{ body: string }>(url, {
		headers: { "User-Agent": "PostmanRuntime/7.30.0" },
		method: "GET",
	})

	if (res.success) {
		const reports = JSON.parse(res.result.body) as SDHQReport[]
		if (reports.length > 0) return reports[0]
	}
	return null
}

const GameReports = ({ serverApi }: { serverApi: ServerAPI }) => {
	const { selectedGame, setSelectedGame } = useContext(ShareDeckContext)
	const [loadingSharedeck, setLoadingSharedeck] = useState(true)
	const [loadingSDHQ, setLoadingSDHQ] = useState(true)
	const [sdhqReport, setSdhqReport] = useState<SDHQReport | null>(null)
	const [reports, setReports] = useState<Report[]>([])
	const [selectedReport, setSelectedReport] = useState<Report | null>(null)
	const [selectedSDHQ, setSelectedSDHQ] = useState(false)
	const ref = scrollableRef()

	useEffect(() => {
		if (typeof selectedGame?.appId === "number") {
			getReports(selectedGame.appId, serverApi).then((res) => {
				if (res !== undefined) setReports(res)
				setLoadingSharedeck(false)
			})
			getSDHQReport(selectedGame.appId, serverApi).then((res) => {
				if (res !== undefined) setSdhqReport(res)
				setLoadingSDHQ(false)
			})
		} else {
			setLoadingSharedeck(false)
			setLoadingSDHQ(false)
		}
	}, [selectedGame])

	if (loadingSharedeck || loadingSDHQ)
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

	if (selectedSDHQ) {
		return (
			<div>
				<BackButton onClick={() => setSelectedSDHQ(false)} />
				<Scrollable ref={ref}>
					<ScrollArea scrollable={ref}>
						<SDHQReportElement report={sdhqReport!} />
					</ScrollArea>
					<PanelSection>
						<PanelSectionRow>
							<ButtonItem
								layout="below"
								onClick={() => openWeb(sdhqReport!.link)}
							>
								Open in SteamDeckHQ
							</ButtonItem>
						</PanelSectionRow>
					</PanelSection>
				</Scrollable>
			</div>
		)
	}

	return (
		<div>
			<BackButton onClick={() => setSelectedGame(null)} />
			<PanelSectionRow>
				<h2>{selectedGame?.title}</h2>
			</PanelSectionRow>
			{sdhqReport ? (
				<PanelSection title="SteamDeckHQ">
					<PanelSectionRow>
						<ButtonItem
							layout="below"
							onClick={() => setSelectedSDHQ(true)}
						>
							<SDHQHeader report={sdhqReport} />
						</ButtonItem>
					</PanelSectionRow>
				</PanelSection>
			) : null}
			<PanelSection title="ShareDeck Reports">
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
						? "No ShareDeck Reports were found for this game. Maybe you can add one? Check out https://sharedeck.games"
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

function openWeb(url: string) {
	Router.NavigateToExternalWeb(url)
	Router.CloseSideMenus()
}
