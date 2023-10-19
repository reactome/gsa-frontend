import {ActionReducer, createReducer, on} from '@ngrx/store';
import {AnalysisState, initialState} from './analysis.state';
import {analysisActions} from "./analysis.actions";
import {extractErrorMessage} from "../../utilities/utils";

export const analysisReducer: ActionReducer<AnalysisState> = createReducer(
  initialState,
  on(analysisActions.load, (state, {reportsRequired}) => ({
    ...state,
    reportsRequired,
    analysisLoadingStatus: {status: 'pending', id: 'unknown', description: 'Sending request to server', completed: 0}
  })),
  on(analysisActions.loadSuccess, (state, {analysisId}) => ({...state, analysisId})),
  on(analysisActions.loadFailure, (state, {error}) => ({
    ...state,
    analysisLoadingStatus: {status: 'failed', id: 'unknown', description: extractErrorMessage(error)}
  })),
  on(analysisActions.setLoadingStatus, (state, {status}) => ({...state, analysisLoadingStatus: status})),
  on(analysisActions.setReportLoadingStatus, (state, {status}) => ({...state, reportLoadingStatus: status})),
  on(analysisActions.setAnalysisResults, (state, {result}) => ({...state, analysisResult: result})),
)


