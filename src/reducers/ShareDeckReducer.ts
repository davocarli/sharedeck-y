import { ReportItem } from '../components/Report/Report';
import { ShareDeckState } from '../context/Context';

export enum ActionType {
    UPDATE_RUNNING_GAME,
    START_LOADING,
    UPDATE_REPORTS,
}

export type AppActions = 
    | UpdateRunningGameAction
    | StartLoadingAction
    | UpdateReportsAction

export type UpdateRunningGameAction = {
    type: ActionType.UPDATE_RUNNING_GAME;
    payload?: string;
}

export type StartLoadingAction= {
    type: ActionType.START_LOADING;
    payload?: null;
}

export type UpdateReportsAction = {
    type: ActionType.UPDATE_REPORTS;
    payload: ReportItem[];
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
        default:
            return state;
    }
};
