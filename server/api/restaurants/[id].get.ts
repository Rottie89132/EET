import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const id = getRouterParams(event).id

    const { data }: any = await client.from('restaurants_table').select('*').eq("id", id).single();

    data.thumbnail = client.storage.from(data.bucket).getPublicUrl(data.thumbnail)
    data.bucket = undefined
    data.owner_id = undefined
    data.prijs = data.prijs == "Laag" ? "€" : data.prijs == "Gemiddeld" ? "€€" : "€€€"
    
    return { restaurant: data }
})