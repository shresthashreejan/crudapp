<script lang="ts">
	type Post = {
		title: string;
		content: string;
	};

	let posts = $state<Post[]>([]);
	let selected = $state();
	let searchString = $state('');
</script>

<main class="container flex flex-col gap-4 m-4">
	<div class="search-container">
		<label for="search">
			<span>Search</span>
			<input type="text" bind:value={searchString} />
		</label>
	</div>
	<div class="post-container">
		<label for="posts">
			{#if posts}
				<select bind:value={selected}>
					{#each posts as p}
						<option value={p}>p.title</option>
					{/each}
				</select>
			{/if}
		</label>
	</div>
</main>
