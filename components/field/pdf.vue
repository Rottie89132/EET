<template>
	<field :name="name" v-slot="{ handleChange, handleBlur, field, meta }">
		<label class="text-base font-bold text-neutral-900" for="file">{{ label }}</label>
		<div class="flex items-center w-full h-10 gap-2 mt-2 mb-3 text-sm">
			<div class="relative p-2 px-3 text-white bg-green-700 rounded-lg cursor-pointer w-fit">
				<input accept="application/pdf" type="file" aria-label="file" autocomplete="current-file"
					class="absolute inset-0 z-50 w-full h-full opacity-0" @change="fileSelected(handleChange, $event)"
					@blur="handleBlur" />
				<div class="flex items-center justify-center gap-1">
					<icon name="fa6-regular:file-pdf" size="1.1rem" />
					<p class="">Menu</p>
				</div>
			</div>
			<div v-if="preview"
				class="relative p-2 px-3 text-sm truncate border border-gray-300 rounded-lg cursor-pointer w-fit">
				<p>{{ preview }}</p>
			</div>
		</div>

		<ErrorMessage class="mb-2 -mt-1 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	import { useField } from "vee-validate";
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
