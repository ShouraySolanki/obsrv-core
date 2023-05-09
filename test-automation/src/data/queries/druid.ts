import { observationsDataset } from "../event-generate/obsMeta";
import { lowerInterval, upperInterval } from "./intervals";
const obsDatasource = "observations-transformed"
export const queryStats = {
    "context": {
        "dataSource": "system-stats"
    },
    "query": {
        "queryType": "timeseries",
        "dataSource": "system-stats",
        "intervals": `${lowerInterval}/${upperInterval}`,
        "filter": {
            "type": "selector",
            "dimension": "dataset",
            "value": observationsDataset
        },
        "granularity": "all",
        "aggregations": [
            {
                "type": "longSum",
                "name": "eventsCount",
                "fieldName": "count"
            }
        ]
    }
}
export const obsDatasourceQuery = {
    "queryType": "timeseries",
    "dataSource": obsDatasource,
    "intervals": `${lowerInterval}/${upperInterval}`,
    "granularity": "all",
    "aggregations": [
        {
            "type": "longSum",
            "name": "eventsCount",
            "fieldName": "count"
        }
    ]
}