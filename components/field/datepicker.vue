<template>
	<div class=" select-none">
		<Field tabindex="1" :name="name" class=" sr-only " type="date" v-model="date" disabled />
		<div class="flex justify-between items-center mb-2">
			<span @click="previousMonth">
				<Icon class="rotate-90" name="material-symbols:keyboard-arrow-down-rounded" size="2rem"></Icon>
			</span>
			<h2 class="font-semibold">{{ selectedDate.toLocaleString("nl-NL", { month: "long", year: "numeric" }).charAt(0).toUpperCase() + selectedDate.toLocaleString("nl-NL", { month: "long", year: "numeric" }).slice(1) }}</h2>
			<span @click="nextMonth">
				<Icon class="-rotate-90" name="material-symbols:keyboard-arrow-down-rounded" size="2rem"></Icon>
			</span>
		</div>
		<div class="grid grid-cols-7 mb-3">
			<div v-for="(day, index) in daysOfWeek" :key="index" class="items-center flex justify-center">
				{{ day }}
			</div>
			<button v-for="day in daysInMonth" :key="day" :disabled="isPastDay(day)" tabindex="0" @keydown.enter="isPastDay(day) ? '' : selectDay(day)" @click="isPastDay(day) ? '' : selectDay(day)" 
            class=" p-2 m-1 items-center transition-all delay-100 ease-in flex justify-center border rounded-md" :class="isPastDay(day) ? 'bg-gray-100 border-gray-100 text-gray-400 line-through cursor-not-allowed' : selected?.day === day && selected?.month === selectedDate.getMonth() + 1 && selected?.year === selectedDate.getFullYear() ? 'bg-[#4e995b] hover:bg-[#42834d] border-[#4e995b] text-white' : ' hover:bg-gray-200 border-gray-300 '">	
            {{ day }}
			</button>
		</div>
        <ErrorMessage class="mb-2 -mt-2 text-xs text-[#B92538] block" :name="name" />
	</div>
</template>

<script setup lang="ts">
	const currentDate = ref(new Date());
	const selectedDate = ref(new Date());

	const { name, selected, date } = defineModels<{
		name: string;
		selected: any
        date: any;
	}>();

    const daysOfWeek = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

    const daysInMonth = computed(() => {
        const date = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0);
        return Array.from({ length: date.getDate() }, (empty, day) => day + 1);
    });

    if (selected.value && selected.value.month && selected.value.year) {
        selectedDate.value.setMonth(selected.value.month - 1);
        selectedDate.value.setFullYear(selected.value.year);
    }

	const isCurrentMonth = computed(() => {
		return selectedDate.value.getMonth() === currentDate.value.getMonth() && selectedDate.value.getFullYear() === currentDate.value.getFullYear();
	});

	const isPastDay = (day: number) => {
		const today = new Date();
		const selectedMonth = selectedDate.value.getMonth();
		const selectedYear = selectedDate.value.getFullYear();
		return (selectedMonth < today.getMonth() && selectedYear === today.getFullYear()) || selectedYear < today.getFullYear() || (selectedMonth === today.getMonth() && selectedYear === today.getFullYear() && day < today.getDate());
	};

	const nextMonth = () => {
		selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 1);
	};

	const previousMonth = () => {
		if (!isCurrentMonth.value) {
			selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1, 1);
		}
	};

	const selectDay = (day: number) => {
		date.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), day + 1).toISOString().split("T")[0];
        selected.value = {
            day: day,
            month: selectedDate.value.getMonth() + 1,
            year: selectedDate.value.getFullYear(),
        }
    };

</script>
