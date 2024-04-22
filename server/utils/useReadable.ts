
export default async (data: any) => {
    const readableData = data.map((item: any) => {
        if (item.name !== 'file' && Buffer.isBuffer(item.data)) return { ...item, data: item.data.toString('utf8') };
        return item;
    });

    const result = readableData.reduce((acc: any, curr: any) => {
        if (curr.name !== 'file') acc[curr.name] = curr.data;
        return acc;
    }, {});

    return {
        ...result, file: readableData.find((item: any) => item.name === 'file')
    }
};