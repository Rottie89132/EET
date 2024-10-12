import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default eventHandler((event) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const client = await serverSupabaseClient(event);
			const { data: userdata }: Record<string, any> = await client.auth.getUser();
			const { user }: any = userdata
            const server = serverSupabaseServiceRole(event);
			const id = getRouterParams(event).id;

			if (!user) return reject({
				statusCode: 401,
				statusMessage: "Unauthorized",
				message: "Unauthorized",
			});

			const { data, error }: Record<string, any> = await client.from("restaurants_table").select("*").eq("id", id).eq('owner_id', user.id).single();
			if(error) return reject({
				statusCode: 403,
				statusMessage: "Forbidden",
				message: "Je hebt geen toegang tot deze bron"
			})

            await server.storage.from("restaurants").remove([data.menu]);
            await server.storage.from("restaurants").remove([data.thumbnail]);
			data.images.forEach(async (image: any) => {
                await server.storage.from("restaurants").remove([image.Path]);
			});

			await client.from("restaurants_table").delete().eq("id", id).eq('owner_id', user.id).single();

			return resolve({
				statusCode: 200,
				statusMessage: "OK",
				message: "Restaurant deleted successfully.",
			});
		}, 1000);
	});
});
