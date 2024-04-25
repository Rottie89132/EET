<template>
	<div v-if="action == ''">
		<p class="-mt-2 text-gray-600 leading-5">Hier ziet u de opties voor deze reservering.</p>
		<hr class="my-3" />
		<div class="mt-4 flex items-center gap-4">
			<button @click="toonDelete" class="bg-[#de4747] text-white p-1 px-4 rounded-lg">Annuleren</button>
			<button @click="toonUpdate" class="bg-gray-200 p-1 px-4 rounded-lg">Wijzigen</button>
		</div>
	</div>
	<div v-else-if="action == 'Annuleren'">
		<p class="-mt-2 text-gray-600 leading-5">Weet u zeker dat u deze reservering wilt annuleren?</p>
		<div class="mt-4 flex items-center gap-4">
			<button @click="Annuleren" class="bg-[#de4747] text-white p-1 px-4 rounded-lg">Doorgaan</button>
			<button @click="back" class="bg-gray-200 p-1 px-4 rounded-lg">Toch maar niet</button>
		</div>
	</div>
	<div v-else-if="action == 'Wijzigen'">
		<p class="-mt-2 text-gray-600 leading-5 mb-3">Hier kunt u de reservering wijzigen.</p>
		<div class="mt-3 mb-4 flex items-center gap-4">
			<button @click="back" class="bg-gray-200 p-1 px-4 rounded-lg">Toch maar niet</button>
		</div>
		<ModalReservering :ReserveringId="deleteId" :emailSend :ResturantId :restaurantDetails :onSubmit="handleReservering" :OkStatus :user />
	</div>
</template>

<script setup lang="ts">

    const restaurantDetails = ref();
	const OkStatus = ref(false);
	const emailSend = ref(false);
	const user = ref();

	const { action, ResturantId, activeTab, deleteId, switchModal, updateModal, closeModal, updateList } = defineProps<{
		action: string;
		ResturantId: string;
		deleteId: string;
		activeTab: string;
		switchModal: () => void;
		closeModal: () => void;
		updateModal: (eventName: string) => void;
		updateList: (data: any) => void;
	}>();

    const { data: restaurant, error }: Record<string, any> = await useFetch(`/api/restaurants/${ResturantId}`);
	const { data: userData, error: userError }: any = await useFetch("/api/users");
	user.value = userData.value || userError.value.data;
	restaurantDetails.value = restaurant.value.restaurant;
	OkStatus.value = userError.value ? false : true;

	const toonDelete = () => {
		switchModal()
		updateModal("Annuleren");
	};

	const toonUpdate = async () => {
		switchModal()
		updateModal("Wijzigen");
	};

	const Annuleren = async () => {
		
		await $fetch(`/api/reserverigen/${deleteId}`, {method: "DELETE",});
		const data : any = await $fetch(`/api/reserverigen?status=${activeTab}`);
		updateList(data.reserveringen);
		closeModal()
		updateModal("")
	};

	const back = () => {
		switchModal();
		updateModal("")
	};

	const handleReservering = async (data: any) => {

		await $fetch(`/api/reserverigen/${deleteId}`, {
			method: "patch",
			body: data,
		});

		const updateData : any = await $fetch(`/api/reserverigen?status=${activeTab}`);
		updateList(updateData.reserveringen);

		closeModal()
		updateModal("")
	};

	



</script>
