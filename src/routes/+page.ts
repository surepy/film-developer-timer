// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    redirect(301, "/develop");
}) satisfies PageLoad;