<template>
	<div class="select-none">
		<Field :name="name" tabindex="1" class="sr-only" type="time" v-model="time" />
		<div class="grid grid-cols-4 gap-2 mt-2 mb-4">
			<button v-for="hour in hours" :key="hour" :disabled="notAvailable(hour)" tabindex="0" @keydown.enter="notAvailable(hour) ? '' : selectedHour(hour)" @click="notAvailable(hour) ? '' : selectedHour(hour)" :class="notAvailable(hour) ? 'bg-gray-100 border-gray-100 text-gray-400 line-through cursor-not-allowed' : time === hour ? 'bg-[#4e995b] hover:bg-[#42834d] border-[#4e995b] text-white' : 'hover:bg-gray-200 border-gray-300'" class="flex items-center justify-center p-2 border transition-all delay-100 ease-in rounded-md">{{ hour }}</button>
		</div>
		<ErrorMessage class="mb-2 -mt-2 text-xs text-[#B92538] block" :name="name" />
	</div>
</template>

<script setup lang="ts">
	interface RestaurantDetails {
		Openingstijden: { dag: string; tijd: string }[];
		duur: number;
		aantaltafels: number;
	}

	const reservations = ref<Date[]>([]);

	const { date, restaurantDetails, name, time, pinBoardData } = defineModels<{
		date: any;
		restaurantDetails: RestaurantDetails;
		name: string;
		time: string;
		pinBoardData: any;
	}>();

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

	const hours = computed(() => {
		const dateDay = new Date(date.value).getDay();
		const dagen = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
		const times = restaurantDetails.value.Openingstijden.find((open: any) => open.dag === dagen[dateDay])?.tijd.split(" - ") ?? [];

		const startHour = parseInt(times[0].split(":")[0]);
		const endHour = parseInt(times[1].split(":")[0]);
		const hourRange = Array.from({ length: (endHour - startHour) * 2 }, (empty, i) => {
			const hour = startHour + Math.floor(i / 2);
			const minutes = i % 2 === 0 ? "00" : "30";
			return `${hour}:${minutes}`;
		});

		const latestReservationHour = endHour - restaurantDetails.value.duur;
		const latestReservationMinutes: any = "00";

		const filteredHourRange = hourRange.filter((hour) => {
			const [hourHour, hourMinutes] = hour.split(":").map(Number);
        
			const latestReservationDate = new Date(date.value);
			latestReservationDate.setHours(latestReservationHour, latestReservationMinutes);
			const selectedDate = new Date(date.value);
			selectedDate.setHours(hourHour, hourMinutes);
			return selectedDate <= latestReservationDate;
		});

		if (filteredHourRange.length === 0) return hourRange;
		return filteredHourRange;
	});

	const selectedHour = (hour: string) => {
		time.value = hour;
	};

	const notAvailable = (hour: string) => {
		const now = new Date();
		const SelectedDate = new Date(date.value).toISOString().split("T")[0];
		const [year, month, day] = SelectedDate.split("-").map(Number);
		const [hourHour, hourMinutes] = hour.split(":").map(Number);
		const selectedDate = new Date(year, month - 1, day, hourHour, hourMinutes);

		if (now > selectedDate) return true;

		const hoursLater = new Date(selectedDate.getTime() + restaurantDetails.value.duur * 60 * 60 * 1000);
		const hoursEarlier = new Date(selectedDate.getTime() - restaurantDetails.value.duur * 60 * 60 * 1000);
		const conflictingReservations = reservations.value.filter((res) => (res >= hoursEarlier && res < selectedDate) || (res >= selectedDate && res < hoursLater));

		return conflictingReservations.length >= restaurantDetails.value.aantaltafels;
	};
</script>
