import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
        const user = await serverSupabaseUser(event);

        if (!user) return {
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to update your account."
        }

        const request = await readBody(event)
        await client.auth.updateUser({
            data: {
                name: request.name
            }
        })

        return resolve({
            statusCode: 200,
            statusMessage: "Unauthorized",
            message: "Gebruiker aangemaakt",
        })
    })

});
