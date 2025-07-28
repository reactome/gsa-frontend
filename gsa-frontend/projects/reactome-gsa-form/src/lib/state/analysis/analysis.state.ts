import {PLoadingStatus} from "../../model/load-dataset.model";
import {AnalysisResult} from "../../model/analysis-result.model";

export interface AnalysisState {
  analysisId: string | null,
  analysisLoadingStatus: PLoadingStatus | null,
  reportLoadingStatus: PLoadingStatus | null,
  analysisResult: AnalysisResult | null,
  reportsRequired: boolean
}

export const initialState: AnalysisState = {
  analysisId: null,
  analysisLoadingStatus: null,
  reportLoadingStatus: null,
  analysisResult: null,
  reportsRequired: false
};



