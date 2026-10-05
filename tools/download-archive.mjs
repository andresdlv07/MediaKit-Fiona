import { readFile, writeFile, mkdir } from 'node:fs/promises';
await mkdir('assets/archive',{recursive:true});
const sources=JSON.parse(await readFile('tools/archive-sources.json','utf8'));
await Promise.all(sources.map(async ({code,src})=>{
  const response=await fetch(src,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`${code}: ${response.status}`);
  await writeFile(`assets/archive/${code}.jpg`,Buffer.from(await response.arrayBuffer()));
}));
console.log(`${sources.length} portadas guardadas`);
