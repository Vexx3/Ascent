---
title: Showcase
description: Tower games made with Ascent.
sidebar: false
aside: false
outline: false
editLink: false
lastUpdated: false
---

<script setup>
import { withBase } from 'vitepress'

const games = [
  {
    name: 'Project: SUNVI',
    creator: 'Project: Sunvi',
    link: 'https://www.roblox.com/games/127584179704178/Project-SUNVI',
    image: '/images/showcase/project-sunvi.jpg',
  },
  {
    name: 'The All-Skill Towers',
    creator: 'Zoomy1231',
    link: 'https://www.roblox.com/games/135558971894697/The-All-Skill-Towers',
    image: '/images/showcase/the-all-skill-towers.jpg',
  },
]
</script>

# Made with Ascent

Tower games built with Ascent. Made one? Post it in `#showcase` in the
[Ascent Discord](https://discord.gg/TbqyC2hJRH), and it could be featured here.

<div class="showcase">
  <a v-for="game in games" :key="game.link" class="game" :href="game.link" target="_blank" rel="noopener">
    <img :src="withBase(game.image)" :alt="`A screenshot of ${game.name}`" loading="lazy" />
    <span class="info">
      <span class="name">{{ game.name }}</span>
      <span class="creator">by {{ game.creator }}</span>
    </span>
    <span class="play">Play on Roblox</span>
  </a>
</div>

<style>
.showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 20px;
  margin-top: 24px;
}

.vp-doc .showcase .game {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.25s;
}

.vp-doc .showcase .game:hover {
  border-color: var(--vp-c-brand-1);
}

.vp-doc .showcase .game:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.showcase img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  margin: 0;
}

.showcase .info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px 0;
}

.showcase .name {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
}

.showcase .creator {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.showcase .play {
  padding: 10px 16px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

@media (prefers-reduced-motion: reduce) {
  .vp-doc .showcase .game {
    transition: none;
  }
}
</style>
