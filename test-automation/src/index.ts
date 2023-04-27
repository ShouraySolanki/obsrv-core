import tasks from './tasks';

(async () => {
    const pushEvents = tasks.get("pushEventsToDataset");
    if(pushEvents) {
        pushEvents.handler({})();
    }

})()