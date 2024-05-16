<template>
	<field :name="name" v-slot="{ handleChange, handleBlur, field, meta }">
		<label class="text-base font-bold text-neutral-900" for="file">{{ label }}</label>
		<div class="flex gap-2 items-center text-sm w-full mb-3 mt-2 h-10">
			<div class="bg-green-700 relative cursor-pointer p-2 px-3 w-fit text-white rounded-lg">
				<input accept="application/pdf" type="file" aria-label="file" autocomplete="current-file"
					class="absolute inset-0 w-full h-full opacity-0 z-50" @change="fileSelected(handleChange, $event)"
					@blur="handleBlur" />
				<div class="flex items-center gap-1 justify-center">
					<icon name="fa6-regular:file-pdf" size="1.1rem" />
					<p class="">Menu</p>
				</div>
			</div>
			<div v-if="preview"
				class="border-gray-300 border relative cursor-pointer p-2 px-3 truncate w-fit text-sm rounded-lg">
				<p>{{ preview }}</p>
			</div>
		</div>

		<ErrorMessage class="mb-2 -mt-1 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	const { name, label, preview, bewerken } = defineModels<{
		label: string;
		name: string;
		preview: string | null;
		bewerken: boolean;
	}>();

	if (bewerken){
		const { value }: any = useField<string>(name);
		value.value = preview.value
		preview.value = value.value
	}
	
	
	const fileSelected = (handleChange: (event: Event) => void, event: Event) => {
		const files: any = (event.target as HTMLInputElement).files;
		preview.value = files[0].name;

		handleChange(event);
	};
</script>
