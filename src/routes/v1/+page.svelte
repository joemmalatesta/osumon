<script lang="ts">
	import { goto } from '$app/navigation';
	let username: string;
	let loading: boolean = false
</script>

<div class="w screen h-screen flex justify-center items-center flex-col">
	<h1 class="text-7xl my-2">{loading? "Loading..." : "osumon!"}</h1>
	<form class="{loading ? 'hidden': ''} flex flex-col" on:submit|preventDefault={() => goto(`/v2/${username}`)}>
		<input
			class="border p-1 focus:outline-none focus:border-2 border-black rounded-t-md"
			id="username"
			placeholder="username"
			bind:value={username}
			name="username"
			type="text"
		/>
		<button class="w-full rounded-b-md bg-black text-white p-1 " on:click={() => loading = true}>Generate</button>
	</form>
</div>
