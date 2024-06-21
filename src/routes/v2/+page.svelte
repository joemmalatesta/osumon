<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;
	let userInfo;
	let plays;
	$: plays = form?.plays;
	$: userInfo = form?.userInfo;
</script>

{#if userInfo && plays}
	<main class="w-screen h-screen justify-center items-center flex flex-col gap-5 overflow-hidden">
		<h1 class="text-5xl font-semibold">osumon!</h1>
		<section
			class="w-1/3 h-5/6 bg-gradient-to-br from-yellow-300/60 to-yellow-500/80 ring-8 ring-gray-400 rounded-xl"
		>
			<flex class="flex-col h-full">
				<!-- Name, rank -->
				<div class="flex h-1/6 justify-between p-10">
					<p class="text-2xl font-semibold">{userInfo.username}</p>
					<div class="flex items-center gap-2">
						<div class="flex items-end">
							<p class="text-sm">#</p>
							<p class="text-xl">{userInfo.rank}</p>
						</div>
						<img
							class="w-6"
							src="https://flagsapi.com/{userInfo.countryCode}/flat/64.png"
							alt="{userInfo.countryCode} flag"
						/>
					</div>
				</div>
				<!-- Picture -->
				<div class="h-2/5 mx-10 flex justify-center flex-col">
					<img
						class="rounded-t-xl aspect-video border-4 border-b-0 border-gray-200"
						src={userInfo.avatar}
						alt=""
					/>
					<div class="h-5 w-full bg-gray-200 items-center rounded-b-md">
						<p class="text-xs px-2">Meow meow meow meow meow</p>
					</div>
				</div>
				<!-- Top plays -->
				<div class="h-1/3 flex flex-col px-10 mt-7">
					{#each plays.slice(0, 3) as play}
						<div class="flex gap-4 items-center">
							<p class="text-lg font-semibold">{play['beatmapset']['title']}</p>
							<p>{Math.floor(play['accuracy'] * 100)}%</p>
							<p>{play['pp']}pp</p>
							<p></p>
						</div>
					{/each}
				</div>
				<!-- Weakness, strength, more info. -->
				<div class="h-1/6"></div>
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
