import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler( (event) => {
    return new Promise( (resolve, reject) => {
        setTimeout(async () => {
            const user: any = await serverSupabaseUser(event)
            const client: any = await serverSupabaseClient(event)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Je bent niet geautoriseerd om toegang te krijgen tot deze bron."
            })

            const data = await readMultipartFormData(event);
            const readableData = await useReadable(data);
            const thumbnail: string[] | any = []
            const images: string[] = []
            const menu: string[] | any = []

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
                    statusMessage: "Payload Te Groot",
                    message: "De server weigert het verzoek te verwerken omdat de payload van het verzoek groter is dan de server bereid of in staat is te verwerken."
                })

                if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) return reject({
                    statusCode: 415,
                    statusMessage: "Niet-ondersteund Media Type",
                    message: "Het verzoek heeft een media type dat de server of bron niet ondersteunt"
                })

                if (file.name.includes('thumbnail')) {
                    thumbnail.push(file)
                }

                if (file.name.includes('afbeeldingen')) {
                    images.push(file)
                }

                if (file.name.includes('menu')) {
                    menu.push(file)
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
                thumbnail: `${naam}/${naam}${thumbnail[0].filename.slice(thumbnail[0].filename.lastIndexOf('.'))}`,
                menu: `${naam}/${naam}-Menu${menu[0].filename.slice(menu[0].filename.lastIndexOf('.'))}`,
                images: formattedImages,
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

                }

                else if (file.name.includes('menu')) {
                    const { error: storageError } = await client.storage.from('restaurants').upload(`${naam}/${naam}-Menu${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data, {
                        contentType: 'application/pdf'
                    })
                    if (storageError) return reject({
                        statusCode: 500,
                        statusMessage: "Internal Server Error",
                        message: "Er is een fout opgetreden bij het verwerken van de aanvraag"
                    })
                }

                else {
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
                message: "Restaurant succesvol toegevoegd",
            })
        }, 1000);
    })
})
