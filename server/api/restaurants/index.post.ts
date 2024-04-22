import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise( async (resolve, reject) => {
        const user: any = await serverSupabaseUser(event)
        const client: any = await serverSupabaseClient(event)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Je bent niet geautoriseerd om toegang te krijgen tot deze bron."
        })

        const data = await readMultipartFormData(event);
        const readableData = await useReadable(data);
        const { naam, plaats, keuken, prijs, beschrijving, file } = readableData;

        if (!file) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Geen bestand gevonden in het verzoek"
        })

        const { data: insertedData, error: insertError } = await client.from('restaurants_table').insert({
            naam, plaats, keuken, prijs, beschrijving, thumbnail: `${naam}/${file.filename}`
        }).select()

        if (insertError) throw insertError
        const { data: image, error: storageError } = await client.storage.from('restaurants').upload(`${naam}/${file.filename}`, file.data)
        if (storageError) throw storageError;

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Bestanden succesvol geüpload",
            data: { insertedData }
        });
    })
})
