// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies LayoutServerLoad;