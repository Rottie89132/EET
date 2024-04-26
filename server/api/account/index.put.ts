import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
        const user = await serverSupabaseUser(event);

        if (!user) return {
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You must be logged in to update your account."
        }

        const request = await readBody(event)
        console.log(request)
        await client.auth.updateUser({
            data: {
                name: "kaan"
            }
        })
        return resolve({
            statusCode: 200,
            statusMessage: "Unauthorized",
            message: "Gebruiker aangemaakt",
        })
    })




    // let data;
    // try {
    //     data = JSON.parse(event.body || '{}');
    // } catch (error) {
    //     return {
    //         statusCode: 400,
    //         statusMessage: "Bad Request",
    //         message: "Invalid JSON format in request body."
    //     };
    // }

    // const { name } = data;
    // console.log('Updating user name:', name);

    // try {
    //     const { error } = await client
    //         .from('users')
    //         .update({ name })
    //         .eq('id', event.user.id);

    //     if (error) {
    //         return {
    //             statusCode: 500,
    //             statusMessage: "Internal Server Error",
    //             message: "Failed to update user's name."
    //         };
    //     }

    //     return {
    //         statusCode: 200,
    //         statusMessage: "OK",
    //         message: "User's name updated successfully."
    //     };
    // } catch (error) {
    //     return {
    //         statusCode: 500,
    //         statusMessage: "Internal Server Error",
    //         message: error.message
    //     };
    // }
});
