import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)
        const { credential } = await readBody(event)

        const { error, data } = await client.auth.signInWithIdToken({
            provider: "google",
            token: credential,
        });

        const { user, session }: any = data;

        setCookie(event, "sb-access-token", session.access_token, {
            maxAge: session.expires_in,
            httpOnly: true,
        });

        setCookie(event, "sb-refresh-token", session.refresh_token, {
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        if (error) return reject({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "The request could not be understood by the server due to malformed syntax."
        });

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            user
        });
    });
});

