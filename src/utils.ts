import { ServerAPI } from 'decky-frontend-lib';
import { ReportItem, emptyReport } from './components/Report/Report';
import { load } from 'cheerio';

export type DefaultProps = {
    serverApi: ServerAPI;
};

function scrapeShareDeck(data: string): ReportItem[] {

    try {
        const $ = load(data);

        const articles = $('article');

        let reports: ReportItem[] = []

        articles.each((_, el) => {
            const sections = $(el).children('div');
            let report = emptyReport();
            // Header Section
            const headerSection = $(sections[0]);
            let headerText = headerSection.text().replace(/\s\s+/g, '   ').split('   ');
            report.playTime = headerText[1] + " " + headerText[2];
            report.wattage = headerText[3];
            report.fps = headerText[4];
            report.preset = headerText[5];
            report.reporter = headerText[6];
            // Main Section
            const bodySection = $(sections[1]);
            let span = bodySection.find('span').first();
            
            // Note
            report.note = $(span).next().text().replaceAll('\n', ' ').trim();

            // Tables
            const tables = bodySection.find('div.w-full');
            tables.each((_, t) => {
                let table = {}
                let spans = $(t).find('span');
                // @ts-ignore
                table.tableTitle = $(spans[0]).text().trim();

                let c = 1

                while (c < spans.length) {
                    let key = $(spans[c]).text().replace(/\s\s+/g, ' ').trim();
                    c++
                    let val = $(spans[c]).text().replace(/\s\s+/g, ' ').trim();
                    c++

                    table[key] = val;
                }

                report.tables.push(table);
            });

            reports.push(report);
        });
        for (let i = 0; i < reports.length; i++) {
            let report = reports[i];
            console.log(report);
            console.log();
        }

        return reports;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const getReports = async (
    url: string,
    serverApi: ServerAPI,
    handleResult: Function
) => {

    // const writeLog = async (content: any) => {
    //     let text = `${content}`;
    //     serverApi.callPluginMethod<{content: string}>("log", {content: text});
    // };

    const response = await serverApi.fetchNoCors<{ body: string }>(url, {method: "GET"});

    if (response.success) {
        // writeLog("Successful Response");
        // writeLog(url);
        // writeLog(response.result);
        // writeLog(response.result.body);
        let reports = scrapeShareDeck(response.result.body);
        handleResult(reports);
    } else {
        // writeLog("Failed Response");
        // writeLog(response.result);
        handleResult([]);
    }

    // let reports: ReportItem[] = [{
    //         playTime: '1h 40m',
    //         wattage: '24.0w',
    //         fps: '50 / 50fps',
    //         preset: 'low',
    //         reporter: 'adtither (AD)',
    //         note: 'Proton GE-7-35Graphics Quality: LowAnti Aliasing: TAATexture Quality: High',
    //         tables: [
    //             {
    //             tableTitle: 'Configuration',
    //             'Graphics preset': 'low',
    //             'screen refresh rate': '50fps',
    //             'framerate limit': '50fps',
    //             'average framerate': '50fps',
    //             'tdp limit': 'none',
    //             resolution: '1280 x 800'
    //             },
    //             {
    //             tableTitle: 'System',
    //             'Proton version': 'GE 7-29',
    //             'Steamos version': '3.3',
    //             'Bios version': 'F7A0105'
    //             }
    //         ],
    //     },
    //     {
    //         playTime: '2h 0m',
    //         wattage: '20.0w',
    //         fps: '40 / 40fps',
    //         preset: 'high',
    //         reporter: 'Zythe Tarak',
    //         note: 'High preset, change shadows to medium',
    //         tables: [
    //             {
    //                 tableTitle: 'Configuration',
    //                 'Graphics preset': 'high',
    //                 'screen refresh rate': '40fps',
    //                 'framerate limit': '40fps',
    //                 'average framerate': '40fps',
    //                 'tdp limit': 'none',
    //                 resolution: '1280 x 800'
    //             },
    //             {
    //                 tableTitle: 'System',
    //                 'Proton version': '7.0-3',
    //                 'Steamos version': '3.3',
    //                 'Bios version': 'F7A0105'
    //             }
    //         ],
    //     },
    // ]
    // handleResult(reports);
}
