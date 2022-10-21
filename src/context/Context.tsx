import React, { createContext, useReducer } from 'react';
import { AppActions, shareDeckReducer } from '../reducers/ShareDeckReducer';
import { ReportInterface } from '../components/Report/Report';

export type ShareDeckState = {
    runningGame?: string;
    reports: ReportInterface[] | null;
    isLoading: boolean;
    selectedReport: number | null;
};

type ShareDeckContext = {
    state: ShareDeckState;
    dispatch: React.Dispatch<AppActions>;
};

export const initialState: ShareDeckState = {
    runningGame: undefined,
    reports: null,
    isLoading: false,
    selectedReport: null,
};

export const AppContext = createContext<ShareDeckContext>({
    state: initialState,
    dispatch: () => {},
});

type AppContextProps = {
    incomingState?: ShareDeckState;
};

export const AppContextProvider: React.FC<AppContextProps> = ({
    children,
    incomingState,
}) => {
    const myState = {
        ...initialState,
        ...incomingState,
    };
    const [state, dispatch] = useReducer(shareDeckReducer, myState);
    const value = { state, dispatch };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
