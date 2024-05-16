import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client: any = await serverSupabaseClient(event)
        const server: any = serverSupabaseServiceRole(event)
        const user: any = await serverSupabaseUser(event)
        const id = getRouterParams(event).id

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

        const {
            naam, keuken, telefoon, beschrijving,
            prijs, stad, locatie, openingstijden, tafels, capaciteit, duur, files
        } = readableData;

        const openingstijdenFormated = openingstijden.map(({ dag, open, sluit }: { dag: string, open: string, sluit: string }) => ({
            dag, tijd: `${open} - ${sluit}`
        }));

        const {  error: restaurantError }: any = await client.from("restaurants_table").select("*").eq("id", id).eq('owner_id', user.id).single()

        if (restaurantError) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "Je hebt geen toegang tot deze bron"
        })

        files.forEach((file: any) => {

            if (file.type !== "application/octet-stream") {
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
            }
        })

        const { error }: any = await server.from("restaurants_table").update({
            naam,
            keuken, 
            telefoon, 
            beschrijving, 
            prijs, 
            plaats: stad, 
            locatie, 
            Openingstijden: openingstijdenFormated, 
            aantaltafels: tafels, 
            capaciteit, 
            duur
        }).eq("id", id).eq("owner_id", user.id).select()

        if (error) return reject({
            statusCode: error.code,
            statusMessage: "Internal Server Error",
            message: error.message
        })

        files.forEach(async (file: any, index: number) => {

            if (file.type !== "application/octet-stream") {

                if (file.name.includes('afbeeldingen')) {
                    const { error: storageError } = await server.storage.from('restaurants').update(`${naam}/${naam}-Food${index}${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data, {
                        upsert: true
                    })

                    if (storageError) return reject({
                        statusCode: storageError.code,
                        statusMessage: "Internal Server Error",
                        message: storageError.message
                    })
                }

                if (file.name.includes('menu')) {

                    const { error: storageError } = await server.storage.from('restaurants').update(`${naam}/${naam}-Menu${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data, {
                        contentType: 'application/pdf',
                        upsert: true
                    })

                    if (storageError) return reject({
                        statusCode: storageError.code,
                        statusMessage: "Internal Server Error",
                        message: storageError.message
                    })
                }

                else {
                    const { error: storageError } = await server.storage.from('restaurants').update(`${naam}/${naam}${file.filename.slice(file.filename.lastIndexOf('.'))}`, file.data, {
                        upsert: true
                    })

                    if (storageError) return reject({
                        statusCode: storageError.code,
                        statusMessage: "Internal Server Error",
                        message: storageError.message
                    })
                }
            }
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Restaurant succesvol aangepast."
        })
    })
})
