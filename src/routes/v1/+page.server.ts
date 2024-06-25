import type { Actions, ServerLoad } from '@sveltejs/kit';
import { OSU_CLIENT_SECRET, OSU_CLIENT_ID } from '$env/static/private';

const baseUrl = 'https://osu.ppy.sh/api/v2/';

let token: any;

// Load token in load function
export const load: ServerLoad = async () => {
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
	token = await response.json();
	token = token['access_token'];
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		let userInfo = await getUserId(username);
		const response = await fetch(
			`https://osu.ppy.sh/api/v2/users/${userInfo.userId}/scores/best?limit=100`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);
		const plays = await response.json();
		let { strength, weakness } = getStrengthAndWeakness(plays);
		return {
			plays,
			userInfo,
			strength,
			weakness
		};
	}
} satisfies Actions;

// Helper to get osu user Id
async function getUserId(username: string) {
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
		userId: userData['id'],
		avatar: userData['avatar_url'],
		countryCode: userData['country_code'],
		isSupporter: userData['is_supporter'],
		username: userData['username'],
		rank: userData['statistics']['global_rank'],
		playstyle: userData['playstyle'] ?? [],
		totalPp: userData['statistics']['pp'],
		joinDate: userData['join_date']
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
