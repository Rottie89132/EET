import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";

export default eventHandler((event) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const client = await serverSupabaseClient(event);
            const server = serverSupabaseServiceRole(event);
			const id = getRouterParams(event).id;

			const { data, error }: Record<string, any> = await client.from("restaurants_table").select("*").eq("id", id).single();
			if (error)
				return reject({
					statusCode: error.code,
					statusMessage: "Internal Server Error",
					message: error.message,
				});

            await server.storage.from("restaurants").remove([data.menu]);
            await server.storage.from("restaurants").remove([data.thumbnail]);
			data.images.forEach(async (image: any) => {
                await server.storage.from("restaurants").remove([image.Path]);
			});

			await client.from("restaurants_table").delete().eq("id", id).single();

			return resolve({
				statusCode: 200,
				statusMessage: "OK",
				message: "Restaurant deleted successfully.",
			});
		}, 1000);
	});
});
