import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { OSU_CLIENT_SECRET, OSU_CLIENT_ID } from '$env/static/private';

// Load token in load function
export const load: ServerLoad = async ({ params }) => {
	// Need to be done first, before any subsequent calls
	try{
	const token = await getAuthToken();
	const username = params.username as string;
	let userInfo: any = await getUserInfo(username, token);
	const plays = await getTopPlays(token, userInfo.id)
	const { strength, weakness } = getStrengthAndWeakness(plays);
	return {
		plays,
		userInfo,
		strength,
		weakness
	};}
	// If name doesn't exist
	catch (error){
		console.log('user not found')
		return {error: 'user not found'}
	}
};
// Get user info, all separate

// Get play Id's

// Run play Id's one at a time, waterfall style

// Get user info one at a time...
// Helper to get osu user Id
async function getUserInfo(username: string, token: string) {
	const response = await fetch(`https://osu.ppy.sh/api/v2/users/${username}/osu`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	let userData = await response.json();
	return {
		id: userData['id'],
		avatar_url: userData['avatar_url'],
		country_code: userData['country_code'],
		is_supporter: userData['is_supporter'],
		username: userData['username'],
		global_rank: userData['statistics']['global_rank'],
		playstyle: userData['playstyle'] ?? [],
		pp: userData['statistics']['pp'],
		join_date: userData['join_date']
	};
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