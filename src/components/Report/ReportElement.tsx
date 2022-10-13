import { ReportItem } from './Report';
import { ReactElement } from 'react';
import {
    ButtonItem,
    definePlugin,
    DialogButton,
    Menu,
    MenuItem,
    PanelSection,
    PanelSectionRow,
    Router,
    ServerAPI,
    showContextMenu,
    staticClasses,
    gamepadDialogClasses,
    joinClassNames,
    Focusable,
    Button,
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
    tableObject: object,
}): ReactElement {
    let items = [];
    // @ts-ignore
    let tableTitle = tableObject.tableTitle
    for (const [key, value] of Object.entries(tableObject)) {
        let val = `${value}`
        if (key != "tableTitle") {
            items.push(TableItem({label: key, value: val}));
        }
    };
    return (
        <Focusable>
            {`${tableTitle}`}
            {items}
        </Focusable>
    )
}

export function ReportElement({
    report,
}: {
    report: ReportItem
}): ReactElement {
    let tables = []
    for (var i = 0; i < report.tables.length; i++) {
        let table: object = report.tables[i];
        tables.push(Table({tableObject: table}));
    }
    return (
        <PanelSection>
            {`${report.playTime} | ${report.wattage} | ${report.fps} | ${report.preset}`}
            <div className={gamepadDialogClasses.FieldDescription}>
                {`${report.note}`}
            </div>
            {tables}
            <div className={gamepadDialogClasses.FieldDescription}>
                {`Reported by: ${report.reporter}`}
            </div>
        </PanelSection>
    )
}
