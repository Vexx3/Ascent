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
import { games } from './.vitepress/showcase.js'
</script>

# Made with Ascent

Tower games built with Ascent. Made one? Post it in `#showcase` in the
[Ascent Discord](https://discord.gg/TbqyC2hJRH), and it could be featured here.

<ul class="shots">
  <li v-for="game in games" :key="game.link">
    <a :href="game.link" target="_blank" rel="noopener">
      <img :src="withBase(game.image)" :alt="`A screenshot of ${game.name}`" loading="lazy" />
      <span class="name">{{ game.name }}</span>
      <span class="by">by {{ game.creator }}</span>
    </a>
  </li>
</ul>
