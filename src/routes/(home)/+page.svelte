<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ofetch } from 'ofetch';
	import { Rocket, Reload } from 'svelte-radix';
	import { toast } from 'svelte-sonner';
	import LinkAdded from './link-added.svelte';
	import RecentLinks from './recent-links.svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import type { Link } from '$lib/types';

	dayjs.extend(utc);

	let input: string | undefined;
	let alias: string | undefined;
	let added: string | undefined;
	let isShortening = false;
	let input_error = '';
	let shorten_error = '';

	$: canShorten = input !== undefined && input.length > 0 && input_error.length < 1;

	$: {
		input_error = '';

		if (input !== undefined && input.trim() === '') {
			input_error = 'URL is required';
		} else if (input !== undefined) {
			try {
				new URL(input);
			} catch (error) {
				input_error = 'Invalid URL';
			}
		}
	}

	async function Shorten() {
		if (!input) return toast.error('URL is required');
		if (!canShorten) return toast.error('Invalid URL');
		if (isShortening) return toast.error('Please wait while a link is being shortened');

		isShortening = true;
		added = undefined;
		shorten_error = '';

		added = await ofetch<string>('/api/links', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: input, alias }),
			onResponseError() {
				toast.error('An error occurred while shortening the URL');
			}
		});

		if (!added) return;

		isShortening = false;
		input = undefined;
	}
</script>

<svelte:head>
	<title>tini.si</title>
</svelte:head>

<div class="h-screen-nav flex flex-col">
	<div class="grid flex-grow place-items-center p-4">
		<form class="mx-auto flex w-full max-w-5xl gap-4" on:submit|preventDefault={Shorten}>
			<div class="relative flex-grow">
				<Input bind:value={input} placeholder="URL to be shorten" />

				{#if input_error}
					<div class="absolute p-2 text-sm text-red-500">{input_error}</div>
				{/if}
			</div>

			<!-- <div class="flex items-center gap-1">
				<span>https://tini.al/</span>

				<Input placeholder="Custom alias (optional)" />
			</div> -->

			<Button type="submit" disabled={!canShorten || isShortening} color="blue" size="icon">
				{#if isShortening}
					<Reload class="animate-spin" />
				{:else}
					<Rocket />
				{/if}
			</Button>
		</form>
	</div>
</div>

{#if added}
	<LinkAdded
		id={added}
		on:close={() => {
			added = undefined;
		}}
	/>
{/if}

<RecentLinks />
