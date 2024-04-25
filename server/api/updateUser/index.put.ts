import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    
    if (event.method !== 'PUT') {
        return {
            statusCode: 405,
            statusMessage: "Method Not Allowed",
            message: "Only PUT requests are allowed on this endpoint."
        };
    }

    let data;
    try {
        data = JSON.parse(event.body || '{}');
    } catch (error) {
        return {
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Invalid JSON format in request body."
        };
    }

    const { name } = data;
    console.log('Updating user name:', name);

    try {
        const { error } = await client
            .from('users')
            .update({ name })
            .eq('id', event.user.id);

        if (error) {
            return {
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Failed to update user's name."
            };
        }

        return {
            statusCode: 200,
            statusMessage: "OK",
            message: "User's name updated successfully."
        };
    } catch (error) {
        return {
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error.message
        };
    }
});
