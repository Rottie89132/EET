import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

const procesdata = async (data: any, client: any) => {
    return await Promise.all(data.map(async (item: any) => {
        const restaurant = await client.from("restaurants_table").select("*").eq("id", item.restaurant_id)	
        return {
            tijd: item.tijd,
            datum: item.datum,
            personen: item.personen,
            restaurant: restaurant.data.map((rest: any) => ({
                id: rest.id,
                naam: rest.naam,
                plaats: rest.plaats,
                keuken: rest.keuken,
                locatie: rest.locatie,
                tel: rest.telefoon,
                thumbnail: client.storage.from(rest.bucket).getPublicUrl(rest.thumbnail),
            }))
        };
    }));
}

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client = serverSupabaseServiceRole(event)
        const user: any = await serverSupabaseUser(event)
        const status = getQuery(event).status

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Gebruiker niet gevonden",
        })


        let returnData: any = []
        const { data, error }: any = await client.from("reserveringen_table").select("*").eq("user_id", user.id).order("datum", { ascending: true })

        if (status == "history") returnData = data.filter((reservering: any) => new Date(reservering.datum + 'T' + reservering.tijd) < new Date())
        else returnData = data.filter((reservering: any) => new Date(reservering.datum + 'T' + reservering.tijd) > new Date())

        if (!error) return resolve({
            statusCode: 200,
            statusMessage: "OK",
            reserveringen: await procesdata(returnData, client),
        })

        return reject({
            statusCode: 500,
            statusMessage: "Interne serverfout",
            message: "Er is een fout opgetreden",
        })
    })
})