import path from 'path';
import { ITask } from '../types';
import { scrapModules } from '../utils/scrapModules';

const tasks = scrapModules<ITask>(__dirname, path.basename(__filename));

export default tasks;


/*
    1 - create required tables in postgres.
    2 - create dataset/masterdata-(sample data, json schema, dataset, ingestionSpec, datasource)
    3	add connector, add denorm, transformations
    3 - publish dataset.
    5  -verify if dataset is published
    6 - push events.
    7 - sleep/ wait.
    8 - get counts from kafka topics
    9 - get success count from druid from system-stats
    10 - get failure count from druid from failed-events-summary
    11 - read files from s3
    12 - assertions
*/

