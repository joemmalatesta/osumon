<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;
	let userInfo;
	let plays;
	$: plays = form?.plays;
	$: userInfo = form?.userInfo;

	function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
let playstyles: string[];
$: if (userInfo) {
	playstyles = userInfo.playstyle.map((style: string) => `${capitalizeFirstLetter(style)}`)
}
const options: any = { day: 'numeric', month: 'long', year: 'numeric' };

	
</script>

{#if userInfo && plays}
	<main class="w-screen h-screen justify-center items-center flex flex-col gap-5 overflow-hidden">
		<h1 class="text-5xl font-semibold">osumon!</h1>
		<section
			class="relative w-1/3 h-5/6 bg-gradient-to-br from-yellow-300/60 to-yellow-500/80 ring-8 ring-yellow-400 rounded-xl drop-shadow-xl"
		>
			<div class="text-sm flex justify-center items-center absolute w-20 h-5 bg-gradient-to-r from-gray-300/40 to-gray-300 rounded-tl-xl rounded-br-xl"><p class="opacity-70">{String(userInfo.rank).length} Digit</p></div>
			<flex class="flex-col h-full">
				<!-- Name, rank -->
				<div class="flex h-20 justify-between items-center px-10">
					<p class="text-3xl font-semibold">{userInfo.username}</p>
					<div class="flex items-center gap-2 h-fit">
						<div class="flex items-end">
							<p class="text-sm">#</p>
							<p class="text-xl">{userInfo.rank}</p>
						</div>
						<img
							class="w-8"
							src="https://flagsapi.com/{userInfo.countryCode}/flat/64.png"
							alt="{userInfo.countryCode} flag"
						/>
					</div>
				</div>
				<!-- Picture -->
				<div class="h-2/5 mx-10 flex justify-center flex-col drop-shadow">
					<img
						class="rounded-t-xl aspect-video border-4 border-b-0 border-gray-300/80"
						src={userInfo.avatar}
						alt={userInfo.username}
					/>
					<div class="h-5 w-full bg-gray-300/80 items-center rounded-b-md flex justify-between">
						<p class="text-xs px-2 mx-1">{userInfo.isSupporter ? "♥ " : ""}{Math.floor(userInfo.totalPp)}pp {playstyles.length > 0 ? `| ${playstyles}` : ""} </p>
						<p class="text-xs px-2 mx-1">Since {new Date(userInfo.joinDate).toLocaleDateString('en-US', options)}</p>
					</div>
				</div>
				<!-- Top plays -->
				<div class="h-1/3 flex flex-col px-10 mt-7 gap-3">
					{#each plays.slice(0, 3) as play}
					<div class="flex-col flex w-full">
						<div class="flex items-start justify-between">
							<div class="flex items-center">
								{#each play['mods'].length > 0 ? play['mods'] : ['NM'] as mod}
									<img class="w-9 h-6 " src='/{mod}.png' alt="">
								{/each}
								<a href={play['beatmap']['url']} class="w-60 mx-2 text-lg font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap h-8">{play['beatmapset']['title']}</a>
							</div>
							<p class="text-lg font-semibold">{Math.round(play['pp'])}pp</p>
						</div>
						<!-- Need to get possible combo... Maybe a separate call just for this. -->
						<p class="opacity-60 text-xs">{play['beatmap']['version']} - {play['beatmapset']['artist']}</p>
						<p class="opacity-60 text-xs">{play['rank'] == "SH" ? "S" : play['rank']} rank, {play['max_combo']}x, {(play['accuracy']*100).toFixed(2)}%</p>
					</div>
					{/each}
				</div>
				<!-- Weakness, strength, more info. -->
				<div class="h-[2px] mx-2 bg-gradient-to-r from-yellow-400/60 to-yellow-500/60 translate-y-2"></div>
				<div class="flex items-center justify-between px-10 mt-5">
					<div class="flex gap-3">
						<!-- Mod most in top 100 -->
						<div class="flex gap-0.5 items-center">
							<p class="text-sm opacity-75">Strength</p>
							<img class="w-6 h-4" src="{form?.strength}.png" alt="">
						</div>
						<!-- Mod Least in top 100 -->
						<div class="flex gap-0.5 items-center">
							<p class="text-sm opacity-75">Weakness</p>
							<img class="w-6 h-4" src="{form?.weakness}.png" alt="">
						</div>
					</div>
					<button class="p-1 rounded-md bg-yellow-400 ring-yellow-500 ring w-20 hover:bg-yellow-500">Share</button>
				
				</div>
			</flex>
		</section>
	</main>
{/if}

{#if !plays || !userInfo}
<main class="w-screen h-screen flex justify-center items-center flex-col">
	<h1 class="text-7xl">osumon!</h1>
	<form method="post">
		<label for="username">Username</label>
		<input class="border rounded-md" id="username" name="username" type="text" />
	</form>
</main>
{/if}
