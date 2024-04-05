import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { email, password, confirmatie } = await readBody(event)

    if(!email || !password || !confirmatie) return {
        statusCode: 400,
        statusMessage: "Bad request",
        message: "Missing parameters"
    }

    if (password !== confirmatie) return {
        statusCode: 400,
        statusMessage: "Bad request",
        message: "Passwords do not match"
    }

    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: "http://localhost:3000/confirm",
        }
    })

    if (error) return {
        statusCode: 400,
        statusMessage: "Bad request",
        message: error.message
    }

    return {
        statusCode: 200,
        message: "User created",
        email: data?.user?.email
    }

})