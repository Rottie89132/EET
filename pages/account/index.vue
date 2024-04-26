<template>
	<div class="h-screen">
		<VitePwaManifest />
		<Navigation v-model:OkStatus="OkStatus"></Navigation>
		<div :class="!installed ? ' mt-20' : 'mt-14'" class="overflow-hidden">
			<div :class="!installed ? 'top-[4rem] fixed' : 'top-0 pt-14 md:top-0 md:-mt-5 fixed'" class="w-full z-10 px-6 bg-white">
				<div class="mb-4">
					<h3 class="xl:text-3xl text-xl font-bold pt-5">Account</h3>
					<p class="xl:text-sm text-xs z-0 opacity-80 mb-2">Hier ziet u een overzicht van uw account.</p>
				</div>
				<hr class="pb-2" />
			</div>
			<div :class="!installed ? ' fixed w-screen h-[90vh] ' : ' fixed w-screen max-h-[72vh]  '" class="mt-[5.5rem] overflow-auto pb-5">
				<div class="grid px-6 grid-cols-1 xl:grid-cols-3 gap-2 pb-3 overflow-auto">
					<div class="bg-[#4e995b] text-white p-4 rounded-xl mt-2">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="font-semibold flex items-center gap-1 text-lg">
									{{ User?.name || User?.email.split("@")[0] }}
									<span v-if="User?.email_verified" class="text-sm">
										<icon name="ic:sharp-verified" size="1.5em" class="text-white text-opacity-80"></icon>
									</span>
								</h2>
								<p class="text-sm -mt-1 opacity-80">
									{{ User?.email }}
								</p>
							</div>
						</div>

						<p class="my-2">
							<span class="text-sm opacity-70">Eigenschappen:</span>
						</p>
						<div class="flex gap-2">
							<button class="bg-slate-50 p-2 px-3 text-xs text-black rounded-lg" @click="openInstellingen">Instellingen</button>
							<p v-if="items?.length > 0" class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Restaurant houder</p>
							<p class="bg-[#377642] text-[#cfe7d3] text-xs p-2 rounded-md">Gebruiker</p>
						</div>
						<div class="flex gap-2 mt-3"></div>
					</div>
				</div>
				<div class="grid px-6 grid-cols-1 xl:grid-cols-1 gap-2 pb-6 overflow-auto">
					<div class="bg-slate-50 p-4 rounded-xl mt-2 outline outline-2 outline-gray-100">
						<div class="flex items-center w-full justify-between">
							<div class="w-full">
								<details :open="openDetail === 'restaurants'" class="font-semibold flex items-center justify-between gap-1 text-lg">
									<summary @click.prevent="toggleDetail('restaurants')">
										<span>Restaurants</span>
										<span class="text-xs opacity-80">({{ items?.length }})</span>
									</summary>
									<p class="text-sm -my-1 font-normal">
										<span v-if="items?.length > 0" class="text-xs opacity-80"> Lijst met alle restaurants onder dit account </span>
										<span v-else class="text-xs opacity-80"> Je hebt geen restaurants onder dit account </span>
									</p>
									<button class="bg-gray-300 p-[0.35rem] px-3 text-xs mt-2 text-gray-700 rounded-lg" @click="openRestaurant">Voeg een restaurant toe</button>
									<div class="grid gap-2 mt-3 font-normal">
										<div v-if="items?.length > 0" v-for="(item, index) in items" class="flex items-center gap-2 bg-slate-50 rounded-lg">
											<div class="w-full">
												<hr class="my-2 mt-1" />
												<div class="flex justify-between gap-2">
													<div class="w-full">
														<div class="flex items-center justify-between gap-2 w-full">
															<h3 class="font-semibold text-md truncate">{{ item?.naam }}</h3>
															<div v-if="item?.images && item?.locatie && item?.telefoon && item?.telefoon && item?.Openingstijden" class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-gray-200 text-gray-500 p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-local-post-office" size="1.2em"></icon>
																	{{ item?.aantal_recenties || 4 }}
																</span>
																<span class="bg-[#4e995b] p-1 flex items-center justify-center gap-1 px-3 text-xs text-[#b4e4bc] rounded-lg">
																	<icon name="ic:sharp-star" size="1.2em"></icon>
																	{{ item?.beoordeling.toFixed(1) }}
																</span>
															</div>
															<div v-else class="flex items-center gap-2 text-right pb-2 overflow-auto">
																<span class="bg-rose-200 text-rose-500 p-1 flex items-center justify-center gap-1 px-3 text-xs rounded-lg">
																	<icon name="ic:round-error" size="1.2em"></icon>
																	Fout
																</span>
															</div>
														</div>
														<p class="text-xs opacity-80 text-balance max-w-[85%] line-clamp-2">{{ item?.beschrijving }}</p>
													</div>
												</div>
												<div class="flex gap-2 mt-1">
													<NuxtLink :to="`/restaurants/${item?.id}/dashboard/`" class="bg-gray-300 p-[0.35rem] px-3 text-xs text-gray-800 rounded-lg">Beheren</NuxtLink>
													<button class="bg-gray-200 p-[0.35rem] px-3 text-xs text-gray-700 rounded-lg">Bewerken</button>
												</div>
											</div>
										</div>
									</div>
								</details>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Modal :title v-model:active="active" v-model:activeDelay="activeDelay">
    <div>
      <p class="-mt-3 text-gray-600">
        Wijzig hier uw instellingen
      </p>
      <hr class="my-2 mb-2" />
      <form @submit.prevent="saveSettings">
        <div>
          <label for="name" class="block font-medium text-gray-700">Naam</label>
          <input v-model="newName" type="text" id="name" name="name" class="mt-1 p-2 block w-full border rounded-md">
        </div>

        <div class="mt-4">
          <label for="photo" class="block font-medium text-gray-700">Foto</label>
          <input type="file" id="photo" name="photo" accept="image/*" class="mt-1 p-2 block w-full border rounded-md">
        </div>

        <div class="mt-6">
          <button type="submit" class="bg-[#4e995b] text-white py-2 px-4 rounded-md">Opslaan</button>
          <div class="bg-red-400 grid-cols-2  text-white py-2 px-4 rounded-md" @click="deleteAccount">Delete Account</div>
        </div>
      </form>
    </div>
	</Modal>

  <Modal :title v-model:active="restaurantActive" v-model:activeDelay="restaurantDelay">
    <form @submit.prevent="createRestaurant" class="max-w-md mx-auto">
      <div class="mb-4">
        <label for="naam" class="block mb-2">Naam:</label>
        <input type="text" id="naam" v-model="naam" required class="w-full px-4 py-2 border rounded">
      </div>

      <div class="mb-4">
        <label for="plaats" class="block mb-2">Plaats:</label>
        <input type="text" id="plaats" v-model="plaats" required class="w-full px-4 py-2 border rounded">
      </div>

      <div class="mb-4">
        <label for="prijs" class="block mb-2">Prijs:</label>
        <select id="prijs" v-model="prijs" required class="w-full px-4 py-2 border rounded">
          <option value="Laag">€</option>
          <option value="Gemideld">€€</option>
          <option value="Hoog">€€€</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="keuken" class="block mb-2">Keuken:</label>
        <input type="text" id="keuken" v-model="keuken" required class="w-full px-4 py-2 border rounded">
      </div>

      <div class="mb-4">
        <label for="beschrijving" class="block mb-2">Beschrijving:</label>
        <textarea id="beschrijving" v-model="beschrijving" required
                  class="w-full px-4 py-2 border rounded"></textarea>
      </div>

      <div class="mb-4">
        <label for="thumbnail" class="block mb-2">Thumbnail:</label>
        <input type="file" id="thumbnail" @change="handleThumbnailChange" required class="">
      </div>

      <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded">Create</button>
    </form>
  </Modal>

