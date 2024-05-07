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
        const images: string[] = []

        if (!readableData) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Geen gegevens gevonden in het verzoek"
        })

        const { 
            naam, keuken, telefoon, beschrijving, prijs, stad, locatie,
            openingstijden, tafels, capaciteit, duur, files 
        } = readableData;

        const openingstijdenFormated = openingstijden.map(({ dag, open, sluit }: { dag: string, open: string, sluit: string }) => ({
            dag, tijd: `${open} - ${sluit}`
        }));

        if (!files) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Geen bestanden gevonden in het verzoek"
        })

        files.forEach((file: any) => {

            if (file.data.length > 10000000) return reject({
                statusCode: 413,
                statusMessage: "Payload Too Large",
                message: "The server is refusing to process a request because the request payload is larger than the server is willing or able to process."
            })

            if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) return reject({
                statusCode: 415,
                statusMessage: "Unsupported Media Type",
                message: "The server is refusing to service the request because the payload is in a format not supported by this method on the target resource."
            })

            if (file.name.includes('afbeeldingen')) {
                images.push(file)
            }
        })

        const formattedImages = images.map((file: any, index) => {
            return {
                Path: `${naam}/${naam}-Food${index + 1}${file.filename.slice(file.filename.lastIndexOf('.'))}`,
            };
        });

        const { data: insertedData, error: insertError } = await client.from('restaurants_table').insert({
            naam, 
            keuken, 
            telefoon, 
            beschrijving, 
            prijs, 
            plaats: stad, 
            locatie,
            aantaltafels: tafels,
            capaciteit, 
            duur,
            Openingstijden: openingstijdenFormated,
            thumbnail: `${naam}/${naam}${files[0].filename.slice(files[0].filename.lastIndexOf('.'))}`,
            images: formattedImages
        }).select()

        if (insertError) return reject({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "Er is een fout opgetreden bij het verwerken van de aanvraag"
        })

        files.forEach(async (file: any, index: number) => {

            if (file.name.includes('afbeeldingen')) {
                const { error: storageError } = await client.storage.from('restaurants').upload(`${naam}/${naam}-Food${index}${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data)
                if (storageError) return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "Er is een fout opgetreden bij het verwerken van de aanvraag"
                })
                
            } else {
                const { error: storageError } = await client.storage.from('restaurants').upload(`${naam}/${naam}${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data)
                if (storageError) return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "Er is een fout opgetreden bij het verwerken van de aanvraag"
                })
            }
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Bestanden succesvol geüpload",
        })
    })
})
