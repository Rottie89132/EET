import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const user: any = await serverSupabaseUser(event);
        const client = serverSupabaseServiceRole(event);

        const { data, error } = await client.auth.admin.deleteUser(user.id);

        if (error) return reject({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "Failed to delete user account."
        });

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "User account deleted successfully."
        });
    })
});
