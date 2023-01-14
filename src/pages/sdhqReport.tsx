import { Table } from "./reportElement"
import { ShareDeckTable } from "../context"
import { PanelSection, PanelSectionRow } from "decky-frontend-lib"
import React from "react"

export type SDHQReport = {
	link: string
	excerpt: {
		rendered: string
	}
	acf: {
		sdhq_rating: string
		optimized_and_recommended_settings: {
			steamos_settings: {
				fps_cap: string
				fps_refresh_rate: number
				half_rate_shading: boolean
				tdp_limit: string
				scaling_filter: string
				gpu_clock_frequency: string
			}
			proton_version: string
			game_settings: string
			projected_battery_usage_and_temperature: {
				wattage: string
				temperatures: string
				gameplay_time: string
			}
		}
	}
}

export function SDHQReportElement({ report }: { report: SDHQReport }) {
	let tables = [getSteamosTable(report), ...getGameSettingsTables(report)]

	return (
		<PanelSection title={sdhqHeaderString(report)}>
			{tables.map((t) => (
				<Table tableObject={t} />
			))}
			<div style={{ height: "10px" }} />
			<PanelSectionRow>
				{removeHTMLTags(report.excerpt.rendered).replaceAll("[…]", "…")}
			</PanelSectionRow>
		</PanelSection>
	)
}

const sdhqHeaderString = (report: SDHQReport) =>
	`${report.acf.sdhq_rating}★ | ${report.acf.optimized_and_recommended_settings.steamos_settings.fps_cap} | ${report.acf.optimized_and_recommended_settings.projected_battery_usage_and_temperature.gameplay_time} | ${report.acf.optimized_and_recommended_settings.projected_battery_usage_and_temperature.wattage}`

export const SDHQHeader = ({ report }: { report: SDHQReport }) => (
	<React.Fragment>
		{" "}
		{report.acf.sdhq_rating}★ |{" "}
		<small>
			{
				report.acf.optimized_and_recommended_settings
					.projected_battery_usage_and_temperature.wattage
			}
			{" | "}
			{
				report.acf.optimized_and_recommended_settings.steamos_settings
					.fps_cap
			}
			{" fps | "}
			{
				report.acf.optimized_and_recommended_settings
					.projected_battery_usage_and_temperature.gameplay_time
			}
		</small>
	</React.Fragment>
)

function getSteamosTable(report: SDHQReport): ShareDeckTable {
	const settings =
		report.acf.optimized_and_recommended_settings.steamos_settings
	return {
		title: "SteamOS Settings",
		rows: [
			{
				label: "FPS Limit",
				value: settings.fps_cap,
			},
			{
				label: "Refresh Rate",
				value: settings.fps_refresh_rate,
			},
			{
				label: "Half-Rate Shading",
				value: settings.half_rate_shading ? "Yes" : "No",
			},
			{
				label: "TDP Limit",
				value: settings.tdp_limit,
			},
			{
				label: "Scaling Filter",
				value: settings.scaling_filter,
			},
			{
				label: "GPU Clock",
				value: settings.gpu_clock_frequency,
			},
			{
				label: "Proton Version",
				value: report.acf.optimized_and_recommended_settings
					.proton_version,
			},
		],
	}
}

function removeHTMLTags(html: string) {
	var tempDivElement = document.createElement("div")

	tempDivElement.innerHTML = html

	return tempDivElement.textContent || tempDivElement.innerText || ""
}

function getGameSettingsTables(report: SDHQReport): ShareDeckTable[] {
	const gameSettings = removeHTMLTags(
		report.acf.optimized_and_recommended_settings.game_settings
	)
	let result = []
	let currentTable: ShareDeckTable = { title: "Game Settings", rows: [] }
	for (const line of gameSettings.split("\n")) {
		if (line.length === 0) continue

		const parts = line.split(":")

		if (parts.length === 1 || !/\S/.test(parts[1])) {
			if (
				currentTable.title !== "Game Settings" ||
				currentTable.rows.length > 0
			) {
				result.push(Object.assign({}, currentTable))
			}
			currentTable = { title: `Game Settings - ${parts[0]}`, rows: [] }
		} else {
			currentTable.rows.push({ label: parts[0], value: parts[1] })
		}
	}
	result.push(currentTable)
	return result
}
