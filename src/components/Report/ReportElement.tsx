import { Report, ShareDeckTable } from './Report';
import { ReactElement } from 'react';
import {
    PanelSection,
    gamepadDialogClasses,
    joinClassNames,
    PanelSectionRow,
} from "decky-frontend-lib";

const FieldWithSeparator = joinClassNames(gamepadDialogClasses.Field, gamepadDialogClasses.WithBottomSeparatorStandard);

export function TableItem({
    label,
    value,
}: {
    label: string,
    value: string,
}): ReactElement {
    return (
        <div className={FieldWithSeparator}>
            <div className={gamepadDialogClasses.FieldLabelRow}>
                <div className={gamepadDialogClasses.FieldLabel}>
                    {`${label}`}
                </div>
                <div className={gamepadDialogClasses.FieldChildren}>
                    {`${value}`}
                </div>
            </div>
        </div>
    )
}

export function Table({
    tableObject,
}: {
    tableObject: ShareDeckTable,
}): ReactElement {
    let items = [];
    // @ts-ignore
    for (const row of tableObject.rows) {
        items.push(TableItem({label: row.label, value: row.value}));
    };
    return (
        <PanelSectionRow>
                {`${tableObject.title}`}
                {items}
        </PanelSectionRow>
    )
}

export function ReportElement({
    report,
}: {
    report: Report
}): ReactElement {
    let tables = []
    let reportTables = report.tables;
    for (var i = 0; i < report.tables.length; i++) {
        tables.push(Table({tableObject: reportTables[i]}));
    }
    return (
        <PanelSection title={report.header}>
            <PanelSectionRow>
                {report.note}
            </PanelSectionRow>
            {/* {report.header}
            <div className={gamepadDialogClasses.FieldDescription}>
                {report.note}
            </div> */}
            {tables}
            <div className={gamepadDialogClasses.FieldDescription}>
                {`Reported by: ${report.user?.personaname}`}
            </div>
        </PanelSection>
    )
}
