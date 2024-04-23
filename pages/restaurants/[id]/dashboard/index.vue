<template>
	<div :class="!installed ? '' : 'h-screen'">
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div :class="!installed ? 'top-[4rem] sticky -mt-6' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-20 px-6 bg-white">
			<div :class="!installed ? ' top-[4rem] ' : ' top-[3.5rem]  '" class="z-10 bg-white fixed w-full pb-[0.10rem]">
				<h1 class="xl:text-3xl text-xl font-bold pt-5">Reserveringen</h1>
				<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht met alle reserveringen</p>
				<hr class="my-2 md:mt-6 mt-3" />
			</div>
		</div>
		<div :class="installed ? 'fixed w-screen h-full overflow-auto top-0' : ''">
			<div :class="!installed ? ' mt-[10.5rem]' : ' mt-[9rem]'" class="px-6">
				<section>
					<div :class="!installed ? ' top-[9rem] md:top-[10.8rem] md:mb-8  ' : ' top-[8.99em] '" class="z-10 bg-white sticky pb-[0.10rem] pt-2">
						<div class="md:max-w-[30vw]">
							<div :class="!installed ? '' : '-mt-[0.65rem]'" class="flex gap-2 py-1 bg-white items-center justify-between mb-2">
								<div class="flex bg-green-800 text-white rounded-lg w-full justify-between items-center">
									<span @click="previousMonth">
										<Icon class="rotate-90" name="material-symbols:keyboard-arrow-down-rounded" size="2rem"></Icon>
									</span>
									<h2 class="font-semibold">{{ selectedDate.toLocaleString("nl-NL", { month: "long", year: "numeric" }).charAt(0).toUpperCase() + selectedDate.toLocaleString("nl-NL", { month: "long", year: "numeric" }).slice(1) }}</h2>
									<span @click="nextMonth">
										<Icon class="-rotate-90" name="material-symbols:keyboard-arrow-down-rounded" size="2rem"></Icon>
									</span>
								</div>
								<button @click="hide" class="bg-gray-200 rounded-md flex items-center gap-1">
									<Icon :class="showAganda ? ' rotate-180' : ''" name="material-symbols:keyboard-arrow-down-rounded" size="2rem" />
								</button>
								<button @click="refresh" class="p-1 bg-gray-200 rounded-md flex items-center gap-1">
									<Icon :class="loading ? ' animate-spin' : ''" name="material-symbols:refresh" size="1.50rem" />
								</button>
							</div>
							<div v-if="showAganda" class="grid grid-cols-7 mb-3">
								<div v-for="(day, index) in daysOfWeek" :key="index" class="items-center flex justify-center">
									{{ day }}
								</div>
								<div v-for="day in previousMonthDays" :key="'empty-' + day" class="p-2 m-1 items-center transition-all delay-100 ease-in flex justify-center border rounded-md text-gray-400 cursor-not-allowed line-through">
									{{ day }}
								</div>
								<button @click="selectDate(day)" v-for="day in daysInMonth" :key="day" tabindex="0" :class="isToday(day) ? ' border-[#4e995b] bg-[#4e995b] text-white' : isSpecialDate(day) ? ' bg-gray-200 border-gray-300 hover:bg-gray-300 ' : ' hover:bg-gray-200 border-gray-300'" class="p-2 m-1 items-center transition-all delay-100 ease-in flex justify-center border rounded-md">
									{{ day }}
								</button>
								<div v-for="day in nextMonthDays" :key="'next-' + day" class="p-2 m-1 items-center transition-all delay-100 ease-in flex justify-center border rounded-md text-gray-400 cursor-not-allowed line-through">
									{{ day }}
								</div>
							</div>
							<hr class="pb-2 mt-3" />
						</div>
					</div>
					<div>
						<div v-if="reserveringen && reserveringen.length > 0" v-for="(reserveringenOpTijd, tijd) in gegroepeerdeReserveringen" :key="tijd" :class="!installed ? 'last:mb-5' : ' last:mb-24'" class="md:max-w-[60vw]">
							<h2 class="font-semibold flex p-1 px-2 bg-green-800 text-white rounded-lg">{{ tijd }}</h2>
							<hr class="my-2" />
							<div v-for="reservering in reserveringenOpTijd" class="rounded-lg">
								<div class="flex items-center justify-between gap-2 w-full">
									<div class="flex items-center gap-2 w-full">
										<div class="w-full">
											<div class="flex justify-between items-start w-full">
												<div>
													<h2 class="font-semibold flex items-center gap-1">
														{{ reservering.naam }}
													</h2>
													<p class="text-gray-600 leading-4 text-sm -mt-[0.15rem]">
														<a :href="`mailto:${reservering.email}`">
															{{ reservering.email }}
														</a>
													</p>
													<p class="text-blue-600 underline text-sm leading-4 mt-[0.15rem]">
														<a :href="`tel:${reservering.telefoon}`">
															{{ reservering.telefoon }}
														</a>
													</p>
												</div>
												<div class="flex items-center justify-center gap-2">
													<p class="gap-1 flex items-center justify-center rounded-md">
														<Icon name="material-symbols:emoji-people" size="1.1em" />
														x {{ reservering.personen }}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
								<hr class="my-2 mt-3" />
							</div>
						</div>
						<div v-else class="flex items-center justify-center md:justify-start w-full">
							<p class="text-gray-400">Geen reserveringen gevonden</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { RealtimeChannel } from "@supabase/supabase-js";

	definePageMeta({
		middleware: "owner",
	});

	const { $pwa } = useNuxtApp();
	const OkStatus = ref(false);
	const client = useSupabaseClient();
	const restaurantId = useRoute().params.id;
	const loading = ref(false);
	const installed = ref(false);
	const currentDate = ref(new Date());
	const selectedDate = ref(new Date());
	const showAganda = ref(true);
	const reserveringen: any = ref([]);
	let realtimeChannel: RealtimeChannel;

	const { data: pinBoardData, refresh: pinBoardRefresh }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen?live=true`);

	const { data }: any = await useFetch(`/api/restaurants/${restaurantId}/reserverigen?datum=${currentDate.value.toISOString()}`);
	reserveringen.value = data.value?.reserveringen;
	const daysOfWeek = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

	const gegroepeerdeReserveringen = computed(() => {
		const ongesorteerdeReserveringen = reserveringen.value.reduce((result: any, reservering: any) => {
			const tijd = reservering.tijd.slice(0, 5);
			if (!result[tijd]) {
				result[tijd] = [];
			}
			result[tijd].push(reservering);
			return result;
		}, {});

		const gesorteerdeReserveringen = Object.entries(ongesorteerdeReserveringen)
			.sort(([tijdA], [tijdB]) => tijdA.localeCompare(tijdB))
			.reduce((result: any, [tijd, reserveringen]) => {
				result[tijd] = reserveringen;
				return result;
			}, {});

		return gesorteerdeReserveringen;
	});

	const daysInMonth = computed(() => {
		const date = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0);
		return date.getDate();
	});

	const firstDayOfMonth = computed(() => {
		const date = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1);
		return date.getDay() === 0 ? 6 : date.getDay() - 1;
	});

	const lastDayOfPreviousMonth = computed(() => {
		const date = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 0);
		return date.getDate();
	});

	const previousMonthDays = computed(() => {
		const days = [];
		for (let i = 0; i < firstDayOfMonth.value; i++) days.unshift(lastDayOfPreviousMonth.value - i);
		return days;
	});

	const totalDaysInGrid = computed(() => {
		return 7 * Math.ceil((firstDayOfMonth.value + daysInMonth.value) / 7);
	});

	const nextMonthDays = computed(() => {
		const days = [];
		for (let i = 1; i <= totalDaysInGrid.value - firstDayOfMonth.value - daysInMonth.value; i++) days.push(i);
		return days;
	});

	const isCurrentMonth = computed(() => {
		return selectedDate.value.getMonth() === currentDate.value.getMonth() && selectedDate.value.getFullYear() === currentDate.value.getFullYear();
	});

	const isToday = (day: number) => {
		const today = new Date();
		return selectedDate.value.getFullYear() === today.getFullYear() && selectedDate.value.getMonth() === today.getMonth() && day === today.getDate();
	};

	const isSpecialDate = (day: number) => {
		const selectedMonth = selectedDate.value.getMonth() + 1;
		const selectedYear = selectedDate.value.getFullYear();
		const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		return pinBoardData.value.reserveringen.some((item: any) => item.datum === dateStr);
	};

	const selectDate = (day: number) => {
		selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), day + 1);
		loading.value = true;

		setTimeout(async () => {
			const data: any = await $fetch(`/api/restaurants/${restaurantId}/reserverigen?datum=${selectedDate.value.toISOString()}`);
			reserveringen.value = data.reserveringen;
			loading.value = false;
		}, 800);
	};

	const refresh = () => {
		loading.value = true;
		setTimeout(async () => {
			await pinBoardRefresh();
			const data: any = await $fetch(`/api/restaurants/${restaurantId}/reserverigen?datum=${selectedDate.value.toISOString()}`);
			reserveringen.value = data.reserveringen;
			loading.value = false;
		}, 600);
	};

	const hide = () => (showAganda.value = !showAganda.value);
	const nextMonth = () => (selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1));
	const previousMonth = () => {
		if (!isCurrentMonth.value) selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
	};

	onMounted(() => {
		if ($pwa?.isPWAInstalled) installed.value = true;
		realtimeChannel = client.channel("public:reserveringen").on("postgres_changes", { event: "*", schema: "public", table: "reserveringen_table" }, () => {
			pinBoardRefresh();
			refresh();
		});
		realtimeChannel.subscribe();
	});

	onUnmounted(() => {
		client.removeChannel(realtimeChannel);
	});
</script>
: { [x: string]: any[]; }: { tijd: string | any[]; }
