import { ButtonItem, PanelSection } from "decky-frontend-lib";
import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { Report } from "../Report/Report";

export interface ReportSelectProps extends HTMLAttributes<HTMLDivElement> {
    reports: Report[],
    onChoose: (index: number) => void
}

const Cell = (props: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) => {
    return <span style={{display: "table-cell", textAlign: "center"}}>{props.children}</span>
}

export const ReportSelect: FC<ReportSelectProps> = (props) => {
    return (
        <PanelSection>
            {props.reports.map((report, i) => (
                <ButtonItem
                    layout="below"
                    onClick={() => props.onChoose(i)}
                    description={"Reported By: " + report.user?.personaname}
                >   
                    <div style={{display: "table", width: "100%"}}>
                        <Cell>{report.playtime}</Cell>
                        <Cell><small>{report.power_draw}w</small></Cell>
                        <Cell><small>{report.fps}</small></Cell>
                        <Cell><small>{report.graphics_preset}</small></Cell>
                    </div>
                </ButtonItem>
            ))}
        </PanelSection>
    )
}
