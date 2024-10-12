import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client: any = serverSupabaseServiceRole(event)
        const { id, token } = getRouterParams(event)

        const data: Record<string, any> | null = await useStorage("VerifyRequired").getItem(token)
        
        if (!data) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Token niet gevonden",
        })

        if (data.id !== id) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Ongeldige token",
        })

        const { error } = await client.from("reserveringen_table").insert({
            user_id: data.user_id || null,
            restaurant_id: id,
            tijd: data.tijd,
            datum: data.datum,
            personen: data.aantalPersonen,
            email: data.email,
            naam: data.naam,
            telefoon: data.telefoon,
        })

        if (error) return reject({
            statusCode: 500,
            statusMessage: "Interne serverfout",
            message: "Er is een fout opgetreden",
        })

        await useStorage("VerifyRequired").removeItem(token)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Reservering aangemaakt",
        })
    })
})

