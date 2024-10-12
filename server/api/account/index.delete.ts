import { serverSupabaseUser, serverSupabaseServiceRole, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
        const server = serverSupabaseServiceRole(event);
        const { data: userdata }: Record<string, any> = await client.auth.getUser();
        const { user }: any = userdata

        const { data, error } = await server.auth.admin.deleteUser(user.id);

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
