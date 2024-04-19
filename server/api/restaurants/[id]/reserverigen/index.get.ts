import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

const procesdata = async (data: any, client: any) => {
    return await Promise.all(data.map(async (item: any) => {
        return {
            ...item,
        };
    }));
}

export default eventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = serverSupabaseServiceRole(event)
        const user: any = await serverSupabaseUser(event)

        const id = getRouterParams(event).id
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You are not authorized to view this data",
        })

        const { data: restaurant, error: restaurantErorr }: any = await client.from('restaurants_table').select('*').eq("owner_id", user.id)
        if (restaurantErorr || restaurant.length == 0) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "You are not authorized to view this data",
        })

        const { data, error }: any = await client.from('reserveringen_table').select('*').eq("restaurant_id", id).order('created_at', { ascending: false })
        if (error) return {
            statusCode: 404,
            statusMessage: "Not Found",
            message: "No reserveringen found",
        };

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            reserveringen: await procesdata(data, client),
        })
    })
})