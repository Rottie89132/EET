import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event)
        const id = getRouterParams(event).id

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Restaurant gevonden",
            restaurant: {}
        })
    })
})
