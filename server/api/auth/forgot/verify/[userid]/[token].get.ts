import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const client = serverSupabaseServiceRole(event)
        const { userid, token } = getRouterParams(event)
        const data: Record<string, any> | null = await useStorage("ResetPasswordByUserId").getItem(token)

        if (!data) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Token niet gevonden",
        })

        if (data.user_id !== userid) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "Ongeldige token",
        })

        const { error } = await client.auth.admin.updateUserById(data.user_id, {
            password: data.password,
        })

        if (error) return reject({
            statusCode: 500,
            statusMessage: "Interne serverfout",
            message: "Er is een fout opgetreden",
        })

        await useStorage("ResetPasswordByUserId").removeItem(token)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Wachtwoord gewijzigd",
        })

    })
})

