
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {

        const client = await serverSupabaseClient(event)
        const { data: userdata }: Record<string, any> = await client.auth.getUser();
        const { user }: any = userdata
        const id = getRouterParams(event).id

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Gebruiker niet gevonden",
        })

        const { data, error }: any = await client.from("reserveringen_table").select("*").eq("id", id).eq("user_id", user.id).single()

        if (!error) return resolve({
            statusCode: 200,
            statusMessage: "OK",
            reservering: data
        })

        return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "Reservering niet gevonden",
        })

    })
})







