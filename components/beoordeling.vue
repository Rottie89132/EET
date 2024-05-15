<template>
	<div>
		<div v-if="beoordelingen" v-for="beoordeling in beoordelingen" :class="!installed ? 'last:mb-5' : ' last:mb-24'"
			class="rounded-lg md:h-[10vh] px-3">
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<NuxtImg draggable="false" :src="beoordeling.user.avatar_url" alt="Profile"
						class="rounded-full w-7 h-7" />
					<div>
						<h2 class="font-semibold flex items-center gap-1">
							{{ beoordeling.user.full_name }}
							<span class="text-xs opacity-45">•
								{{ beoordeling.user.aantal > 1 ? `${beoordeling.user.aantal} recensies` :
								`${beoordeling.user.aantal} recensie` }}
							</span>
						</h2>
						<p class="text-gray-600 leading-4 -mt-1 text-sm">
							{{ beoordeling.created_at }}
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-bold">{{ beoordeling.steren }}/5</span>
				</div>
			</div>
			<p class="text-gray-400 md:max-w-[60vw] leading-4 whitespace-pre-wrap mt-1 mb-2 text-pretty text-sm">
				{{ beoordeling.beoordeling }}
			</p>
			<hr class="" />
		</div>
		<div v-else :class="!installed ? '' : 'mb-20'"></div>
	</div>
</template>

<script setup lang="ts">

	defineProps({
		beoordelingen: Object,
		installed: Boolean,
	});

</script>

<style scoped></style>
