import {
	Navigation,
	ServerAPI,
	QuickAccessTab,
	staticClasses,
	SideMenu,
} from "decky-frontend-lib"
import { SDHQ_REPORT_ENDPOINT, SHAREDECK_REPORT_ENDPOINT } from "./constants"
import { PluginSettings, Report, ReportInterface } from "./context"
import { SDHQReport } from "./pages/sdhqReport"
import sdhqlogo from "../assets/sdhqlogo.jpg"
import sharedecklogo from "../assets/sharedecklogo.png"

export const getReports = async (
	appId: number | string,
	serverApi: ServerAPI
) => {
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

export const getSDHQReview = async (
	appId: number | string,
	serverApi: ServerAPI,
	fields: string[]
) => {
	const url = SDHQ_REPORT_ENDPOINT.replaceAll("${appid}", `${appId}`)
	const fieldsParam = `&_fields=${fields.join()}`

	const res = await serverApi.fetchNoCors<{ body: string }>(
		`${url}${fieldsParam}`,
		{
			headers: { "User-Agent": "PostmanRuntime/7.30.0" },
			method: "GET",
		}
	)

	if (res.success) {
		const reports = JSON.parse(res.result.body) as Partial<SDHQReport>[]
		if (reports.length > 0) return reports[0]
	}
	return null
}

const getLocalStorageItem = <T,>(key: string, def: T): T => {
	const rawData = window.localStorage.getItem(key)
	if (rawData) return JSON.parse(rawData)

	return def
}

export const getToastedGames = (): number[] => {
	return getLocalStorageItem("sharedecky-toasted-games", [] as number[])
}

export const getSettings = () => {
	return getLocalStorageItem("sharedecky-settings", {
		showShareDeckToasts: true,
		showSDHQToasts: true,
		showAlways: false,
	} as PluginSettings)
}

const sendToast = (serverApi: ServerAPI, title: string, img: string) => {
	serverApi.toaster.toast({
		title: title,
		body: "Open DeckSettings Plugin for details...",
		className: staticClasses.FullHeight,
		playSound: true,
		sound: 8,
		eType: 1,
		onClick: () => {
			// console.log(Navigation)
			// console.log(JSON.stringify(Navigation))
			Navigation.OpenQuickAccessMenu(QuickAccessTab.Decky)
		},
		// duration: 1000000,  // For debugging/styling
		logo: <img height="40px" src={img} />,
	})
}

export const sendShareDeckToast = (serverApi: ServerAPI) => {
	sendToast(serverApi, "ShareDeck Reports Available", sharedecklogo)
}

export const sendSDHQToast = (serverApi: ServerAPI) => {
	sendToast(serverApi, "SteamDeckHQ Review Available", sdhqlogo)
}
