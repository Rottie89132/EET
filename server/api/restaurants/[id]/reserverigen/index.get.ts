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

        const { datum, live }: any = getQuery(event)
        const id = getRouterParams(event).id
        
        if (!user) {
            const { data, error }: any = await client.from('reserveringen_table').select('tijd, datum').eq("restaurant_id", id).order('created_at', { ascending: false })
            if (error) return {
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Geen reserveringen gevonden",
            };

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                reserveringen: await procesdata(data, client),
                auth: false
            })
        }

        if(live) {
            const { data, error }: any = await client.from('reserveringen_table').select('tijd, datum').eq("restaurant_id", id).order('created_at', { ascending: false })
            if (error) return {
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Geen reserveringen gevonden",
            };

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                reserveringen: await procesdata(data, client),
                auth: true
            })
        }

        if(datum) {
            const { data, error }: any = await client.from('reserveringen_table').select('*').eq("restaurant_id", id).eq("datum", datum).order('created_at', { ascending: false })
            if (error) return {
                statusCode: 404,
                statusMessage: "Not Found",
                message: "Geen reserveringen gevonden",
            };

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                reserveringen: await procesdata(data, client),
                auth: true
            })
        }



        const { data: restaurant, error: restaurantErorr }: any = await client.from('restaurants_table').select('*').eq("owner_id", user.id)
        if (restaurantErorr || restaurant.length == 0) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Geen toegan tot deze data",
        })

        const { data, error }: any = await client.from('reserveringen_table').select('*').eq("restaurant_id", id).order('created_at', { ascending: false })
        if (error) return {
            statusCode: 404,
            statusMessage: "Not Found",
            message: "Geen reserveringen gevonden",
        };

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            reserveringen: await procesdata(data, client),
            auth: true
        })
    })
})