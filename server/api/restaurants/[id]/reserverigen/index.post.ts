import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { useCompiler } from '#vue-email'

export default eventHandler(async (event) => {

    const client = serverSupabaseServiceRole(event)
    const id = getRouterParams(event).id

    const request = await readBody(event)
    if (!request.datum || !request.tijd || !request.aantalPersonen || !request.email || !request.naam || !request.telefoon) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Missing required fields",
    }
    
    const SessionId = crypto.randomUUID()
    await useStorage("VerifyRequired").setItem(SessionId, { ...request })

    setTimeout(async () => {
        await useStorage("VerifyRequired").removeItem(SessionId)
    }, 30 * 60 * 1000);

    const { data, error }: any = await client.from("restaurants_table").select("naam").eq("id", id).single()
    
    if(!error) {
        const template = await useCompiler('Reservering.vue', {
            props: {
                url: `http://localhost:3000/restaurants/${id}/reserveringen/verify/${SessionId}`,
                restaurant: data.naam,
                name: request.naam,
                datum: request.datum,
                tijd: request.tijd,
                personen: request.aantalPersonen,
            }
        })

        await useMail({
            recepient: request.email,
            subject: "Bevestig uw reservering!",
            body: template,
        })

        return {
            statusCode: 200,
            statusMessage: "OK",
            message: "Reservering created",
        }
    } 

    return {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "An error occured",
    }
    
    
    
    
    

})