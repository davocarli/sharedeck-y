
export type ReportItem = {
    playTime: string | undefined;
    wattage: string | undefined;
    fps: string | undefined;
    preset: string | undefined;
    reporter: string | undefined;
    note: string | undefined;
    tables: any[];
}

export function emptyReport(): ReportItem {
    let report: ReportItem = {
        playTime: undefined,
        wattage: undefined,
        fps: undefined,
        preset: undefined,
        reporter: undefined,
        note: undefined,
        tables: [],
    }
    return report;
}
