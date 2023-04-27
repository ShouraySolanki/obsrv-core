
import { v4 } from 'uuid';

const master = {
    "observation": {
        "id": v4(),
        "data": {
            "dataset_id": "observations-assets",
            "command": "PUBLISH_DATASET"
        }
    }
}

const dataset = {
    "observation": {
        "id": v4(),
        "data": {
            "dataset_id": "observations-transformed",
            "command": "PUBLISH_DATASET"
        }
    }
}

export default { master, dataset }