import { serverSupabaseServiceRole } from '#supabase/server'

const procesdata = async (data: any, client: any) => {
    const processedData = await Promise.all(data.map(async (item: any) => {
        const user = await client.auth.admin.getUserById(item.user_id);
        return {
            ...item,
            restaurant_id: undefined,
            user: {
                full_name: user.data.user?.user_metadata.full_name ?? user.data.user?.email.split('@')[0],
                avatar_url: user.data.user?.user_metadata.avatar_url ?? "/image/placeholder.jpg"
            },
            user_id: undefined,
            created_at: new Date(item.created_at).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })
        };
    }));
    return processedData;
};


export default eventHandler(async (event) => {
    const client = serverSupabaseServiceRole(event)
    const id = getRouterParams(event).id

    const { data }: any = await client.from('recensies_table').select('*').eq("restaurant_id", id).order('created_at', { ascending: false })

    const procesed = await procesdata(data, client)

    if (procesed.length === 0) return {
        statusCode: 404,
        statusMessage: "Not Found",
        message: "No recenties found",
    };

    const totaalSteren: any = procesed.reduce((totaal, recentie) => totaal + recentie.steren, 0);
    const gemiddeldeSteren: any = totaalSteren / procesed.length;
    await client.from('restaurants_table').update({ beoordeling: gemiddeldeSteren } as never).eq('id', id);

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "Recenties found",
        recenties: procesed
    };


})




