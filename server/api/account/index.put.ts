import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
        const server = serverSupabaseServiceRole(event);
        const user = await serverSupabaseUser(event);

        if (!user) return {
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to update your account."
        }

        const data = await readMultipartFormData(event);
        const readableData = await useReadable(data);

        if (!readableData) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Geen gegevens gevonden in het verzoek"
        })

        const { naam, files } = readableData;

        if (files.length >= 1) {

            files.forEach(async (file: any) => {

                if (file.data.length > 10000000) return reject({
                    statusCode: 413,
                    statusMessage: "Payload Te Groot",
                    message: "De server weigert het verzoek te verwerken omdat de payload van het verzoek groter is dan de server bereid of in staat is te verwerken."
                })

                if (!["image/png", "image/jpeg"].includes(file.type)) return reject({
                    statusCode: 415,
                    statusMessage: "Niet-ondersteund Media Type",
                    message: "Het verzoek heeft een media type dat de server of bron niet ondersteunt"
                })

            })

            if (user.user_metadata.avatar_url) {
                const { error } = await server.storage.from("avatars").upload(`${user.id}/avatar${files[0].filename.slice(files[0].filename.lastIndexOf('.'))}`, files[0].data)

                if (error) return reject({
                    statusCode: 500,
                    statusMessage: "Interne Serverfout",
                    message: "Er is een fout opgetreden bij het verwerken van het verzoek"
                })
            } 
            else {
                const { error } = await server.storage.from("avatars").update(`${user.id}/avatar${files[0].filename.slice(files[0].filename.lastIndexOf('.'))}`, files[0].data, {
                    upsert: true
                })

                if (error) return reject({
                    statusCode: 500,
                    statusMessage: "Interne Serverfout",
                    message: "Er is een fout opgetreden bij het verwerken van het verzoek"
                })
            }
        }

        if (files.length === 1 && naam != "undefined") {
            const { data } = server.storage.from('avatars').getPublicUrl(`${user.id}/avatar${files[0].filename.slice(files[0].filename.lastIndexOf('.'))}`)
            const { error } = await client.auth.updateUser({
                data: {
                    name: naam,
                    avatar_url: data.publicUrl
                }
            })

            if (error) return reject({
                statusCode: error.code,
                statusMessage: "Interne Serverfout",
                message: error.message
            })

        } else if (files.length === 1 && naam == "undefined") {
            const { data } = server.storage.from('avatars').getPublicUrl(`${user.id}/avatar${files[0].filename.slice(files[0].filename.lastIndexOf('.'))}`)
            const { error } = await client.auth.updateUser({
                data: {
                    avatar_url: data.publicUrl
                }
            })

            if (error) return reject({
                statusCode: error.code,
                statusMessage: "Interne Serverfout",
                message: error.message
            })


        } else if (files.length < 0 && naam != "undefined") {
            const { error } = await client.auth.updateUser({
                data: {
                    name: naam,
                }
            })

            if (error) return reject({
                statusCode: error.code,
                statusMessage: "Interne Serverfout",
                message: error.message
            })
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Account succesvol bijgewerkt"
        })
    })
});
