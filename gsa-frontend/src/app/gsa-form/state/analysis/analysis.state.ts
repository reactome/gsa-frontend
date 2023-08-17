import {PLoadingStatus} from "../../model/load-dataset.model";
import {AnalysisResult} from "../../model/analysis-result.model";

export interface AnalysisState {
    analysisLoadingStatus: PLoadingStatus | null,
    reportLoadingStatus: PLoadingStatus | null,
    analysisResult: AnalysisResult | null,
    reportsRequired: boolean
}

export const initialState: AnalysisState = {
    analysisLoadingStatus: null,
    reportLoadingStatus: null,
    analysisResult: null,
    reportsRequired : false
};



