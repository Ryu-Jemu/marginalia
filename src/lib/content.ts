import { getCollection, type CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export type Research = CollectionEntry<'research'>;
export const projectsOf = async () => (await getCollection('projects')).sort((a,b)=>a.data.order-b.data.order);
export const researchOf = () => getCollection('research');
export const workHref = (id:string) => `/work/${id}/`;
