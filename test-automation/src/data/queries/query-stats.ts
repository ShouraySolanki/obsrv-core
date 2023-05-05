import { observationsDataset } from "../event-generate/obsMeta";
import { lowerInterval, upperInterval } from "./intervals";
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