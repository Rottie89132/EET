import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout( async () => {
            const client = await serverSupabaseClient(event)
            const { data: userdata }: Record<string, any> = await client.auth.getUser();
            const { user }: any = userdata
            const id = getRouterParams(event).id

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Gebruiker niet gevonden",
            })

            const { error }: any = await client.from("reserveringen_table").delete().eq("id", id)

            if (!error) return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Reservering verwijderd",
            })

            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Reservering niet gevonden",
            })
        }, 1000);
    })
})