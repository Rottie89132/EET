<template>
	<Field :name="name" v-slot="{ handleChange, field, meta }">
		<label class="text-base font-bold text-neutral-900">{{ label }}</label>
		<div>
			<div class="grid grid-cols-2 gap-4 mb-2 text-sm">
				<div>
					<label class="font-semibold"> Werkdagen </label>
					<div class="flex items-center gap-2">
						<div>
							<input class="p-1 mt-1 bg-gray-100 border border-gray-100 rounded-md outline-none" @change="setWeekdayOpenTimes(handleChange, $event)" type="time" />
						</div>
						<div>
							<input class="p-1 mt-1 bg-gray-100 border border-gray-100 rounded-md outline-none" @change="setWeekdayCloseTimes(handleChange, $event)" type="time" />
						</div>
					</div>
				</div>
				<div>
					<label class="font-semibold"> Weekend </label>
					<div class="flex items-center gap-2">
						<div>
							<input class="p-1 mt-1 bg-gray-100 border border-gray-100 rounded-md outline-none" @change="setWeekendOpenTimes(handleChange, $event)" type="time" />
						</div>
						<div>
							<input class="p-1 mt-1 bg-gray-100 border border-gray-100 rounded-md outline-none" @change="setWeekendCloseTimes(handleChange, $event)" type="time" />
						</div>
					</div>
				</div>
			</div>
			<div>
				<hr class="my-2" />
				<h2 class="font-black">Werkdagen</h2>
				<div class="grid grid-cols-2 gap-4 mb-2 text-sm">
					<div v-for="(time, index) in openingTimes.filter((time) => ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'].includes(time.dag))" :key="time.dag">
						<label class="font-semibold" :for="`time-${time.dag}`">{{ time.dag }}</label>
						<div class="flex items-center gap-2">
							<div>
								<input :class="meta.touched && !meta.valid && time.open == undefined ? '  border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300'" class="p-1 mt-1 bg-white border rounded-md outline-none" @change="pick(handleChange)" v-model="time.open" type="time" />
							</div>
							<div>
								<input :class="meta.touched && !meta.valid && time.sluit == undefined ? ' border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300'" class="p-1 mt-1 bg-white border rounded-md outline-none" v-model="time.sluit" @change="pick(handleChange)" type="time" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="">
				<hr class="my-2" />
				<h2 class="font-black">Weekend</h2>
				<div class="grid grid-cols-2 gap-4 mb-2 text-sm">
					<div v-for="(time, index) in openingTimes.filter((time) => ['Zaterdag', 'Zondag'].includes(time.dag))" :key="time.dag">
						<label class="font-semibold" :for="`time-${time.dag}`">{{ time.dag }}</label>

						<div class="flex items-center gap-2">
							<div>
								<input :class="meta.touched && !meta.valid && time.open == undefined ? '  border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300'" class="p-1 mt-1 bg-white border rounded-md outline-none" @change="pick(handleChange)" v-model="time.open" type="time" />
							</div>
							<div>
								<input :class="meta.touched && !meta.valid && time.sluit == undefined ? ' border-[#B92538] focus:border-[#B92538] ' : ' border-gray-300'" class="p-1 mt-1 bg-white border rounded-md outline-none" v-model="time.sluit" @change="pick(handleChange)" type="time" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ErrorMessage v-if="!meta.valid" class="mb-1 mt-1 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</Field>
</template>

<script setup lang="ts">
	import { useField } from "vee-validate";
	const { name, openingTimes, label } = defineModels<{
		name: string;
		openingTimes: Array<{ dag: string; open: string; sluit: string }>;
		label: string;
	}>();

	const { value }: any = useField<string>(name);
	value.value = openingTimes.value;

	const pick = (handleChange: Function) => {
		handleChange(openingTimes.value);
	};

	const setWeekdayOpenTimes = (handleChange: Function, event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		openingTimes.value.filter((time) => ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"].includes(time.dag)).forEach((time) => (time.open = value));
		pick(handleChange);
	};

	const setWeekdayCloseTimes = (handleChange: Function, event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		openingTimes.value.filter((time) => ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"].includes(time.dag)).forEach((time) => (time.sluit = value));
		pick(handleChange);
	};

	const setWeekendOpenTimes = (handleChange: Function, event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		openingTimes.value.filter((time) => ["Zaterdag", "Zondag"].includes(time.dag)).forEach((time) => (time.open = value));
		pick(handleChange);
	};

	const setWeekendCloseTimes = (handleChange: Function, event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		openingTimes.value.filter((time) => ["Zaterdag", "Zondag"].includes(time.dag)).forEach((time) => (time.sluit = value));
		pick(handleChange);
	};
</script>
