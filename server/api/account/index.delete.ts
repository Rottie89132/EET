import { serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const user: any = await serverSupabaseUser(event);
        const client = serverSupabaseServiceRole(event);

        const { data, error } = await client.auth.admin.deleteUser(user.id);

        if (error) return reject({
            statusCode: error.code,
            statusMessage: "Internal Server Error",
            message: error.message
        });

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Account is verwijderd."
        });
    })
});
