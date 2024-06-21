<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;
	let plays;
	$: plays = form?.plays;
</script>

<h1 class="text-2xl">osu! wrapped</h1>
<form method="post">
	<label for="username">Username</label>
	<input class="border rounded-md" id="username" name="username" type="text" />
</form>

{#if plays}
	<div class="flex flex-col">
		{#each plays as play}
		<div class="flex gap-4 items-center">
			<p class="text-lg font-semibold">{play['beatmapset']['title']}</p>
			<p>{Math.floor(play['accuracy']*100)}%</p>
			<p>{play['pp']}pp</p>
			<p></p>
		</div>
		{/each}
	</div>
{/if}
