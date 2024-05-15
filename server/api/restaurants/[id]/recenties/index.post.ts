import { serverSupabaseServiceRole, serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default eventHandler((event) => {
    return new Promise( (resolve, reject) => {
        setTimeout( async() => {
            const user: any = await serverSupabaseUser(event)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Je moet ingelogd zijn om een recensie te plaatsen"
            })

            const server = serverSupabaseServiceRole(event)
            const client: any = await serverSupabaseClient(event)
            const id = getRouterParams(event).id

            const request = await readBody(event)
            const { recensie: beoordeling, beoordeling: steren } = request

            const { data, error } = await client.from('recensies_table').insert({
                restaurant_id: id, user_id: user.id, beoordeling, steren
            })

            const { data: updatedData }: any = await client.from('recensies_table').select('*').eq("restaurant_id", id)
            const totaalSteren: any = updatedData.reduce((totaal: any, recentie: { steren: any }) => totaal + recentie.steren, 0);
            const gemiddeldeSteren: any = totaalSteren / updatedData.length;
            const gemiddeldeSterenFormatted: any = gemiddeldeSteren.toFixed(1) || steren;
            console.log(gemiddeldeSterenFormatted)
            await server.from('restaurants_table').update({ beoordeling: gemiddeldeSterenFormatted } as never).eq('id', id);

            console.log(error)

            if (!error) return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Recensie toegevoegd",
            });

            return reject({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                message: "Recensie toevoegen mislukt"
            });
        }, 1000);
    })
})



