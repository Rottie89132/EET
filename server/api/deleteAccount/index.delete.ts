import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    
    if (event.method !== 'DELETE') {
        return {
            statusCode: 405,
            statusMessage: "Method Not Allowed",
            message: "Only DELETE requests are allowed on this endpoint."
        };
    }


    try {
        const { error } = await client
            .from('users')
            .delete()
            .eq('id', event.user.id);

        if (error) {
            return {
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Failed to delete user account."
            };
        }

        return {
            statusCode: 200,
            statusMessage: "OK",
            message: "User account deleted successfully."
        };
    } catch (error) {
        return {
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: error.message
        };
    }
});
