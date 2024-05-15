import { serverSupabaseClient } from '#supabase/server'
const { RedirectUrl } = useRuntimeConfig()

export default eventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const client = await serverSupabaseClient(event)

            const { email, password, confirmatie } = await readBody(event)

            if (!email || !password || !confirmatie) return reject({
                statusCode: 400,
                statusMessage: "Foute aanvraag",
                message: "Ontbrekende parameters"
            })

            if (password !== confirmatie) return reject({
                statusCode: 400,
                statusMessage: "Foute aanvraag",
                message: "Wachtwoorden komen niet overeen"
            })

            const { data, error } = await client.auth.signUp({
                email, password, options: {
                    emailRedirectTo: `${RedirectUrl}/confirm`,
                }
            })

            if (error) return reject({
                statusCode: 400,
                statusMessage: "Foute aanvraag",
                message: error.message
            })

            return resolve({
                statusCode: 200,
                message: "Gebruiker aangemaakt",
                email: data?.user?.email
            })
        }, 1000)
    })
})
