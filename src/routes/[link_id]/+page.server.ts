import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { links } from '$lib/server/db.schema.js';
import { eq } from 'drizzle-orm';

export async function load({ params: { link_id } }) {
	const res = await db
		.select({ location: links.location })
		.from(links)
		.where(eq(links.id, link_id))
		.execute();

	console.log(res);

	if (res.length === 0) {
		return error(404, 'Not found');
	}

	return redirect(301, res[0].location);
}
