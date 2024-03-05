<script lang="ts">
	import { type Storage } from 'unstorage';
	import { Button } from '$lib/components/ui/button';
	import { Clipboard } from 'svelte-radix';
	import type { Link } from '$lib/types';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import relative from 'dayjs/plugin/relativeTime';

	dayjs.extend(utc);
	dayjs.extend(relative);

	// export let storage: Storage<Link> | undefined;
	export let link: Link;
	let copied = false;

</script>

<div
	class="flex w-full max-w-full items-center space-x-4 overflow-hidden rounded-md border px-4 py-2 pt-4"
>
	<div class="max-w-full flex-grow space-y-1 overflow-hidden text-ellipsis text-sm">
		<div class="flex justify-between">
			<span>
				tini.si/{link.id}
			</span>

			<span class=" text-black/50 dark:text-white/50">
				{dayjs.utc(link.created * 1000).fromNow()}
			</span>
		</div>

		<p class="max-w-full overflow-auto whitespace-nowrap pb-2 text-black/50 dark:text-white/50">
			{link.location}
		</p>
	</div>

	<Button disabled={copied} class="min-w-8" variant="ghost" size={copied ? 'default' : 'icon'}>
		{#if copied}
			Copied
		{:else}
			<Clipboard
				size={16}
				on:click={() => {
					navigator.clipboard.writeText(`https://tini.si/${link.id}`);
					copied = true;

					setTimeout(() => (copied = false), 1000);
				}}
			/>
		{/if}
	</Button>
</div>
