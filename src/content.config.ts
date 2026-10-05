import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
const link = z.object({label:z.string().min(1),href:z.string().refine(v=>v.startsWith('/') || /^https:\/\//.test(v))});
const stage = z.object({title:z.string(),detail:z.string()});
const evidence = z.object({id:z.string(),kind:z.enum(['scope','measurement','source']),body:z.string(),condition:z.string().optional(),href:z.url().optional(),refs:z.array(z.string()).min(1)})
 .refine(v=>v.kind!=='measurement'||!!v.condition,{message:'A measurement requires its condition'})
 .refine(v=>v.kind!=='source'||!!v.href,{message:'A source requires a URL'});
const caseSchema=z.object({
 id:z.string(),title:z.string(),situation:z.string(),task:z.string(),cause:z.string(),
 actions:z.array(z.string()).min(1),results:z.array(z.string()).min(1),
 before:z.array(z.string()).min(2),after:z.array(z.string()).min(2),
 ai:z.string().optional(),decision:z.string().optional(),reflection:z.string().optional(),evidenceIds:z.array(z.string()).min(1)
});
const project=z.object({
 id:z.string(),title:z.string(),tagline:z.string(),category:z.enum(['service','ai','analysis','research','other']),
 order:z.number(),team:z.string(),role:z.string(),status:z.string(),stack:z.array(z.string()).min(1).max(4),
 summary:z.array(z.string()).length(3),features:z.array(stage).min(1),
 contributions:z.array(z.object({area:z.string(),work:z.string(),context:z.string()})).min(1),
 flow:z.array(stage).min(2),architecture:z.array(z.object({title:z.string(),items:z.array(z.string())})).default([]),
 cloud:z.object({
  summary:z.string().min(1),
  groups:z.array(z.object({
   title:z.string().min(1),status:z.enum(['코드 구성','구성 중']),
   icon:z.enum(['cloud','activity','flask','server','code']),
   items:z.array(z.string().min(1)).min(1).max(3)
  })).min(1).max(3)
 }).optional(),
 cases:z.array(caseSchema).default([]),outcomes:z.array(z.string()).default([]),
 links:z.array(link),evidenceIds:z.array(z.string()).min(1)
});
const research=z.object({
 id:z.string(),title:z.string(),shortTitle:z.string(),venue:z.string(),
 authorPosition:z.object({index:z.number().int().min(1),of:z.number().int().min(1)}).refine(v=>v.index<=v.of),
 status:z.enum(['accepted','under-review']),question:z.string(),method:z.array(z.string()),role:z.array(z.string()),findings:z.array(z.string()),
 flow:z.array(stage),project:z.string(),materials:z.array(link),evidenceIds:z.array(z.string()).min(1)
});
export const collections={
 projects:defineCollection({loader:file('./src/content/projects.json'),schema:project}),
 research:defineCollection({loader:file('./src/content/research.json'),schema:research}),
 notes:defineCollection({loader:file('./src/content/evidence.json'),schema:evidence})
};
