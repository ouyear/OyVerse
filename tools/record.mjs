#!/usr/bin/env node
/*
 * Records the GIF previews in media/ from registry.js: a character lineup, one GIF per character and per scene.
 * Needs Node 18+, a local Chrome (or CHROME_PATH) and ffmpeg on PATH; install the one dev dependency with `npm install`.
 *
 *   npm run record                     everything
 *   npm run record -- --only=deepseek  just these ids (comma-separated; `lineup` = the all-characters GIF)
 *   npm run record -- --theme=dark     dark variants too (light is always recorded)
 */
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// registry.js is a plain browser script (the package is ESM, so it is evaluated rather than required).
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'registry.js'), 'utf8'), sandbox);
const registry = sandbox.window.OyRegistry;
const arg = name => process.argv.find(item => item.startsWith(`--${name}=`))?.split('=')[1];
const only = arg('only')?.split(',');
const themes = ['light', ...(arg('theme') === 'dark' ? ['dark'] : [])];
const out = path.join(root, 'media');
const tmp = path.join(out, '.tmp');
mkdirSync(tmp, { recursive: true });

const chrome = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
const url = (file, query = '') => `file://${path.join(root, file)}${query ? `?${query}` : ''}`;
const EVERY = 1500;
const lineupSeconds = (registry.previewStates.length * EVERY) / 1000;
const singleSeconds = (registry.previewStates.length * EVERY) / 1000;
const singleStates = registry.previewStates.join(',');

// [output name, page url, viewport, seconds to skip, seconds to keep, gif width, palette colours]
const jobs = [];
for (const theme of themes) {
  const dark = theme === 'dark' ? '-dark' : '';
  if (!only || only.includes('lineup')) jobs.push([`characters${dark}`, url('characters/stage.html', `size=112&every=${EVERY}&states=${singleStates}&theme=${theme}`), [1080, 240], 0.4, lineupSeconds, 900, 64]);
  for (const c of registry.characters) {
    if (!only || only.includes(c.id)) jobs.push([`character-${c.id}${dark}`, url('characters/stage.html', `c=${c.id}&size=180&every=${EVERY}&states=${singleStates}&theme=${theme}`), [300, 280], 0.4, singleSeconds, 240, 48]);
  }
  for (const s of registry.scenes) {
    // Scenes need a few seconds of the event script to fill in, then a stretch with real events moving.
    if (!only || only.includes(s.id)) jobs.push([`scene-${s.id}${dark}`, url(`scenes/${s.file}`, `theme=${theme}`), [1440, 900], 6, s.seconds || 8, 800, s.colors || 96]);
  }
}

const browser = await chromium.launch({ executablePath: chrome, headless: true });
try {
  for (const [name, pageUrl, [width, height], skip, keep, gifWidth, colors] of jobs) {
    const context = await browser.newContext({ viewport: { width, height }, recordVideo: { dir: tmp, size: { width, height } } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pageUrl);
    await page.waitForTimeout((skip + keep) * 1000 + 300);
    const video = await page.video().path();
    await context.close();
    const webm = path.join(tmp, `${name}.webm`);
    renameSync(video, webm);
    const gif = path.join(out, `${name}.gif`);
    // A palette per GIF keeps identity colours true. 10 fps and no dithering: the flat shapes stay clean and the files
    // stay small (dithering shimmers on gradients and makes every frame differ).
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(skip), '-t', String(keep), '-i', webm,
      '-vf', `fps=10,scale=${gifWidth}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle`, gif]);
    console.log(`${name}.gif  ${Math.round(statSync(gif).size / 1024)} KB${errors.length ? `  page errors: ${errors[0]}` : ''}`);
  }
} finally {
  await browser.close();
  for (const file of readdirSync(tmp)) rmSync(path.join(tmp, file));
  rmSync(tmp, { recursive: true, force: true });
}
