import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';


// Load token in load function
export const load: ServerLoad = async () => {
	const versions: string[] = ['v1', 'v2', 'v3']
	var version = versions[Math.floor(Math.random() * versions.length)];
	redirect(303, version)
}


