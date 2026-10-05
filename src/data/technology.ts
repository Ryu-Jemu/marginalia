interface TechnologyMark { label?: string; icon?: string; color: string; tint: string; monogram?: string }
const marks: Record<string, TechnologyMark> = {
  python: { icon:'python',color:'#306998',tint:'#edf4fb' },
  fastapi: { icon:'fastapi',color:'#007d70',tint:'#e8f6f2' },
  langgraph: { icon:'langgraph',color:'#23544f',tint:'#eaf3f1' },
  springboot: { icon:'springboot',color:'#477622',tint:'#eef7e7' },
  postgresql: { icon:'postgresql',color:'#385e8b',tint:'#eef3fb' },
  postgis: { icon:'postgresql',color:'#4361a8',tint:'#edf0fc' },
  postgresqlpostgis: { label:'PostgreSQL · PostGIS',icon:'postgresql',color:'#4361a8',tint:'#edf0fc' },
  pgvector: { icon:'postgresql',color:'#4361a8',tint:'#edf0fc' },
  redis: { icon:'redis',color:'#b92926',tint:'#fff0ed' },
  flutter: { icon:'flutter',color:'#126c9b',tint:'#eaf5fe' },
  docker: { icon:'docker',color:'#1267b4',tint:'#eaf3fe' },
  googlecloud: { icon:'googlecloud',color:'#3a66b9',tint:'#edf3ff' },
  gcp: { label:'Google Cloud',icon:'googlecloud',color:'#3a66b9',tint:'#edf3ff' },
  pytorch: { icon:'pytorch',color:'#b43c29',tint:'#fff0ea' },
  pandas: { icon:'pandas',color:'#53449a',tint:'#f2effb' },
  statsmodels: { monogram:'SM',color:'#385e8b',tint:'#eef3fb' },
  folium: { monogram:'F',color:'#26744c',tint:'#eaf6ef' },
  scipy: { icon:'scipy',color:'#286892',tint:'#eaf4fa' },
  gymnasium: { monogram:'G',color:'#446b40',tint:'#eef6eb' },
  rabbitmq: { icon:'rabbitmq',color:'#aa470f',tint:'#fff1e5' },
  celery: { icon:'celery',color:'#477526',tint:'#f0f7e8' },
  airflow: { label:'Airflow',icon:'apacheairflow',color:'#276f76',tint:'#eaf6f5' },
  apacheairflow: { label:'Apache Airflow',icon:'apacheairflow',color:'#276f76',tint:'#eaf6f5' },
  streamlit: { icon:'streamlit',color:'#b43148',tint:'#fff0f3' },
  gemini: { icon:'googlegemini',color:'#6351b5',tint:'#f2effd' },
  chroma: { monogram:'Ch',color:'#9a5724',tint:'#fff4e8' },
  chromadb: { monogram:'Ch',color:'#9a5724',tint:'#fff4e8' },
  transformers: { monogram:'HF',color:'#795b10',tint:'#fff7d9' },
  deepmimo: { monogram:'DM',color:'#516498',tint:'#f0f2fb' },
  javascript: { icon:'javascript',color:'#75600b',tint:'#fff8d7' },
  html: { label:'HTML',icon:'html5',color:'#b14525',tint:'#fff0e8' },
  html5: { label:'HTML',icon:'html5',color:'#b14525',tint:'#fff0e8' },
  css: { icon:'css',color:'#604397',tint:'#f4effb' },
  p5js: { label:'p5.js',icon:'p5dotjs',color:'#ad3261',tint:'#fff0f7' },
  unity: { icon:'unity',color:'#435466',tint:'#f0f3f7' },
  csharp: { label:'C#',monogram:'C#',color:'#654796',tint:'#f3effa' },
  arfoundation: { monogram:'AR',color:'#35688d',tint:'#edf5fb' },
  mediapipe: { monogram:'MP',color:'#237985',tint:'#eaf6f8' },
  swiftui: { label:'SwiftUI',icon:'swift',color:'#ad462b',tint:'#fff1eb' },
  coremotion: { monogram:'CM',color:'#4e6294',tint:'#eff3fc' },
  naverapi: { label:'Naver API',monogram:'N',color:'#267340',tint:'#eafaef' },
  git: { icon:'git',color:'#b64530',tint:'#fff0eb' },
  github: { icon:'github',color:'#364152',tint:'#eef1f6' },
  claudecode: { label:'Claude Code',icon:'claude',color:'#a75235',tint:'#fff2eb' },
  codex: { label:'Codex',monogram:'>_',color:'#38595a',tint:'#edf6f5' },
  geminicodeassist: { label:'Gemini Code Assist',icon:'googlegemini',color:'#6351b5',tint:'#f2effd' },
};
export function technologyMark(name:string): TechnologyMark & {label:string} {
  const key = name === 'C#' ? 'csharp' : name.toLowerCase().replace(/[^a-z0-9]/g,'');
  const mark = marks[key] ?? {color:'#425773',tint:'#eff3f8',monogram:name.slice(0,2)};
  return {...mark,label:mark.label ?? name};
}

export const featuredTechnology = [
  {label:'AI · 서비스', names:['Python','FastAPI','LangGraph','Spring Boot','Flutter','PyTorch']},
  {label:'데이터 · 클라우드', names:['PostgreSQL · PostGIS','Redis','pandas','RabbitMQ','Docker','Google Cloud']},
];
export const developmentTools = ['Git','GitHub','Claude Code','Codex','Gemini Code Assist'];
