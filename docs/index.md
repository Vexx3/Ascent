---
title: Ascent
titleTemplate: Documentation
sidebar: false
aside: false
outline: false
editLink: false
lastUpdated: false
prev: false
next: false
---

<script setup>
import { useData, withBase } from 'vitepress'
import { data as release } from './.vitepress/release.data.js'

const { theme } = useData()
const groups = theme.value.sidebar['/guide/']
</script>

# Ascent

Ascent is a kit for making Eternal Towers of Hell-style fangames in Roblox
Studio. It comes with towers, timers, a shop, a hub and all the menus, and you
set it up by changing settings in one folder.

This is its documentation. If you're new, start with
[Getting Started](/guide/getting-started). To buy the kit, see
[Getting the kit](/guide/getting-started#getting-the-kit).

<p v-if="release">Latest version: <strong>{{ release.version }}</strong>, released {{ release.date }}. <a :href="withBase('/changelog')">Changelog</a></p>

## Contents

<div class="contents">
  <section v-for="group in groups" :key="group.text">
    <h3>{{ group.text }}</h3>
    <ul>
      <li v-for="item in group.items" :key="item.link"><a :href="withBase(item.link)">{{ item.text }}</a></li>
    </ul>
  </section>
</div>

## Games made with Ascent

Released games built with the kit are on the [Showcase](/showcase).
