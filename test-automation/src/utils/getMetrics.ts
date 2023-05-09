import _ from "lodash";
import { fetchMetricsQueries } from "../data/queries/prometheus";
import { fetchMetrics } from "../services/prometheus";
export async function getMetrics() {
    const metrics: any = {}
    for (var [metric, query] of Object.entries(fetchMetricsQueries)) {
        metrics[metric] = parseInt(await fetchMetrics(query))
    }
    return metrics
}

async function main() { await getMetrics() }

main()