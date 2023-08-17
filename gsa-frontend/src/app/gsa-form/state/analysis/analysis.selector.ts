import {createFeature, createSelector} from "@ngrx/store";
import {analysisReducer} from "./analysis.reducer";

export const analysisFeature = createFeature({
    name: 'analysis',
    reducer: analysisReducer,
    extraSelectors: ({selectReportLoadingStatus}) => ({
        selectReports: createSelector(selectReportLoadingStatus, status => status?.reports)
    })
});


