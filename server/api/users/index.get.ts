import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

interface Session {
    refresh_token: string
    access_token: string
}

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)
        const user = await serverSupabaseUser(event)

        const accessToken = getCookie(event, "sb-access-token")
        const refreshToken = getCookie(event, "sb-refresh-token")

        const currentSession: Session = {
            refresh_token: refreshToken as string,
            access_token: accessToken as string
        }

        if (!user) {
            const { data, error } = await client.auth.refreshSession(currentSession)
            const { session, user }: any = data

            if (error) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Je bent niet gemachtigd om toegang te krijgen tot deze bron."
            })
            
            setCookie(event, "sb-access-token", session.access_token, {
                maxAge: 60 * 60 * 24,
                secure: true,
                httpOnly: true
            })

            setCookie(event, "sb-refresh-token", session.refresh_token, {
                maxAge: 60 * 60 * 24 * 30,
                secure: true,
                httpOnly: true
            })

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                user: user?.user_metadata
            })
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            user: user?.user_metadata
        })
    });
});
