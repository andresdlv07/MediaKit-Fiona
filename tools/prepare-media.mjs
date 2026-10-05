import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const ffmpeg = path.resolve('node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const sources = JSON.parse(await readFile('tools/media-streams.json', 'utf8'));
await mkdir('tools/downloads', { recursive: true });
for (const item of sources) {
  await Promise.all(['video', 'audio'].map(async kind => {
    const response = await fetch(item[kind]);
    if (!response.ok) throw new Error(`${item.name}/${kind}: ${response.status}`);
    await writeFile(`tools/downloads/${item.name}-${kind}.mp4`, Buffer.from(await response.arrayBuffer()));
  }));
  execFileSync(ffmpeg, ['-y', '-i', `tools/downloads/${item.name}-video.mp4`, '-i', `tools/downloads/${item.name}-audio.mp4`, '-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','24','-vf','scale=-2:960','-c:a','aac','-b:a','96k','-movflags','+faststart',`assets/videos/${item.name}.mp4`], {stdio:'ignore'});
  execFileSync(ffmpeg, ['-y','-ss','2','-i',`assets/videos/${item.name}.mp4`,'-frames:v','1',`assets/videos/${item.name}-poster.jpg`], {stdio:'ignore'});
  console.log(`${item.name}: ready`);
}
