<template>
	<div>
		<FormWizard @submit="onSubmit" :validation-schema="reserveringSchema">
			<div class="flex items-center justify-start gap-2 text-white text-sm">
				<p v-if="date" class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
					<icon name="material-symbols:calendar-month-outline-rounded" size="1.1em" />
					{{ date?.split("-").reverse().join("-") }}
				</p>
				<p v-if="time" class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
					<icon name="material-symbols:nest-clock-farsight-analog-rounded" size="1.1em" />
					{{ time }}
				</p>
				<p v-if="personen" class="p-1 px-2 gap-1 flex items-center justify-center rounded-md bg-[#4e995b]">
					<Icon name="material-symbols:emoji-people" size="1.1em" />
					x {{ personen }}
				</p>
			</div>
			<hr v-if="date" class="my-2 mb-4" />
			<FormStep>
				<FieldDatepicker name="datum" :pinBoardData v-model:selected="selected" v-model:date="date" />
			</FormStep>
			<FormStep>
				<FieldTimepicker name="tijd" :pinBoardData :date :restaurantDetails v-model:time="time" />
			</FormStep>
			<FormStep>
				<FieldPeoplepicker name="aantalPersonen" v-model:personen="personen" />
			</FormStep>
			<div v-if="route">
				<FormStep>
					<div :class="OkStatus && user?.user?.email ? ' sr-only' : ''">
						<FieldInput type="email" label="Email" name="email" v-model="email" />
					</div>
					<div :class="OkStatus && user?.user?.name ? ' sr-only' : ''">
						<FieldInput type="text" label="Naam" name="naam" v-model="naam" />
					</div>
					<FieldInput type="text" label="Telefoon" name="telefoon" value="06 12 34 56 78"
						v-model="telefoon" />
				</FormStep>
				<FormStep>
					<p class="text-gray-600 -mt-2 mb-2">Voordat je de reservering definitief maakt, controleer of de
						gegevens kloppen.</p>
					<FieldInput :disabled="true" type="email" label="Email" name="email" v-model="email" />
					<FieldInput :disabled="true" type="text" label="Naam" name="naam" v-model="naam" />
					<FieldInput :disabled="true" type="text" label="Telefoon" name="telefoon" value="06 12 34 56 78"
						v-model="telefoon" />
				</FormStep>
			</div>

			<p v-if="emailSend" class="text-green-800 text-sm leading-4 mb-5">reserverigen is gelukt! check je email
				voor de bevestiging.</p>
		</FormWizard>
	</div>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	import type { RealtimeChannel } from "@supabase/supabase-js";
	let realtimeChannel: RealtimeChannel;

	const reservations = ref<Date[]>([]);
	const client = useSupabaseClient();
	const phoneRegExp = /^[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$/;
	const email: any = ref();
	const naam: any = ref();
	const telefoon: any = ref();
	const date: any = ref();
	const selected: any = ref();
	const time: any = ref("");
	const personen: any = ref(0);
	const route = !useRoute().path.includes("/reserveringen");

	const { restaurantDetails, onSubmit, OkStatus, user, emailSend, ResturantId, ReserveringId } = defineModels<{
		restaurantDetails: any;
		onSubmit: any;
		OkStatus: any;
		user: any;
		emailSend: boolean;
		ResturantId: string;
		ReserveringId?: string;
	}>();

	const { data: pinBoardData, refresh: pinBoardRefresh } = await useFetch(`/api/restaurants/${ResturantId.value}/reserverigen?live=true`);
	const { data: reserverigenData, error: reserverigenError }: any = await useFetch(`/api/reserverigen?tab=upcoming`);

	if (!route) {
		const data: any = await $fetch(`/api/reserverigen/${ReserveringId.value}`);

		date.value = data.reservering.datum;
		time.value = data.reservering.tijd.split(":").slice(0, 2).join(":");
		personen.value = data.reservering.personen;
	}

	watch(
		pinBoardData,
		(newPinBoardData: any) => {
			reservations.value = newPinBoardData.reserveringen.map((res: any) => {
				const [year, month, day] = res.datum.split("-").map(Number);
				const [hour, minutes] = res.tijd.split(":").map(Number);
				return new Date(year, month - 1, day, hour, minutes);
			});
		},
		{ immediate: true }
	);

	if (user.value.statusCode == 200) {
		email.value = user.value.user.email;
		naam.value = user.value.user.name;
	}

	const isFutureDate = (value: any) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return value >= today;
	};

	const isFutureTime = (value: any) => {
		const now = new Date();
		const SelectedDate = new Date(date.value).toISOString().split("T")[0];
		const currentDate = now.toISOString().split("T")[0];

		if (SelectedDate !== currentDate) return true;
		const inputTime = new Date(`1970-01-01T${value}:00`);
		return now.getHours() < inputTime.getHours() || (now.getHours() === inputTime.getHours() && now.getMinutes() <= inputTime.getMinutes());
	};

	const isWithinOpeningHours = (value: any) => {
		const inputDate = new Date(date.value);
		const inputTime = new Date(`1970-01-01T${value}:00`);
		const inputDay = inputDate.toLocaleString("nl-NL", { weekday: "long" }).charAt(0).toUpperCase() + inputDate.toLocaleString("nl-NL", { weekday: "long" }).slice(1);
		const inputDayOpeningHours = restaurantDetails.value.Openingstijden.find((open: any) => open.dag === inputDay);

		if (!inputDayOpeningHours) return false;
		const [openingTime, closingTime] = inputDayOpeningHours.tijd.split(" - ").map((time: any) => new Date(`1970-01-01T${time}:00`));
		return inputTime >= openingTime && inputTime <= closingTime;
	};

	const isAvailable = (hour: any) => {
		const now = new Date();
		const SelectedDate = new Date(date.value).toISOString().split("T")[0];
		const [year, month, day] = SelectedDate.split("-").map(Number);
		const [hourHour, hourMinutes] = hour.split(":").map(Number);
		const selectedDate = new Date(year, month - 1, day, hourHour, hourMinutes);

		if (now > selectedDate) return false;

		const hoursLater = new Date(selectedDate.getTime() + restaurantDetails.value.duur * 60 * 60 * 1000);
		const hoursEarlier = new Date(selectedDate.getTime() - restaurantDetails.value.duur * 60 * 60 * 1000);
		const conflictingReservations = reservations.value.filter((res) => (res >= hoursEarlier && res < selectedDate) || (res >= selectedDate && res < hoursLater));

		return conflictingReservations.length < restaurantDetails.value.aantaltafels;
	};

	const notBooked = async (hour: any) => {
		

		if(reserverigenError.value) return true
		
		const reservations = reserverigenData.value.reserveringen;
		const SelectedDate = new Date(date.value).toISOString().split("T")[0];

		return !reservations.some((res: any) => res.datum === SelectedDate && res.tijd.substring(0, 5) === hour);
	};

	const reserveringSchema = [
		yup.object({
			datum: yup.date().test("isFutureDate", "Datum mag niet kleiner zijn dan vandaag", isFutureDate).required("Datum is verplicht"),
		}),
		yup.object({
			tijd: yup.string().test("isFutureTime", "Tijd mag niet kleiner zijn dan de huidige tijd", isFutureTime).test("isWithinOpeningHours", "Tijd moet binnen de openingstijden van het restaurant liggen", isWithinOpeningHours).test("isAvailable", "Tijd is niet beschikbaar", isAvailable).test("notBooked", "Je hebt deze tijd al geboekt", notBooked).required("Tijd is verplicht"),
		}),
		yup.object({
			aantalPersonen: yup.number().required("Aantal personen is verplicht").min(1, "Aantal personen moet minimaal 1 zijn").max(8, "Aantal personen mag maximaal 10 zijn"),
		}),
		yup.object({
			email: yup.string().email("email moet geldig zijn").required("E-mail is verplicht"),
			naam: yup.string().required("Naam is verplicht"),
			telefoon: yup.string().matches(phoneRegExp, "Telefoonnummer moet geldig zijn").required("Telefoonnummer is verplicht"),
		}),
	];

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});


	onMounted(() => {
		realtimeChannel = client.channel("public:reserveringen").on("postgres_changes", { event: "*", schema: "public", table: "reserveringen_table" }, () => pinBoardRefresh());
		realtimeChannel.subscribe();
	});

	onUnmounted(() => {
		client.removeChannel(realtimeChannel);
	});
</script>
