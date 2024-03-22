import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const useReadable = (readable: any) => {

    const readableData = readable.map((item: any) => {
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
}

export default eventHandler(async (event) => {
    const user: any = await serverSupabaseUser(event)
    const client: any = await serverSupabaseClient(event)

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "You are not authorized to access this resource."
    }

    const readableData = useReadable(await readMultipartFormData(event));
    const { naam, plaats, keuken, prijs, beschrijving, file } = readableData;

    if (!file) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "No file found in the request"
    }

    const { data: insertedData, error: insertError } = await client.from('restaurants_table').insert({
        naam, plaats, keuken, prijs, beschrijving, thumbnail: `${naam}/${file.filename}`
    }).select()


    if (insertError) throw insertError
    const { data: image, error: storageError } = await client.storage.from('restaurants').upload(`${naam}/${file.filename}`, file.data)
    if (storageError) throw storageError;

    
    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "Files uploaded successfully",
        data: { insertedData }
    };

})