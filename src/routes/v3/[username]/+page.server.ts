import type { Actions, ServerLoad } from '@sveltejs/kit';
import { OSU_CLIENT_SECRET, OSU_CLIENT_ID } from '$env/static/private';
import { type sentrySvelteKit, startSpan } from '@sentry/sveltekit';

// Load token in load function
export const load: ServerLoad = async ({ params }) => {
	// Need to be done first, before any subsequent calls
	const token = await getAuthToken();
	const username = params.username as string;
	let userInfo: any = {};
	const userProperties = [
		'id',
		'avatar_url',
		'country_code',
		'is_supporter',
		'username',
		'global_rank',
		'playstyle',
		'pp',
		'join_date'
	];
	for (const property of userProperties) {
		userInfo[property] = await getUserInfo(username, property, token);
	}
	const plays = await getTopPlays(token, userInfo['id'])
	const { strength, weakness } = startSpan({name: 'get strengths and weaknesses', op: "function"}, () => getStrengthAndWeakness(plays));
	return {
		plays,
		userInfo,
		strength,
		weakness
	};
};
// Get user info, all separate

// Get play Id's

// Run play Id's one at a time, waterfall style

// Get user info one at a time...
async function getUserInfo(username: string, property: string, token: string) {
	// API too damn quick..
	await sleep(200);
	console.log('getting property ' + property);
	const response = await fetch(`https://osu.ppy.sh/api/v2/users/${username}/osu`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	let userData = await response.json();
	// Need to add stats bit for some props
	if (property == 'pp' || property == 'global_rank') {
		return userData['statistics'][property];
	}
	return userData[property] ?? [];
}

function getStrengthAndWeakness(plays: any[]) {
	// NC == DT
	let modsCount: any = {
		DT: 0,
		NM: 0,
		HR: 0,
		HD: 0
	};
	plays.forEach((play) => {
		let mods = play['mods'];
		if (mods.length == 0) {
			modsCount['NM'] += 1;
			return;
		}
		mods.forEach((mod: any) => {
			if (mod == 'NC') {
				mod = 'DT';
			}
			modsCount[mod] += 1;
		});
	});
	// Find the mod with the most and the least counts
	let maxMod: string = 'NM';
	let minMod: string = 'NM';

	Object.keys(modsCount).forEach((mod) => {
		if (modsCount[mod] > modsCount[maxMod]) {
			maxMod = mod;
		}
		if (modsCount[mod] < modsCount[minMod]) {
			minMod = mod;
		}
	});

	return {
		strength: maxMod,
		weakness: minMod
	};
}

const sleep = (milliseconds: number) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function getAuthToken() {
	const url = new URL('https://osu.ppy.sh/oauth/token');

	let body = `client_id=${OSU_CLIENT_ID}&client_secret=${OSU_CLIENT_SECRET}&grant_type=client_credentials&scope=public`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: body
	});
	let token = await response.json();
	token = token['access_token'];
	return token;
}

async function getTopPlays(token: string, userId: string){
	const response = await fetch(
		`https://osu.ppy.sh/api/v2/users/${userId}/scores/best?limit=100`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	);
	return await response.json();
}