import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

export async function createResource(file, name) {
	try {
		const formData = new FormData();
		formData.append('File', file);
		formData.append('Name', name);

		const resource = await pb.collection('Resources').create(formData);
	} catch (err) {
		console.error('Error creating item:', err);
		throw err;
	}
}

export async function getResources() {
	try {
		const resources = await pb.collection('Resources').getFullList({
			sort: '-created'
		});
		return resources;
	} catch (err) {
		console.error('Error fetching items:', err);
		throw err;
	}
}

export async function updateResource(id, name) {
	try {
		const resource = await pb.collection('Resources').update(id, {
			Name: name
		});
	} catch (err) {
		console.error('Error updating item:', err);
		throw err;
	}
}

export async function deleteResource(id) {
	try {
		await pb.collection('Resources').delete(id);
	} catch (err) {
		console.error('Error deleting item:', err);
		throw err;
	}
}
