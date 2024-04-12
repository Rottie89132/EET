import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)
        const id = getRouterParams(event).id

        const { data }: any = await client.from('restaurants_table').select('*').eq("id", id).single();

        if (data) {
            if (data.images) {
                data.images = data.images.map((image: any) => {
                    return client.storage.from(data.bucket).getPublicUrl(image.Path)
                })
            }

            data.thumbnail = client.storage.from(data.bucket).getPublicUrl(data.thumbnail)
            data.bucket = undefined
            data.owner_id = undefined
            data.prijs = data.prijs == "Laag" ? "€" : data.prijs == "Gemiddeld" ? "€€" : "€€€"

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Restaurant found",
                restaurant: data
            })

        }

        return reject({
            statusCode: 404,
            statusMessage: "Not found",
            message: "Restaurant not found"
        })
    })
})