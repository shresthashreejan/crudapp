<script>
	import { createResource, deleteResource, updateResource } from '$lib/pocketbase.js';
	let { data } = $props();

	let selectedFile;
	let fileName;
	let showDiv = $state('');
	let updatedName;
	let updateId;

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
		fileName = selectedFile.name;
	}

	async function uploadFile() {
		if (!selectedFile) {
			alert('Select a file to upload!');
			return;
		}
		try {
			const resource = await createResource(selectedFile, fileName);
			alert('File uploaded successfully!');
		} catch (error) {
			alert('An error occurred during upload.');
		}
	}

	async function deleteFile(event) {
		const recordId = event.target.getAttribute('record-id');
		try {
			await deleteResource(recordId);
		} catch (error) {
			alert('An error occurred during delete.');
		}
	}

	async function updateFile(event) {
		try {
			await updateResource(updateId, updatedName);
			alert('Updated successfully!');
		} catch (error) {
			alert('An error occurred during update.');
		}
	}

	function showUpdateDiv(event) {
		showDiv = true;
		updatedName = event.target.parentElement.getElementsByClassName('resource-name')[0].textContent;
		updateId = event.target.getAttribute('record-id');
	}

	function hideUpdateDiv() {
		showDiv = false;
	}
</script>

<main class="p-4">
	<h1 class="pb-4 text-3xl">SvelteCRUD</h1>
	<section class="flex flex-col gap-2 pb-4">
		<input type="file" accept="*" onchange={handleFileChange} />
		<button onclick={uploadFile} class="max-w-fit">UPLOAD FILE</button>
	</section>
	{#if showDiv}
		<section class="flex flex-col pb-4">
			<input
				type="text"
				id="name"
				name="name"
				required
				bind:value={updatedName}
				class="border-2 p-2"
			/>
			<div>
				<button record-id={data.id} onclick={updateFile}>UPDATE</button>
				<button onclick={hideUpdateDiv}>CANCEL</button>
			</div>
		</section>
	{/if}
	<section class="pb-4">
		<ul class="list-none">
			{#each data.data as data}
				<li class="resource-name">{data.Name}</li>
				<li>{data.created}</li>
				<button record-id={data.id} onclick={showUpdateDiv}>UPDATE</button>
				<button record-id={data.id} onclick={deleteFile}>DELETE</button>
				<hr />
			{/each}
		</ul>
	</section>
</main>
