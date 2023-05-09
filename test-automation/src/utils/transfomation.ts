import JSONata from 'jsonata';

export const previewTransformation = async (expression: any, jsonInputData: any) => {
    const ata = JSONata(expression);
    let data = await ata.evaluate(jsonInputData);
    if (Array.isArray(data)) {
        data = data.filter(item => !(typeof item === 'object' && 'sequence' in item));
    }

    return data;
};
