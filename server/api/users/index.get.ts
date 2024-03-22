import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)
    const user: any = await serverSupabaseUser(event)

    const accessToken: any = getCookie(event, "sb-access-token")
    const refreshToken: any = getCookie(event, "sb-refresh-token")

    const currentSession: any = {
        refresh_token: refreshToken,
        access_token: accessToken
    }

    if (!user) {
        
        const { data, error } = await client.auth.refreshSession(currentSession)
        const { session, user }: any = data

        if (error) {
            setResponseStatus(event, 401)
            return {
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "You are not authorized to access this resource."
            }
        }

        setCookie(event, "sb-access-token", session.access_token, {
            maxAge: session.expires_in,
            secure: true,
            httpOnly: true
        })

        setCookie(event, "sb-refresh-token", session.refresh_token, {
            maxAge: 60 * 60 * 24 * 30,
            secure: true,
            httpOnly: true
        })

        return {
            statusCode: 200,
            statusMessage: "OK",
            user: user.user_metadata
        }
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        user: user.user_metadata
    }

});
