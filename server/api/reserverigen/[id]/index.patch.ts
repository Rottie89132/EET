import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const client: any = await serverSupabaseClient(event)
            const user: any = await serverSupabaseUser(event)
            const id = getRouterParams(event).id

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Gebruiker niet gevonden",
            })

            const request = await readBody(event)
            const { data, error }: any = await client.from("reserveringen_table").update({
                datum: request.datum, tijd: request.tijd, personen: request.aantalPersonen
            }).eq("id", id).eq("user_id", user.id)

            if (!error) return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Reservering aangepast",
            })

            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Reservering niet gevonden",
            })
        }, 1000)
    })
})