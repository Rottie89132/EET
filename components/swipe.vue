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
		
			<swiper-slide v-for="(image, index) in images" :key="index">
                <NuxtImg alt="Burger" draggable="false" class="w-full h-auto" width="500" height="300" style="aspect-ratio: 500 / 300; object-fit: cover" :src="image.data.publicUrl ?? ''" />
            </swiper-slide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		images: Object,
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

	onUnmounted(() => {
		window.removeEventListener("resize", () => {
			
		});
	});



</script>


