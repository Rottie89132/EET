import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
    const user: any = await serverSupabaseUser(event)

    if(!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Je moet ingelogd zijn om een recensie te plaatsen"
    }

    const client: any = serverSupabaseServiceRole(event)
    const id = getRouterParams(event).id

    const request = await readBody(event)
    const { recensie: beoordeling , beoordeling: steren} = request

    const { data, error } = await client.from('recensies_table').insert({ 
        restaurant_id: id,
        user_id: user.id,
        beoordeling,
        steren
    })


    const { data: updatedData }: any = await client.from('recensies_table').select('*').eq("restaurant_id", id)
    const totaalSteren: any = updatedData.reduce((totaal: any, recentie: { steren: any }) => totaal + recentie.steren, 0);
    const gemiddeldeSteren: any = totaalSteren / updatedData.length;
    const gemiddeldeSterenFormatted: any = gemiddeldeSteren.toFixed(1);
    await client.from('restaurants_table').update({ beoordeling: gemiddeldeSterenFormatted } as never).eq('id', id);

    if(!error) return{
        statusCode: 200,
        statusMessage: "OK",
        message: "Recensie toegevoegd",
    }

    return {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        message: "Recensie toevoegen mislukt"
    }

})




