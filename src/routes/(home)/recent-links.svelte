<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Reader, Trash } from 'svelte-radix';
	import { type Storage } from 'unstorage';
	import RecentLinksItem from './recent-links-item.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { Link } from '$lib/types';

	export let links: Link[] = [];
	export let storage: Storage<Link> | undefined;

	let open = false;
</script>

<Sheet.Root {open}>
	<Sheet.Trigger asChild let:builder>
		<Button
			variant="ghost"
			class="fixed bottom-4 left-1/2 -translate-x-1/2 transform"
			builders={[builder]}
		>
			<Reader class="mr-2 h-4 w-4" />

			Recent Links
		</Button>
	</Sheet.Trigger>

	<Sheet.Content side="right">
		<div class="flex h-full flex-col">
			<Sheet.Header>
				<Sheet.Title>Recent Links</Sheet.Title>
				<Sheet.Description>
					This is a list of your recent links. You can click on any of them to view more details.
					All links will expire in 30 days after creation.
				</Sheet.Description>
			</Sheet.Header>

			<div class="flex-grow space-y-4 overflow-auto py-4">
				{#each links.sort((a, b) => b.created - a.created) as link}
					<RecentLinksItem {link} />
				{/each}
			</div>

			<Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button
						variant="outline"
						on:click={() => {
							storage?.clear();
							links = [];
						}}
					>
						<Trash class="mr-2 h-4 w-4" />

						Clear Links
					</Button>
				</Sheet.Close>
			</Sheet.Footer>
		</div>
	</Sheet.Content>
</Sheet.Root>
