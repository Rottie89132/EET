import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    const client = serverSupabaseServiceRole(event);

        const { data, error } = await client.auth.admin.deleteUser(user.id);

        console.log(error)
        console.log(data)

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
});
