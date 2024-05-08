<template>
	<field :name="name" v-slot="{ errorMessage, handleChange, handleBlur }">
		<label class="text-base font-bold text-neutral-900" for="file">{{ label }}</label>
		<div :class="errorMessage ? ' border-[#B92538] focus:border-[#B92538] ' : isDraggingOver ? ' border-black' : ' border-gray-300'" class="w-full flex items-center justify-center relative border-2 border-dashed rounded-lg p-2 mb-3 mt-2 min-h-36" @dragover.prevent="dragOver" @dragleave.prevent="dragLeave" @drop="fileDropped(handleChange, $event)" ref="dropzone">
			<input accept="image/png, image/jpeg" :multiple="multipe" type="file" aria-label="file" autocomplete="current-file" ref="fileInput" class="absolute inset-0 w-full h-full opacity-0 z-50" @change="fileSelected(handleChange, $event)" @blur="handleBlur" />
			<div v-if="preview.length < 1" class="text-center">
				<h3 class="mt-2 text-sm font-medium text-gray-900">
					<label for="fileInput" class="relative cursor-pointer text-gray-500">
						<span>Sleep </span>
						<span class="font-bold text-black"> of blader </span>
						<span>om te uploaden</span>
					</label>
				</h3>
				<p class="mt-1 text-xs text-gray-500">PNG, JPG tot 10MB ({{ max }}x) (1728 X 668)</p>
			</div>
			<div class="flex-col flex gap-2">
				<NuxtImg class="rounded-lg" v-for="(thumb, index) in preview" :key="index" :src="thumb" v-if="preview && preview.length" />
			</div>
		</div>
		<ErrorMessage class="mb-2 -mt-1 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	const { name, multipe, label, max, preview, previewArray } = defineModels<{
		max: number;
		label: string;
		multipe: boolean;
		name: string;
		preview: string[];
		previewArray: object[];
	}>();

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

	const IMAGE_WIDTH = 1728;
	const IMAGE_HEIGHT = 668;

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
				if (img.width !== IMAGE_WIDTH || img.height !== IMAGE_HEIGHT) {
					clearPreviews();
					return;
				}

				if (preview.value.length >= max.value) {
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
