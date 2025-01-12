<script>
	import { createResource, deleteResource, updateResource } from '$lib/pocketbase.js';
	import { onMount } from 'svelte';
	import axios from 'axios';

	let { data } = $props();

	// Salesforce credentials
	const clientId = import.meta.env.VITE_SF_CLIENT_ID;
	const clientSecret = import.meta.env.VITE_SF_CLIENT_SECRET;
	const instanceUrl = import.meta.env.VITE_SF_INSTANCE_URL;
	const redirectUri = import.meta.env.VITE_SF_REDIRECT_URI;
	const scope = import.meta.env.VITE_SF_SCOPE;

	let selectedFile;
	let fileName;
	let showDiv = $state('');
	let updatedName;
	let updateId;
	let accessToken = $state('');

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
			const resource = await createResource(selectedFile, fileName).then(() => {
				if (accessToken) {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(selectedFile);
					fileReader.onload = async () => {
						const fileBase64 = fileReader.result.split(',')[1];
						try {
							const contentVersionResponse = await axios.post(
								`https://${instanceUrl}/services/data/v60.0/sobjects/ContentVersion/`,
								{
									Title: fileName,
									PathOnClient: fileName,
									VersionData: fileBase64
								},
								{
									headers: {
										Authorization: `Bearer ${accessToken}`,
										'Content-Type': 'application/json'
									}
								}
							);
							const contentVersionId = contentVersionResponse.data.id;

							const contentDocumentResponse = await axios.get(
								`https://${instanceUrl}/services/data/v60.0/sobjects/ContentVersion/${contentVersionId}`,
								{
									headers: {
										Authorization: `Bearer ${accessToken}`
									}
								}
							);
							const contentDocumentId = contentDocumentResponse.data.ContentDocumentId;
							await createContentDocumentLink(contentDocumentId);
						} catch (error) {
							alert('An error occurred during upload.');
							console.error(error);
						}
					};
				} else {
					alert('File uploaded successfully!');
				}
			});
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

	async function connectToSalesforce() {
		const authorizationUrl = `https://${instanceUrl}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
		window.location.href = authorizationUrl;
	}

	async function handleRedirectBack() {
		if (!accessToken) {
			const authorizationCode = getAuthorizationCode();
			if (authorizationCode) {
				getAccessToken(authorizationCode);
			}
		}
	}

	function getAuthorizationCode() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('code');
	}

	async function getAccessToken(authorizationCode) {
		const tokenUrl = `https://${instanceUrl}/services/oauth2/token`;

		const params = new URLSearchParams();
		params.append('grant_type', 'authorization_code');
		params.append('code', authorizationCode);
		params.append('client_id', clientId);
		params.append('client_secret', clientSecret);
		params.append('redirect_uri', redirectUri);

		try {
			const response = await axios.post(tokenUrl, params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			accessToken = response.data.access_token;
		} catch (error) {
			console.error(error);
		}
	}

	async function createContentDocumentLink(contentDocumentId) {
		try {
			const departmentResponse = await axios.get(
				`https://${instanceUrl}/services/data/v60.0/sobjects/Department__c/`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			);
			const departmentId = departmentResponse.data.recentItems[0].Id;

			const resourceResponse = await axios.post(
				`https://${instanceUrl}/services/data/v60.0/sobjects/Resource__c/`,
				{
					Name: fileName,
					File_Linked__c: true,
					Department__c: departmentId,
					Content_Id__c: contentDocumentId
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					}
				}
			);
			const resourceId = resourceResponse.data.id;

			await axios.post(
				`https://${instanceUrl}/services/data/v60.0/sobjects/ContentDocumentLink/`,
				{
					ContentDocumentId: contentDocumentId,
					LinkedEntityId: resourceId,
					ShareType: 'V',
					Visibility: 'AllUsers'
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					}
				}
			);
			alert('File uploaded and salesforce records created successfully!');
		} catch (error) {
			alert('An error occurred during ContentDocumentLink or Resource__c record creation.');
			console.error(error);
		}
	}

	onMount(() => {
		handleRedirectBack();
	});
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
	{#if accessToken}
		<div class="absolute right-4 top-4">Connected to Salesforce</div>
	{:else}
		<button class="absolute right-4 top-4" onclick={connectToSalesforce}>Connect Salesforce</button>
	{/if}
</main>
