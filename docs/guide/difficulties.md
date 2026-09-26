# Difficulties

A tower's difficulty is one number in `Config > Towers`:

```luau
ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

The whole number is the rating and the decimal is the sub-difficulty, so `5.33` is **Low Challenging**.

## Built-In Ratings

| Rating | Difficulty | Rating | Difficulty |
| --: | :-- | --: | :-- |
| `1` | Easy | `8` | Insane |
| `2` | Medium | `9` | Extreme |
| `3` | Hard | `10` | Terrifying |
| `4` | Difficult | `11` | Catastrophic |
| `5` | Challenging | `12` | Horrific |
| `6` | Intense | `13` | Unreal |
| `7` | Remorseless | `14` | Nil |

## Sub-Difficulties

`subDifficulties` names the decimal. Each band runs up to and including its `upTo`:

| `upTo` | Name | Covers |
| :-- | :-- | :-- |
| `0.00` | Baseline | `.00` |
| `0.11` | Bottom | `.01`–`.11` |
| `0.22` | Bottom-Low | `.12`–`.22` |
| `0.33` | Low | `.23`–`.33` |
| `0.44` | Low-Mid | `.34`–`.44` |
| `0.55` | Mid | `.45`–`.55` |
| `0.66` | Mid-High | `.56`–`.66` |
| `0.77` | High | `.67`–`.77` |
| `0.88` | High-Peak | `.78`–`.88` |
| `0.99` | Peak | `.89`–`.99` |

The decimal is always two digits: `9.3` is `.30` (Low), not `.03`. These are the community chart's bands, so players already know them.

## Tower Types

`types` in `Config > Towers` says what kinds of tower your game has. A tower picks one with `type`; one that doesn't gets `defaultType` (`Tower`). The kit ships EToH's four:

| Type | Size in EToH | Tickets | Boosts |
| :-- | :-- | --: | :-- |
| `Steeple` | 5–6 floors | ×0.5 | allowed |
| `Tower` | 9–10 floors | ×1 | allowed |
| `Citadel` | 12–25 floors | ×2 | banned |
| `Obelisk` | 30+ floors | ×3 | banned |

```luau
types = {
	Steeple = { name = "Steeple", ticketMultiplier = 0.5 },
	Citadel = { name = "Citadel", ticketMultiplier = 2, noBoosts = true },
},
defaultType = "Tower",
```

| Field | Purpose |
| :-- | :-- |
| `name` | What players see it called. |
| `ticketMultiplier` | Scales tickets for every tower of the type. Defaults to `1`. |
| `noBoosts` | Bans boost items in every tower of the type. |

A tower's own `noBoosts` in its entry overrides its type either way, so one Citadel can allow boosts with `noBoosts = false`.

## Edit A Difficulty

`difficulties` is a list in rating order: the first entry is rating 1.

```luau
{
	name = "Insane",
	color = Color3.fromRGB(0, 0, 255),
	announceGlobally = true,
	image = "rbxassetid://82804483457618",
}
```

| Field | Purpose |
| :-- | :-- |
| `name` | The name towers, rewards and unlock rules use. |
| `color` | Its colour across the UI. |
| `fancyFont` | Fancy chat font for wins. |
| `announceGlobally` | Announce Normal wins to every server. |
| `announceAllJumpsGlobally` | Announce All Jumps wins to every server. |
| `image` | Its icon. |
| `emoji` | Its emoji in webhook messages. |

To add a rating above Nil, add an entry at the end, and a ticket reward for it in `Config > Economy`.

::: warning Renaming a difficulty
The name is used by ticket rewards, unlock rules and cosmetics. Rename it everywhere, or the Output will list what no longer matches.
:::

## Difficulty Categories

`categories` groups ratings into bands, like EToH's "Soul Crushing". A band also picks which Discord webhook its wins go to:

| Band | Ratings | Webhook |
| :-- | :-- | :-- |
| Beginner | Easy – Hard | default |
| Intermediate | Difficult – Challenging | default |
| Advanced | Intense – Remorseless | default |
| Soul Crushing | Insane – Catastrophic | `SC_WEBHOOK` |
| Soul Crushing+ | Horrific – Nil | `SC_WEBHOOK` |

```luau
{ name = "Soul Crushing", from = 8, to = 11, color = Color3.fromRGB(0, 0, 255), webhook = "SC_WEBHOOK" },
```

`from` and `to` are ratings, both included. `webhook` defaults to `NORMAL_WEBHOOK`. All Jumps wins always go to `ALL_JUMPS_WEBHOOK`. See [Announcements & Webhooks](./announcements-webhooks.md).
