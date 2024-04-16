import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

const procesdata = async (data: any, client: any) => {
    return await Promise.all(data.map(async (item: any) => {
        const user = await client.auth.admin.getUserById(item.user_id);

        return {
            ...item,
            naam: undefined,
            email: undefined,
            telefoon: undefined,
            user: {
                full_name: user.data.user?.user_metadata.full_name ?? user.data.user?.email.split('@')[0],
                email: user.data.user?.user_metadata.email
            },
            created_at: new Date(item.created_at).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })
        };
    }));
}

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)
    const user = serverSupabaseUser(event)

    const id = getRouterParams(event).id

    const { data }: any = await client.from('reserveringen_table').select('*').eq("restaurant_id", id).order('created_at', { ascending: false })

    if (data.length === 0) return {
        statusCode: 404,
        statusMessage: "Not Found",
        message: "No reserveringen found",
    };

    return await procesdata(data, client)

})