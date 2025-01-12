import { getResources } from '$lib/pocketbase';

export async function load() {
	const data = await getResources();
	return { data };
}
