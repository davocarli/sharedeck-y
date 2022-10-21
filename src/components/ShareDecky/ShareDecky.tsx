import { PanelSection, PanelSectionRow, Router, ButtonItem } from 'decky-frontend-lib';
import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/Context';
import { ActionType } from '../../reducers/ShareDeckReducer';
import { DefaultProps, getReports, formatString, writeLog } from '../../utils';
import { shareDeckGetReports } from '../../constants';
import { ReportInterface, Report } from '../Report/Report';
import { ReportElement } from '../Report/ReportElement';
import { Scrollable, scrollableRef, ScrollArea } from '../Scrollable/Scrollable';
import BuyCoffee from '../BuyCoffee/BuyCoffee';
import { ReportSelect } from '../ReportSelect/ReportSelect';

export const ShareDecky = ({ serverApi }: DefaultProps) => {

    const {
        state: { runningGame, isLoading, reports, selectedReport },
        dispatch,
    } = useContext(AppContext);
    
    const handleSteamAppStateChange = ({ bRunning }: AppState) => {
        if (!bRunning) {
            dispatch({
                type: ActionType.UPDATE_RUNNING_GAME,
                payload: undefined,
            });
        }
    };

    const handleGameActionStart = (
        _actionType: number,
        strAppId: string,
        _actionName: string
    ) => {
        dispatch({
            type: ActionType.UPDATE_RUNNING_GAME,
            payload: strAppId,
        });
    };

    const outerDiv = scrollableRef();

    useEffect(() => {

        const getGame = async (): Promise<string | undefined> => {
            const currentGame = Router.MainRunningApp?.appid;
            return currentGame;
        }

        const handleReports = (data: ReportInterface[]) => {
            dispatch({
                type: ActionType.UPDATE_REPORTS,
                payload: data,
            })
        }    
        
        getGame().then((currentGame) => {
            if (currentGame != runningGame) {
                dispatch({
                    type: ActionType.UPDATE_RUNNING_GAME,
                    payload: currentGame,
                });
            
                if (currentGame != null && reports == null && !isLoading) {
                    dispatch({
                        type: ActionType.START_LOADING,
                    });
                    getReports(formatString(shareDeckGetReports, {appid: currentGame}), serverApi, handleReports);
                } else {
                }
            }
        });

        const onAppStateChange = 
            SteamClient.GameSessions.RegisterForAppLifetimeNotifications(
                handleSteamAppStateChange
            );

        const onGameActionStart = SteamClient.Apps.RegisterForGameActionStart(
            handleGameActionStart
        );

        return function cleanup() {
            onAppStateChange.unregister();
            onGameActionStart.unregister();
        }

    });

    if (runningGame == null) {
        return <PanelSection title="Open a game to see ShareDeck Reports"><BuyCoffee/></PanelSection>
    };

    let appDetails = appStore.GetAppOverviewByGameID(parseInt(runningGame));

    if (isLoading) {
        return <PanelSection spinner={true} title={appDetails.display_name}></PanelSection>
    }

    if (reports == null || reports.length == 0) {
        return <PanelSection title={appDetails.display_name}><PanelSectionRow>No Reports Found</PanelSectionRow><PanelSectionRow><BuyCoffee/></PanelSectionRow></PanelSection>
    } 

    function chooseReport(i: number) {
        writeLog(serverApi, `Selected ${i}`);
        dispatch({
            type: ActionType.SELECT_REPORT,
            payload: i,
        })
    }

    let formattedReports = [];

    for (let r of reports) {
        formattedReports.push(new Report(r as ReportInterface));
    }

    if (selectedReport == null) {
        return <ReportSelect reports={formattedReports} onChoose={chooseReport}/>
    }

    return (
        <Scrollable ref={outerDiv}>
            <PanelSectionRow>
                <ButtonItem>
                    Go Back
                </ButtonItem>
            </PanelSectionRow>
            <ScrollArea scrollable={outerDiv}>
                <ReportElement report={formattedReports[selectedReport]}/>
            </ScrollArea>
        </Scrollable>
    )
}
