import { ServerAPI } from "decky-frontend-lib"
import { SDHQ_REPORT_ENDPOINT, SHAREDECK_REPORT_ENDPOINT } from "./constants"
import { PluginSettings, Report, ReportInterface } from "./context"
import { SDHQReport } from "./pages/sdhqReport"

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

const getLocalStorageItem = <T>(key: string, def: T): T => {
	const rawData = window.localStorage.getItem(key)
	if (rawData) return JSON.parse(rawData)

	return def
}

export const getToastedGames = (): string[] => {
	return getLocalStorageItem("sharedecky-toasted-games", [] as string[])
}

export const getSettings = () => {
	return getLocalStorageItem("sharedecky-settings", {
		showShareDeckToasts: true,
		showSDHQToasts: true,
		showAlways: false,
	} as PluginSettings)
}
