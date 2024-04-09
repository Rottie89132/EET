<template>
	<div class=" z-10">
		<Swiper
			:modules="[SwiperAutoplay, SwiperPagination, SwiperNavigation]"
			:slides-per-view="!ismoble ? 3 : 1"
			:loop="true"
			:autoplay="{
				delay: 5000,
				disableOnInteraction: true
			}"
			:pagination="{
				clickable: true
			}"
            :navigation="true"
		>
			<swiper-slide>
				<NuxtImg alt="Burger" draggable="false" class="w-full h-auto" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="publicUrl" />
			</swiper-slide>
			<swiper-slide>
				<NuxtImg alt="Burger" draggable="false" class="w-full h-auto" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="publicUrl" />
			</swiper-slide>
			<swiper-slide>
				<NuxtImg alt="Burger" draggable="false" class="w-full h-auto" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="publicUrl" />
			</swiper-slide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		publicUrl: String,
	});

	const ismoble = ref(false);

	onMounted(() => {
		const Width = ref(window.innerWidth);

		ismoble.value = Width.value < 768;
		watch(Width, (newValue: any) => {
			ismoble.value = newValue < 768;
		});

		window.addEventListener("resize", () => {
			Width.value = window.innerWidth;
		});

	});



</script>


