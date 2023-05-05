import _ from "lodash";
import { fetchMetricsQueries } from "../data/queries/prometheus";
import { fetchMetrics } from "../services/prometheus";
import fs from "fs"
export async function getMetrics() {
    const metrics: any = {}
    for (var [metric, query] of Object.entries(fetchMetricsQueries)) {
        metrics[metric] = parseInt(await fetchMetrics(query))
    }
    fs.writeFileSync(__dirname + "/../data/event-generate/outputCounts.json", JSON.stringify(metrics));
    return metrics
}

async function main() { await getMetrics() }

main()