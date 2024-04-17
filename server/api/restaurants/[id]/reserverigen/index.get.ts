import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

const procesdata = async (data: any, client: any) => {
    return await Promise.all(data.map(async (item: any) => {
        return {
            ...item,
        };
    }));
}

export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)
    const user = serverSupabaseUser(event)

    const id = getRouterParams(event).id

    const { data, error }: any = await client.from('reserveringen_table').select('*').eq("restaurant_id", id).order('created_at', { ascending: false })

    if (error) return {
        statusCode: 404,
        statusMessage: "Not Found",
        message: "No reserveringen found",
    };

    return await procesdata(data, client)

})