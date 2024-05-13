<template>
	<div>
		<div :class="beoordelingen.length < 1 ? ' mb-24' : ''" class="bg-[#f3f4f3] mt-3 rounded-lg md:max-w-[60vw] p-3">
			<div class="flex gap-2 justify-between items-center">
				<div class="flex items-center justify-center gap-4">
					<div class="w-24 h-24 md:w-32 md:h-32">
						<svg class="w-full h-full" viewBox="0 0 100 100">
							<circle class="text-gray-200 stroke-current" stroke-width="5" cx="50" cy="50" r="40" fill="transparent"></circle>
							<circle class="text-[#4e995b] progress-ring__circle stroke-current" stroke-width="5" stroke-linecap="round" cx="50" cy="50" r="40" fill="transparent" :stroke-dashoffset="strokeDashOffset" :stroke-dasharray="strokeDashArray"></circle>
							<text x="50" y="50" font-family="Verdana" font-size="16" text-anchor="middle" alignment-baseline="middle">{{ restaurantDetails?.beoordeling?.toFixed(1) }}/5</text>
						</svg>
					</div>
					<div class="">
						<p class="text-[#4e995b] font-bold mt-1">
							{{ percentage > 0 && percentage < 10 ? "Zeer slecht" : percentage >= 10 && percentage < 20 ? "Slecht" : percentage >= 20 && percentage < 30 ? "Matig" : percentage >= 30 && percentage < 40 ? "Redelijk" : percentage >= 40 && percentage < 50 ? "Gemiddeld" : percentage >= 50 && percentage < 60 ? "Voldoende" : percentage >= 60 && percentage < 70 ? "Goed" : percentage >= 70 && percentage < 80 ? "Zeer goed" : percentage >= 80 && percentage < 90 ? "Uitstekend" : percentage >= 90 && percentage <= 100 ? "Perfect" : " Nog geen beoordelingen" }}
						</p>
						<p class="text-gray-400 text-sm -mt-1">Gebaseerd op {{ beoordelingen?.length }} recensies</p>
						<ClientOnly>
							<div class="flex gap-2 -mt-1">
								<button v-if="OkStatus" @click="openrecensiemodal" class="flex items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
								<button v-else class="flex opacity-50 cursor-not-allowed items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
								<button @click="toonDetailsHandler" class="flex items-center text-sm justify-center text-[#4e995b] p-[0.15rem] px-4 border-2 border-[#4e995b] rounded-lg mt-2">{{ toonDetails ? "Minder" : "Meer" }}</button>
							</div>
							<template #fallback>
								<div class="flex gap-2 -mt-1">
									<button class="flex opacity-50 cursor-not-allowed items-center text-sm justify-center text-white p-[0.15rem] px-4 bg-[#4e995b] rounded-lg mt-2">Beoordeel</button>
									<button @click="toonDetailsHandler" class="flex items-center text-sm justify-center text-[#4e995b] p-[0.15rem] px-4 border-2 border-[#4e995b] rounded-lg mt-2">{{ toonDetails ? "Minder" : "Meer" }}</button>
								</div>
							</template>
						</ClientOnly>
					</div>
				</div>
			</div>
			<Transition name="details">
				<div v-if="toonDetails">
					<hr class="pb-2 mt-2" />
					<div>
						<div v-for="i in reverseRatings" :key="i" class="-mb-1">
							<div class="flex items-center mb-1">
								<div>{{ i }}</div>
								<div class="w-full bg-gray-200 ml-2 rounded">
									<div :class="beoordelingen.length > 0 ? 'bg-green-700' : ''" class="h-3 rounded" :style="{ width: `${(beoordelingen.filter((b: any) => b.steren === i).length / beoordelingen.length) * 100}%` }"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
	const toonDetails = ref(false);
	const percentage = ref();

	const { beoordelingen, restaurantDetails, OkStatus, openrecensiemodal } = defineModels<{
		beoordelingen: string[];
		restaurantDetails: any;
		OkStatus: any;
		openrecensiemodal: any;
	}>();

	const toonDetailsHandler = () => {
		toonDetails.value = !toonDetails.value;
	};

	percentage.value = (restaurantDetails.value.beoordeling / 5) * 100;
	const strokeDashOffset = computed(() => {
		const circumference = 2 * Math.PI * 40;
		return circumference - (circumference * percentage.value) / 100;
	});

	const strokeDashArray = computed(() => {
		return 2 * Math.PI * 40;
	});

	const reverseRatings = computed(() => {
		return [5, 4, 3, 2, 1];
	});
</script>

<style scoped>
	.progress-ring__circle {
		stroke-dasharray: 250, 250;
		transition: stroke-dashoffset 0.35s;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}

	.details-enter-active,
	.details-leave-active {
		transition: all 0.5s ease;
	}

	.details-enter-from,
	.details-leave-to {
		opacity: 0;
	}
</style>
