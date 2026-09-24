# Difficulties

Tower difficulty is one number in `ReplicatedStorage > Shared > Config > Towers`.

```luau
ToH = {
	name = "Tower of Hell",
	difficulty = 5.33,
}
```

The whole-number part is the main rating. The decimal part is the sub-difficulty, so `5.33` is Low Challenging.

## Built-In Ratings

| Rating | Difficulty |
| --: | :-- |
| `1` | Easy |
| `2` | Medium |
| `3` | Hard |
| `4` | Difficult |
| `5` | Challenging |
| `6` | Intense |
| `7` | Remorseless |
| `8` | Insane |
| `9` | Extreme |
| `10` | Terrifying |
| `11` | Catastrophic |
| `12` | Horrific |
| `13` | Unreal |
| `14` | Nil |

## Sub-Difficulties

A difficulty reads as `rating.decimal`. `8.37` is rating 8 — Insane — sitting `.37` into it, and the decimal has a name of its own: **Low-Mid Insane**.

`subDifficulties` gives each band its name and colour. `upTo` is the **last decimal in the band**, so a decimal belongs to the first band it does not exceed:

| `upTo` | Name | Covers |
| :-- | :-- | :-- |
| `0.00` | Baseline | `.00` exactly |
| `0.11` | Bottom | `.01`–`.11` |
| `0.22` | Bottom-Low | `.12`–`.22` |
| `0.33` | Low | `.23`–`.33` |
| `0.44` | Low-Mid | `.34`–`.44` |
| `0.55` | Mid | `.45`–`.55` |
| `0.66` | Mid-High | `.56`–`.66` |
| `0.77` | High | `.67`–`.77` |
| `0.88` | High-Peak | `.78`–`.88` |
| `0.99` | Peak | `.89`–`.99` |

Two digits, always: `9.3` means `.30`, which is **Low** — not `.03`, which would be Bottom. Write `9.30` if that reads clearer to you; they are the same number.

This is the community difficulty chart, so these bands are what your players already expect. Rename them if your game uses different words, but changing where the boundaries sit will not match anything anyone has seen.

## A Real List

A tower list is mostly this one field, spread across the ratings. Here is the
set the kit ships, sorted, with what each number reads as in game:

| Tower | `difficulty` | Reads as |
| :-- | --: | :-- |
| Example Tower V5 | `1.00` | Baseline Easy |
| Tower of No Idea | `1.34` | Low-Mid Easy |
| Tower of Uneasiness | `2.34` | Low-Mid Medium |
| Tower of Irritating Hassles | `3.52` | Mid Hard |
| Tower of Fractured Hyperactivity | `4.45` | Mid Difficult |
| Tower of Fire and Ice | `5.42` | Low-Mid Challenging |
| Tower of Consulting Keeper | `6.45` | Mid Intense |
| Tower of Ascension Sweet | `7.45` | Mid Remorseless |
| Citadel of Infuriating Layers | `7.55` | Mid Remorseless |
| Example Tower V6 | `8.01` | Bottom Insane |
| Citadel of Tribulations | `8.55` | Mid Insane |
| Tower of Amping The Voltage | `8.81` | High-Peak Insane |
| Tower of Delightfully Nightmarish Endeavors | `9.26` | Low Extreme |
| Tower of Dead Arctic | `10.99` | Peak Terrifying |
| Tower of Transcedental Mastery | `11.36` | Low-Mid Catastrophic |

Two things fall out of that spread. `8.81` is a harder Insane than `8.55` even
though both are Insane, which is the whole reason the decimal exists. And
`10.99` is as hard as Terrifying goes — one more hundredth and it is a
Catastrophic.

## Tower Types

EToH sizes a tower by floor count, and `types` ships the same four with the
ticket payout that goes with each.

| Type | EToH's size | Tickets | Boosts |
| :-- | :-- | --: | :-- |
| `Steeple` | 5–6 floors | ×0.5 | allowed |
| `Tower` | 9–10 floors | ×1 | allowed |
| `Citadel` | 12–25 floors | ×2 | banned |
| `Obelisk` | 30 or more | ×3 | banned |

A tower that names no type gets `defaultType`, which ships as `Tower`. Type and
difficulty are independent on purpose: a Steeple can be Catastrophic and a
Citadel can be Easy.

## Edit A Difficulty

The `difficulties` array is ordered by rating: the first entry is rating 1, the second is rating 2, and so on.

```luau
{
	name = "Insane",
	color = Color3.fromRGB(0, 0, 255),
	announceGlobally = true,
	image = "rbxassetid://82804483457618",
}
```

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `name` | `string` | — | Stable difficulty name used by towers and ticket rewards. |
| `color` | `Color3` | — | UI color. |
| `fancyFont` | `boolean` | `false` | Optional fancy-font styling. |
| `announceGlobally` | `boolean` | `false` | Optional global Normal completion announcement. |
| `announceAllJumpsGlobally` | `boolean` | `false` | Optional global All Jumps announcement. |
| `image` | `string` | none | Optional Roblox image string. |
| `emoji` | `string` | none | Optional webhook emoji. |

## Difficulty Categories

The `categories` list groups ratings into named bands, the way EToH's chart
does. The kit ships EToH's own grouping:

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

| Field | Type | Required | Purpose |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | Band name. |
| `from`, `to` | `number` | yes | First and last rating, both included. |
| `color` | `Color3` | yes | Color for the band. |
| `webhook` | `string` | no | Discord secret wins in this band post to. Defaults to `NORMAL_WEBHOOK`. |

This is what decides which webhook a Normal win goes to; All Jumps wins always
post to `ALL_JUMPS_WEBHOOK`. Before it existed the kit hardcoded "rating 8 and
up", so adding a difficulty silently changed nothing.

To add a rating above Nil, append one entry to `difficulties` and add its ticket
reward in `Config > Economy` if it should award tickets.

## See Also

- [Configuration Reference: Towers](./configuration.md#towers)
- [Tower Setup](./tower-setup.md)
- [Announcements & Webhooks](./announcements-webhooks.md)
