<template>
	<Navigation></Navigation>
	<div :class="!$pwa?.isPWAInstalled ? '' : ' pt-24'" class="h-screen flex flex-col">
		<div v-auto-animate class="flex-grow overflow-auto p-4 pl-1" ref="chatContainer">
			<div v-for="chat in chatHistory" :id="chat.id" :class="{ 'justify-end': chat.sender === 'You', 'justify-start': chat.sender !== 'You' }" class="flex mb-4 first:mb-4 last:mb-44">
				<div :class="{ 'bg-gray-100': chat.sender !== 'You', 'bg-green-200': chat.sender === 'You' }" class="ml-4 p-4 rounded-lg overflow-auto text-balance leading-5 min-w-52 max-w-72">
					<div class="font-semibold">{{ chat.sender }}</div>
					<div>{{ chat.message }}</div>
				</div>
			</div>
		</div>
		<div :class="!$pwa?.isPWAInstalled ? 'bottom-0' : 'bottom-24'" class="border-t fixed w-screen bg-white border-gray-200 p-4">
			<form class="flex" @submit.prevent="sendMessage">
				<input v-model="message" type="text" class="w-full px-4 py-2 rounded border border-gray-300" placeholder="Type a message..." />
				<button type="submit" class="bg-[#3f7f4a] text-white px-4 py-2 rounded ml-2">
					<icon name="ic:sharp-send" size="1.5rem" />
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
	const { $pwa } = useNuxtApp();
	const host = process.client ? location.host : "localhost:3000";
	const { status, data, send, open, close } = useWebSocket(`ws://${host}/api/websocket`);

	const authors = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Helen", "Igor", "Jack", "Karen", "Liam", "Mona", "Nathan", "Olivia", "Paul", "Quincy", "Rita", "Steve", "Tina", "Ursula", "Victor", "Wendy", "Xavier", "Yvonne", "Zach", "Amy", "Brian", "Catherine", "Derek", "Eleanor", "Fred", "Gina", "Harry", "Ivy", "Joe", "Katie", "Leonard", "Molly", "Nick", "Oscar", "Pamela", "Quentin", "Rebecca", "Sam", "Tiffany", "Uma", "Vincent", "Whitney", "Xander", "Yara", "Zoe"];
	const author = authors[Math.floor(Math.random() * authors.length)];

	const chatHistory = ref([]);
	const chatContainer = ref(null);

	watch(data, async (newValue) => {
		const chat = JSON.parse(newValue);
		chatHistory.value.push({
			sender: chat.author,
			message: chat.message,
			id: chat.message_id,
		});
		await nextTick();
		chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
	});

	const message = ref("");
	function sendMessage() {
		if (!message.value) return;

		chatHistory.value.push({
			sender: "You",
			message: message.value,
			id: Math.random().toString(36).substring(7),
		});

		send(
			JSON.stringify({
				message: message.value,
				message_type: "chat",
				message_id: Math.random().toString(36).substring(7),
				author: author,
			})
		);
		message.value = "";

		nextTick(() => {
			chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
		});
	}
</script>
