import {ActionReducer, createReducer, on} from '@ngrx/store';
import {AnalysisState, initialState} from './analysis.state';
import {analysisActions} from "./analysis.actions";

export const analysisReducer: ActionReducer<AnalysisState> = createReducer(
    initialState,
    on(analysisActions.load, (state, {reportsRequired}) => ({...state, reportsRequired})),
    on(analysisActions.loadSuccess, (state, {analysisId}) => ({...state, analysisId})),
    on(analysisActions.setLoadingStatus, (state, {status}) => ({...state, analysisLoadingStatus: status})),
    on(analysisActions.setReportLoadingStatus, (state, {status}) => ({...state, reportLoadingStatus: status})),
    on(analysisActions.setAnalysisResults, (state, {result}) => ({...state, analysisResult: result})),
)


