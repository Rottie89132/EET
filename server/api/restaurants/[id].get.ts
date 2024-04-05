import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const id = getRouterParams(event).id

    const { data } = await client.from('restaurants_table').select('*').eq("id", id).single();
    return { restaurant: data }
})