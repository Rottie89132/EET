<template>
	<field :name="name" v-slot="{ errorMessage, handleChange, handleBlur, field }">
		<label class="text-base font-bold text-neutral-900" for="file">{{ label }}</label>
		<div :class="errorMessage ? ' border-[#B92538] focus:border-[#B92538] ' : isDraggingOver ? ' border-black' : ' border-gray-300'"
			class="relative flex items-center justify-center w-full p-2 mt-2 mb-3 border-2 border-dashed rounded-lg min-h-36"
			@dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop="fileDropped(handleChange, $event)"
			ref="dropzone">
			<input accept="image/png, image/jpeg" type="file" aria-label="file" autocomplete="current-file"
				ref="fileInput" class="absolute inset-0 z-50 w-full h-full opacity-0"
				@change="fileSelected(handleChange, $event)" @blur="handleBlur" />
			<div v-if="preview.length < 1" class="text-center">
				<h3 class="mt-2 text-sm font-medium text-gray-900">
					<label for="fileInput" class="relative text-gray-500 cursor-pointer">
						<span>Sleep </span>
						<span class="font-bold text-black"> of blader </span>
						<span>om te uploaden</span>
					</label>
				</h3>
				<p class="mt-1 text-xs text-gray-500">PNG, JPG tot 10MB (1 x)</p>
			</div>
			<div class="flex flex-col gap-2">
				<NuxtImg class="rounded-lg w-[19rem] h-[19rem] object-cover" v-for="(thumb, index) in preview" :key="index"
					:src="thumb" v-if="preview && preview.length" />
			</div>
		</div>
		<ErrorMessage class="mb-2 -mt-1 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	import { useField } from "vee-validate";
	const { name, label,  preview, previewArray } = defineModels<{
		label: string;
		name: string;
		preview: any;
		previewArray: object[];
	}>();

	const { value }: any = useField<string>(name);
	value.value = preview.value
	
	const dropzone = ref(null);
	const fileInput = ref(null);
	const isDraggingOver = ref(false);

	const dragOver = () => {
		isDraggingOver.value = true;
	};
	

	const dragLeave = () => {
		isDraggingOver.value = false;
	};

	const fileDropped = (handleChange: (event: DragEvent) => void, event: DragEvent) => {};

	const fileSelected = (handleChange: (event: Event) => void, event: Event) => {
		isDraggingOver.value = false;
		const files: any = (event.target as HTMLInputElement).files;
		if (files)
			Array.from(files).forEach(async (file: any) => {
				await displayPreview(file);
			});

		handleChange(event);
	};

	const clearPreviews = () => {
		preview.value = [];
		previewArray.value = [];
	};

	const displayPreview = async (file: File) => {
		if (!(file instanceof File) || (file.type !== "image/png" && file.type !== "image/jpeg")) {
			clearPreviews();
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				
				if (preview.value.length >= 1) {
					preview.value.shift();
					previewArray.value.shift();
				}

				preview.value.push(reader.result as string);
				previewArray.value.push(file);
			};
			img.src = reader.result as string;
		};
		reader.onerror = () => {
			console.error("Failed to read file");
			clearPreviews();
		};
	};
</script>
