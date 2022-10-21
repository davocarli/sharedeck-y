import { ReportInterface } from '../components/Report/Report';
import { ShareDeckState } from '../context/Context';

export enum ActionType {
    UPDATE_RUNNING_GAME,
    START_LOADING,
    UPDATE_REPORTS,
    SELECT_REPORT,
}

export type AppActions = 
    | UpdateRunningGameAction
    | StartLoadingAction
    | UpdateReportsAction
    | SelectReportAction

export type UpdateRunningGameAction = {
    type: ActionType.UPDATE_RUNNING_GAME;
    payload?: string;
}

export type SelectReportAction = {
    type: ActionType.SELECT_REPORT;
    payload?: number;
}

export type StartLoadingAction= {
    type: ActionType.START_LOADING;
    payload?: null;
}

export type UpdateReportsAction = {
    type: ActionType.UPDATE_REPORTS;
    payload: ReportInterface[];
}

export const shareDeckReducer = (state: ShareDeckState, action: AppActions): ShareDeckState => {
    switch (action.type) {
        case ActionType.UPDATE_RUNNING_GAME:
            return {
                ...state,
                runningGame: action.payload,
                isLoading: false,
                reports: null,
            }
        case ActionType.START_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case ActionType.UPDATE_REPORTS:
            return {
                ...state,
                isLoading: false,
                reports: action.payload,
            }
        case ActionType.SELECT_REPORT:
            if (action.payload != undefined) {
                return {
                    ...state,
                    selectedReport: action.payload,
                }
            }
            return {
                ...state,
                selectedReport: null,
            }
        default:
            return state;
    }
};
