import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {

    const client:any = serverSupabaseServiceRole(event)
    const { id, token} = getRouterParams(event)

    const data: Record<string, any> | null = await useStorage("VerifyRequired").getItem(token)

    if(!data) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Token not found",
    }

    if(data.id !== id) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Invalid token",
    }

    const { error } = await client.from("reserveringen_table").insert({
        user_id: data.user_id || null,
        restaurant_id: id,
        tijd: data.tijd,
        datum: data.datum,
        personen: data.aantalPersonen,
        email: data.email,
        naam: data.naam,
        telefoon: data.telefoon,
    })

    if (error) return {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "An error occured",
    }

    await useStorage("VerifyRequired").removeItem(token)
    
    return{
        statusCode: 200,
        statusMessage: "OK",
        message: "Reservering created",
    }

})







