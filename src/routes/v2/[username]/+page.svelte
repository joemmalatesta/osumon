<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	export let data;
	$: plays = data?.plays;
	$: userInfo = data?.userInfo;
	let playInfo: any[]
	$: if (data.topPlayInfo) {playInfo = data?.topPlayInfo?.slice(0,3)}
	$: favMapper = data?.favoriteMapper
	$: if (data.error && browser) {
		alert('User not found')
		goto('/v2')
	}

	function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
let playstyles: string[];
$: if (userInfo) {
	playstyles = userInfo.playstyle.map((style: string) => `${capitalizeFirstLetter(style)}`)
}

const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
let dataSubmitted: boolean = false


let selectedTheme: string = "electric"
let possibleThemes = ['electric', 'dark', 'fire', 'water', 'psychic', 'grass']

</script>

{#if userInfo && plays}
	<main class="w-screen h-screen justify-center items-center flex flex-col gap-5 overflow-hidden theme-{selectedTheme} ">
		<div class="flex flex-col items-center">
			<h1 class="text-5xl font-semibold">osumon!</h1>
			<!-- <a
				class="text-sm underline-offset-2 underline hover:underline-offset-4 transition-all"
				href="/v3">Try another</a
			> -->
			<div class="flex gap-2">
			{#each possibleThemes as theme}
				<button on:click={() => selectedTheme=theme}><img class="w-7 rounded-full {selectedTheme == theme? "ring ring-neutral-600/40 ring-offset-1": ""}" src="/{theme}.png" alt=""></button>
			{/each}
		</div>
		</div>
		<section
			class="{selectedTheme == 'dark' ? "text-white": ""} relative w-1/3 h-5/6 bg-gradient-to-br from-detail/60 to-primary/80 ring-8 ring-yellow-400/80 rounded-xl drop-shadow-xl"
		>
			<div
				class="text-sm flex justify-center items-center absolute w-20 h-5 bg-gradient-to-r from-gray-300/70 to-gray-300 rounded-tl-xl rounded-br-xl text-black"
			>
				<p class="opacity-70">{String(userInfo.global_rank).length} Digit</p>
			</div>
			<flex class="flex-col h-full">
				<!-- Name, rank -->
				<div class="flex h-20 justify-between items-center px-10">
					<p class="text-3xl font-semibold">{userInfo.username}</p>
					<div class="flex items-center gap-2 h-fit">
						<div class="flex items-end">
							<p class="text-sm">#</p>
							<p class="text-xl">{userInfo.global_rank}</p>
						</div>
						<img
							class="w-8"
							src="https://flagsapi.com/{userInfo.country_code}/flat/64.png"
							alt="{userInfo.country_code} flag"
						/>
					</div>
				</div>
				<!-- Picture -->
				<div class="h-2/5 mx-10 flex justify-center flex-col drop-shadow">
					<img
						class="rounded-t-xl aspect-video border-4 border-b-0 border-gray-200/80"
						src={userInfo.avatar_url}
						alt={userInfo.username}
					/>
					<div class="h-5 w-full bg-gray-200/80 text-black items-center rounded-b-md flex justify-between">
						<p class="text-xs px-2 mx-1">
							{userInfo.isSupporter ? '♥ ' : ''}{Math.floor(userInfo.pp)}pp {playstyles.length > 0
								? `| ${playstyles}`
								: ''}
						</p>
						<p class="text-xs px-2 mx-1">
							Since {new Date(userInfo.join_date).toLocaleDateString('en-US', options)}
						</p>
					</div>
				</div>
				<!-- Top plays -->
				<div class="h-1/3 flex flex-col px-10 mt-7 gap-3">
					{#each plays.slice(0, 3) as play, index}
						<div class="flex-col flex w-full">
							<div class="flex items-start justify-between">
								<div class="flex items-center">
									{#each play['mods'].length > 0 ? play['mods'] : ['NM'] as mod}
										<img class="w-9 h-6" src="/{mod}.png" alt="" />
									{/each}
									<a
										href={play['beatmap']['url']}
										class="w-60 mx-2 text-lg font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap h-8"
										>{play['beatmapset']['title']}</a
									>
								</div>
								<p class="text-lg font-semibold">{Math.round(play['pp'])}pp</p>
							</div>
							<!-- Need to get possible combo... Maybe a separate call just for this. -->
							<p class="opacity-60 text-xs">
								{play['beatmap']['version']} - {play['beatmapset']['artist']}
							</p>
							<p class="opacity-60 text-xs">
								{play['rank'] == 'SH' ? 'S' : play['rank']} rank, {play['max_combo']}x/{playInfo[index]['max_combo']}x, {(
									play['accuracy'] * 100
								).toFixed(2)}%
							</p>
						</div>
					{/each}
				</div>
				<!-- Weakness, strength, more info. -->
				<div
					class="h-[2px] mx-2 bg-gradient-to-r from-detail/60 to-secondary/60 translate-y-2"
				></div>
				<div class="flex items-center justify-between px-10 mt-5">
					<div class="flex gap-3">
						<!-- Mod most in top 100 -->
						<div class="flex gap-0.5 items-center">
							<p class="text-sm opacity-75">Strength</p>
							<img class="w-6 h-4" src="/{data?.strength}.png" alt="" />
						</div>
						<!-- Mod Least in top 100 -->
						<div class="flex gap-0.5 items-center">
							<p class="text-sm opacity-75">Weakness</p>
							<img class="w-6 h-4" src="/{data?.weakness}.png" alt="" />
						</div>
					</div>
					<p class="italic text-sm">{favMapper} farmer</p>
				</div>
			</flex>
		</section>
	</main>
{/if}
