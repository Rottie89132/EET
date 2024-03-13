import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)

        const { error } = await client.auth.signOut()

        if (error) return reject({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "The request could not be understood by the server due to malformed syntax."
        });

        deleteCookie(event, "sb-access-token")
        deleteCookie(event, "sb-refresh-token")

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "You have been successfully logged out."
        });


    });
});
