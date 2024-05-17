<template>
	<ClientOnly>
		<Transition name="modal">
			<div v-if="active" class="fixed top-0 z-50 flex items-end justify-center w-screen h-screen bg-black md:justify-end md:items-end bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" ref="modal">
					<Transition :name="ismoble ? 'modalDelay' : 'modalSlide'">
						<div :ref="ismoble ? 'modalDelay' : 'modalSlide'" v-if="activeDelay">
							<div v-if="type == ''" class="p-8 md:h-screen rounded-2xl md:rounded-none bg-white w-screen md:max-w-[28vw]">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">Inloggen</h1>
									<button @click="closeModal" class="text-gray-500 hover:text-gray-700">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<p class="mb-4">Vul hieronder je gegevens in om in te loggen.</p>
								<Form @submit="handleRequest" :validation-schema="schema" v-slot="{ meta }">
									<FieldInput type="email" label="Email" name="email" v-model="email" />
									<FieldInput type="password" label="Wachtwoord" name="wachtwoord" v-model="password" />
									<span @click="forgotPassword" class="opacity-80 cursor-pointer">Wachtwoord vergeten</span>

									<div class="mb-4 mt-4 flex gap-2">
										<button class="w-full p-2 bg-[#4e995b] text-white rounded-md hover:bg-[#43874e] focus:outline-none" type="submit">
											<span v-if="displayLoading" class="">
												<icon class="animate-spin" name="pajamas:repeat" size="1.3rem"> </icon>
											</span>
											<span v-else>Inloggen</span>
										</button>
										<div @click="handleRegister" class="w-full text-center p-2 bg-gray-100 cursor-pointer rounded-md hover:bg-gray-200 focus:outline-none">Registreren</div>
									</div>
								</Form>

								<hr class="my-4" />
								<div class="flex w-full justify-center">
									<GoogleSignInButton @success="handleLoginSuccess"></GoogleSignInButton>
								</div>
							</div>
							<div v-else-if="type == 'register'" class="p-8 md:h-screen rounded-2xl md:rounded-none bg-white w-screen md:max-w-[28vw]">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">Registreren</h1>

									<button @click="closeModal" class="text-gray-500 hover:text-gray-700">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<p class="mb-4">Vul hieronder je gegevens in om te registreren.</p>
								<Form @submit="handleRegisterSuccess" :validation-schema="schema" v-slot="{ meta }">
									<FieldInput type="email" label="Email" name="email" v-model="email" />
									<FieldInput type="password" label="Wachtwoord" name="wachtwoord" v-model="password" />
									<FieldInput type="password" label="Confirmatie" name="confirmatie" v-model="confirmatie" />

									<p class="text-green-800 text-sm">{{ bericht }}</p>

									<div class="mb-4 mt-4 flex gap-2">
										<button class="w-full p-2 bg-[#4e995b] text-white rounded-md hover:bg-[#43874e] focus:outline-none" type="submit">
											<span v-if="displayLoading" class="">
												<icon class="animate-spin" name="pajamas:repeat" size="1.3rem"> </icon>
											</span>
											<span v-else> Registreren </span>
										</button>
										<div @click="returnToLogin" class="w-full text-center p-2 bg-gray-100 cursor-pointer rounded-md hover:bg-gray-200 focus:outline-none">vorige</div>
									</div>
								</Form>
							</div>
							<div v-else class="p-8 md:h-screen rounded-2xl md:rounded-none bg-white w-screen md:max-w-[28vw]">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">Reseten</h1>

									<button @click="closeModal" class="text-gray-500 hover:text-gray-700">
										<Icon name="pajamas:close-xs" size="2em"></Icon>
									</button>
								</div>
								<p class="mb-4">Vul hieronder je email in om een reset link te ontvangen.</p>
								<Form @submit="resetPassword" :validation-schema="schema" v-slot="{ meta }">
									<FieldInput type="email" label="Email" name="email" v-model="email" />
									<FieldInput type="password" label="Wachtwoord" name="wachtwoord" v-model="password" />
									<FieldInput type="password" label="Confirmatie" name="confirmatie" v-model="confirmatie" />

									<p class="text-green-800 text-sm">{{ bericht }}</p>

									<div class="mb-4 mt-4 flex gap-2">
										<button class="w-full p-2 bg-[#4e995b] text-white rounded-md hover:bg-[#43874e] focus:outline-none" type="submit">
											<span v-if="displayLoading" class="">
												<icon class="animate-spin" name="pajamas:repeat" size="1.3rem"> </icon>
											</span>
											<span v-else> Aanvragen </span>
										</button>
										<div @click="returnToLogin" class="w-full text-center p-2 bg-gray-100 cursor-pointer rounded-md hover:bg-gray-200 focus:outline-none">Vorige</div>
									</div>
								</Form>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
	import { configure } from "vee-validate";
	import * as yup from "yup";

	const { $pwa }: any = useNuxtApp();

	const modal = ref(null);
	const modalDelay = ref(null);
	const modalSlide = ref(null);
	const installed = ref(false);
	const ismoble = ref(false);
	const email = ref("");
	const password = ref("");
	const confirmatie = ref("");
	const displayLoading = ref(false);
	const type = ref("");
	const bericht = ref("");
	let schema: any;

	schema = yup.object().shape({
		email: yup.string().email("email moet geldig zijn").required("email is verplicht"),
		wachtwoord: yup.string().min(8, "wachtwoord moet minimaal 8 lang zijn").max(32, "wachtwoord mag maximaal 32 lang zijn").required("wachtwoord is verplicht"),
	});

	watch(type, (newValue: any) => {
		if (newValue === "register" || newValue === "forgot") {
			schema = yup.object().shape({
				email: yup.string().email("email moet geldig zijn").required("email is verplicht"),
				wachtwoord: yup.string().min(8, "wachtwoord moet minimaal 8 lang zijn").max(32, "wachtwoord mag maximaal 32 lang zijn").required("wachtwoord is verplicht"),
				confirmatie: yup
					.string()
					.oneOf([yup.ref("wachtwoord")], "wachtwoorden moeten overeenkomen")
					.required("confirmatie is verplicht"),
			});
		} 
		else {
			schema = yup.object().shape({
				email: yup.string().email("email moet geldig zijn").required("email is verplicht"),
				wachtwoord: yup.string().min(8, "wachtwoord moet minimaal 8 lang zijn").max(32, "wachtwoord mag maximaal 32 lang zijn").required("wachtwoord is verplicht"),
			});
		}
	});

	configure({
		validateOnBlur: true,
		validateOnChange: true,
		validateOnInput: true,
		validateOnModelUpdate: true,
	});

	const { active, activeDelay, User } = defineModels<{
		active: Boolean;
		activeDelay: Boolean;
		User: any;
	}>();

	const handleRequest = async (values: any, actions: any) => {
		displayLoading.value = true;
		const { pending, data, error }: any = await useFetch("/api/auth", {
			method: "post",
			body: values,
		});

		displayLoading.value = pending.value;
		if (error.value) bericht.value = error.value.data.message;
		if (!error.value) {
			User.value = data.value?.user.user_metadata;
			closeModal();
			actions.resetForm();
		} else {
			actions.setErrors({
				email: error.value.data.message,
				wachtwoord: error.value.data.message,
			});

			setTimeout(() => {
				actions.resetForm();
			}, 5000);
		}
	};

	const handleLoginSuccess = async (response: any) => {
		const { data, error }: any = await useFetch("/api/auth/google/identity", {
			method: "post",
			body: response,
		});
		if (error.value) bericht.value = error.value.data.message;
		if (!error.value) {
			setTimeout(() => {
				closeModal();
				User.value = data.value?.user.user_metadata;
			}, 500);
		}
	};

	const handleRegisterSuccess = async (response: any) => {
		displayLoading.value = true;
		const { pending, data, error }: any = await useFetch("/api/register", {
			method: "post",
			body: {
				email: email.value,
				password: password.value,
				confirmatie: confirmatie.value,
			},
		});

		displayLoading.value = pending.value;
		if (error.value) bericht.value = error.value.data.message;
		if (!error.value) {
			setTimeout(() => {
				bericht.value = "Controleer je email voor een bevestigingslink.";
				setTimeout(() => {
					bericht.value = "";
					closeModal();
				}, 5000);
			}, 500);
		}
	};

	const resetPassword = async (response: any, actions: any) => {
		displayLoading.value = true;
		const { pending, data, error }: any = await useFetch("/api/auth/forgot", {
			method: "post", body: response
		});

		displayLoading.value = pending.value;
		if (error.value) bericht.value = error.value.data.message;
		if (!error.value) {
			bericht.value = "Controleer je email voor een reset link.";
			setTimeout(() => {
				bericht.value = "";
				closeModal();
			}, 5000);
		} else {
			actions.setErrors({
				email: error.value.data.message,
				wachtwoord: error.value.data.message,
				confirmatie: error.value.data.message,
			});

			setTimeout(() => {
				actions.resetForm();
			}, 5000);
		}

	};

	const handleRegister = () => {
		type.value = "register";
		activeDelay.value = false;

		setTimeout(() => {
			activeDelay.value = true;
		}, 1000);
	};

	const returnToLogin = () => {
		type.value = "";
		activeDelay.value = false;

		setTimeout(() => {
			activeDelay.value = true;
		}, 1000);
	};

	const forgotPassword = () => {
		type.value = "forgot";
		activeDelay.value = false;

		setTimeout(() => {
			activeDelay.value = true;
		}, 1000);
	};

	const closeModal = () => {
		activeDelay.value = false;
		setTimeout(() => {
			active.value = false;
		}, 100);
	};

	onClickOutside(modal, () => {
		closeModal();
	});

	onMounted(() => {
		if ($pwa?.isPWAIscripted) installed.value = true;
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
		window.removeEventListener("resize", () => {});
	});

	watch(active, (value) => {
		if (!value) type.value = "";
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
