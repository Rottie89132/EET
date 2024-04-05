<template>
	<ClientOnly>
		<Transition name="modal">
			<div v-if="active" class="fixed top-0 z-50 flex items-end justify-center w-screen h-screen bg-black md:items-center bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" ref="modal">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="activeDelay">
							<div class="p-8 rounded-2xl bg-white w-screen md:w-[50vw] h-[60vh]">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">{{ title }}</h1>
									<button @click="closeModal" class="text-gray-500 hover:text-gray-700">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<slot></slot>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
	const { title, active, activeDelay } = defineModels<{
		active: Boolean;
		activeDelay: Boolean;
		title: String;
	}>();

	const modal = ref(null);

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	onClickOutside(modal, () => {
		closeModal();
	});
</script>

<style scoped>
	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.8s ease;
	}

	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
	}

	.modalDelay-enter-active,
	.modalDelay-leave-active {
		transition: all 1s ease;
	}

	.modalDelay-enter-from,
	.modalDelay-leave-to {
		opacity: 0;
		transform: translateY(12em);
	}

	.modalSlide-enter-active,
	.modalSlide-leave-active {
		transition: all 1s ease;
	}

	.modalSlide-enter-from,
	.modalSlide-leave-to {
		opacity: 0;
		transform: translatex(12em);
	}
</style>
