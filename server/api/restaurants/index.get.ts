import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const queryCount = 6
const procesData = (data: any, client: any) => {
    
    data?.forEach((restaurant: any) => {

        if(restaurant.images){
            restaurant.images = restaurant.images.map((image: any) => {
                return client.storage.from(restaurant.bucket).getPublicUrl(image.Path)
            })
        }
        
        restaurant.thumbnail = client.storage.from(restaurant.bucket).getPublicUrl(restaurant.thumbnail)

        restaurant.bucket = undefined
        restaurant.owner_id = undefined
        restaurant.prijs = restaurant.prijs == "Laag" ? "€" : restaurant.prijs == "Gemiddeld" ? "€€" : "€€€"
    })

    return data
}
const ReturnResult = (resolve: any, reject: any, data: any, pagina: any, totalPages: any) => {

    if (data.length > 0) return resolve({
        currentPage: Number(pagina),
        totalPages: totalPages,
        restaurants: data,
    })

    return reject({
        statusCode: 404,
        statusMessage: "Not found",
        message: "No restaurants found"
    })
}

export default eventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const client = await serverSupabaseClient(event)
            const userclient: any = await serverSupabaseUser(event)
            const { pagina, stad, keuken, searchOwner }: any = getQuery(event)

            if (pagina) {
                if (stad) {
                    const { data, count }: any = await client
                        .from('restaurants_table')
                        .select('*', { count: 'exact' }).eq('plaats', stad)
                        .range((pagina - 1) * queryCount, pagina * queryCount - 1);

                    const totalPages = Math.ceil(count / queryCount);
                    procesData(data, client)
                    return ReturnResult(resolve, reject, data, pagina, totalPages)
                }

                const { data, count }: any = await client
                    .from('restaurants_table')
                    .select('*', { count: 'exact' })
                    .range((pagina - 1) * queryCount, pagina * queryCount - 1);

                const filteredData = data.filter((restaurant: any) => {
                    return restaurant.images && restaurant.images.length > 0 &&
                        restaurant.locatie && Object.keys(restaurant.locatie).length > 0 &&
                        restaurant.telefoon &&
                        restaurant.Openingstijden && Object.keys(restaurant.Openingstijden).length > 0;
                });

                const totalPages = Math.ceil(count / queryCount);
                procesData(filteredData, client)
                return ReturnResult(resolve, reject, filteredData, pagina, totalPages)
            }

            if (searchOwner) {
                const { data } = await client
                    .from('restaurants_table')
                    .select('*')
                    .eq('owner_id', userclient.id)
                    .order('beoordeling', { ascending: false })

                procesData(data, client)
                return resolve({
                    statusCode: 200,
                    statusMessage: "OK",
                    message: "Restaurant",
                    restaurants: data
                })
            }

            const { data }:any = await client
                .from('restaurants_table')
                .select('*')
                .limit(6)
                .order('beoordeling', { ascending: false })

            const filteredData = data.filter((restaurant: any) => {
                return restaurant.images && restaurant.images.length > 0 &&
                    restaurant.locatie && Object.keys(restaurant.locatie).length > 0 &&
                    restaurant.telefoon &&
                    restaurant.Openingstijden && Object.keys(restaurant.Openingstijden).length > 0;
            });

            procesData(filteredData, client)
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Top 6 restaurants",
                restaurants: filteredData
            })
        }, 100);
    })
})