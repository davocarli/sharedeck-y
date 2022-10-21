import { ServerAPI } from 'decky-frontend-lib';
import { ReportInterface } from './components/Report/Report';

export type DefaultProps = {
    serverApi: ServerAPI;
};

function scrapeShareDeck(data: string): ReportInterface[] {

    try {
        let reports = JSON.parse(data) as ReportInterface[];

        return reports;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const writeLog = async (serverApi: ServerAPI, content: any) => {
    let text = `${content}`;
    serverApi.callPluginMethod<{content: string}>("log", {content: text});
};


export function formatString(str: string, data: object): string {
    let result = str;
    for (const [key, value] of Object.entries(data)) {
        result = result.replaceAll("${" + key + "}", `${value}`);
    }
    return result;
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
}