</template>

<script setup lang="ts">
	const { $pwa }: any = useNuxtApp();
	const installed = ref(false);
	const User = ref();
	const items: any = ref([]);
	const openDetail = ref();
	const OkStatus = ref(false);

	const active = ref(false);
	const activeDelay = ref(false);
	const title = ref("Account");

  const restaurantActive = ref(false);
  const restaurantDelay = ref(false);

  const newName = ref('');
  const newPhoto = ref(null);

  const naam = ref('');
  const plaats = ref('');
  const prijs = ref('');
  const keuken = ref('');
  const beschrijving = ref('');
  const thumbnail = ref('');


	useSeoMeta({
		title: "EET | Overzicht",
		description: "",
		ogTitle: "EET | Overzicht",
		ogDescription: "",
		ogImage: "/image/banner.png",
		ogUrl: "https://eet.com",
		twitterTitle: "EET | Overzicht",
		twitterDescription: "",
		twitterImage: "/image/banner.png",
		twitterCard: "summary",
	});

  definePageMeta({
		middleware: "auth",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/svg",
				href: "/image/Logo.svg",
			},
		],
	});

	const { data: user }: Record<string, any> = await useFetch("/api/users");
	const { data }: Record<string, any> = await useFetch("/api/restaurants", { params: { searchOwner: true } });
	User.value = user.value?.user;
	items.value = data.value.restaurants;

	onMounted(() => {
		if ($pwa.isPWAInstalled) installed.value = true;
	});

	const openInstellingen = () => {
    title.value = "Instelling";
    active.value = true;
    setTimeout(() => {
      activeDelay.value = true;
    }, 100);
  };

  const openRestaurant = () => {
    title.value = "Instelling";
    restaurantActive.value = true;
    setTimeout(() => {
      restaurantDelay.value = true;
    }, 100);
  };

  const createRestaurant = async () => {
    console.log("restaurant created")
  };

	const saveSettings = async () => {
	try {
		const response = await fetch('/api/updateUser', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: newName.value }),
		});

		const responseData = await response.json(); 
		console.log('Response from server:', responseData); 

		if (response.ok) {
		console.log('Settings updated successfully!');
		} else {
		console.error('Failed to update settings:', response.statusText);
		}
	} catch (error) {
		console.error('An error occurred while updating settings:', error);
	}
	};

  const deleteAccount = async () => {

    console.log(user.value)
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.value.sub })
      });

      if (response.ok) {
        console.log('User account deleted successfully!');
      } else {
        console.error('Failed to delete user account:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while deleting user account:', error);
    }
  };




	const toggleDetail = (detailName: string) => {
		if (openDetail.value === detailName) {
			openDetail.value = "";
		} else {
			openDetail.value = detailName;
		}
	};
</script>

<style scoped></style>
