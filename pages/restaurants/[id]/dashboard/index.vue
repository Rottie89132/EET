<template>
	<div class="h-screen">
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div class="p-8 mt-12">
			<div class="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
				<div v-if="data && data.reserveringen.length > 0" v-for="reservering in  data.reserveringen" :key="reservering.tijd" class="w-full p-4 bg-slate-50 rounded-xl shadow-md">
					<div>
						<h2 class="text-xl font-bold">{{ reservering.naam }}</h2>
						<p class="text-sm opacity-85 mb-2 -mt-1">{{ reservering.email }}</p>
						<hr class="my-3" />
						<div class="flex items-center justify-start gap-2 mt-1 mb-3 text-white text-sm">
							<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
								<icon name="material-symbols:calendar-month-outline-rounded" size="1.1em" />
								{{ reservering.datum.split("-").reverse().join("-") }}
							</p>
							<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
								<icon name="material-symbols:nest-clock-farsight-analog-rounded" size="1.1em" />
								{{ reservering.tijd.slice(0, 5) }}
							</p>
							<p class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
								<Icon name="material-symbols:emoji-people" size="1.1em" />
								x {{ reservering.personen }}
							</p>
						</div>
					</div>
				</div>
				<div v-else class="w-full fixed left-0 h-[65vh]">
					<div class="flex flex-col items-center justify-center h-full w-full">
						<div class="flex flex-col items-center justify-center">
							<icon class="w-28 h-28 text-green-800" name="material-symbols:sad-tab-outline-rounded" size="1.5em" />
							<p class="text-sm opacity-55 font-bold">Er zijn geen reserveringen gevonden.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

	definePageMeta({
		middleware: "owner",
	});

	import type { RealtimeChannel } from "@supabase/supabase-js";

	const OkStatus = ref(false);
	const client = useSupabaseClient();
	const restaurantId = useRoute().params.id;
	let realtimeChannel: RealtimeChannel;

	const { data, refresh: refresh }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen`);

	onMounted(() => {
		realtimeChannel = client.channel("public:reserveringen").on("postgres_changes", { event: "*", schema: "public", table: "reserveringen_table" }, () => refresh());
		realtimeChannel.subscribe();
	});

	onUnmounted(() => {
		client.removeChannel(realtimeChannel);
	});
</script>

<style scoped></style>
