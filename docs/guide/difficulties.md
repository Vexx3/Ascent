# Difficulties

A tower's difficulty is one number in `Config > Towers`:

```luau
ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

The whole number is the difficulty, and the decimal is how far into that
difficulty the tower sits. `5.33` is a **Low Challenging**.

## The difficulties

| Number | Difficulty | Number | Difficulty |
| --: | :-- | --: | :-- |
| `1` | Easy | `8` | Insane |
| `2` | Medium | `9` | Extreme |
| `3` | Hard | `10` | Terrifying |
| `4` | Difficult | `11` | Catastrophic |
| `5` | Challenging | `12` | Horrific |
| `6` | Intense | `13` | Unreal |
| `7` | Remorseless | `14` | Nil |

## Sub-difficulties

The decimal is shown as a word, from `subDifficulties` in `Config > Towers`. Each
band goes up to and including its `upTo`:

| `upTo` | Name | Covers |
| :-- | :-- | :-- |
| `0.00` | Baseline | `.00` |
| `0.11` | Bottom | `.01` to `.11` |
| `0.22` | Bottom-Low | `.12` to `.22` |
| `0.33` | Low | `.23` to `.33` |
| `0.44` | Low-Mid | `.34` to `.44` |
| `0.55` | Mid | `.45` to `.55` |
| `0.66` | Mid-High | `.56` to `.66` |
| `0.77` | High | `.67` to `.77` |
| `0.88` | High-Peak | `.78` to `.88` |
| `0.99` | Peak | `.89` to `.99` |

The decimal is always read as two digits, so `9.3` means `.30` (Low), not `.03`.

## Tower types

`types` in `Config > Towers` lists the kinds of tower your game has. A tower picks
one with `type`. A tower without a `type` uses `defaultType`, which is `Tower`.

The kit ships with Eternal Towers of Hell's four types:

| Type | Size in EToH | Tickets | Boost items |
| :-- | :-- | --: | :-- |
| `Steeple` | 5 to 6 floors | ×0.5 | Allowed |
| `Tower` | 9 to 10 floors | ×1 | Allowed |
| `Citadel` | 12 to 25 floors | ×2 | Banned |
| `Obelisk` | 30+ floors | ×3 | Banned |

```luau
types = {
	Steeple = { name = "Steeple", ticketMultiplier = 0.5 },
	Citadel = { name = "Citadel", ticketMultiplier = 2, noBoosts = true },
},
defaultType = "Tower",
```

| Setting | What it does |
| :-- | :-- |
| `name` | What players see the type called. |
| `ticketMultiplier` | Multiplies the tickets every tower of this type pays. Defaults to `1`. |
| `noBoosts` | Bans boost items in every tower of this type. |

A tower's own `noBoosts` overrides its type. For example, `noBoosts = false` on
one Citadel lets players use boosts in that Citadel only.

## Change a difficulty

`difficulties` in `Config > Towers` is a list, in order from easiest to hardest.
The first entry is difficulty `1`, the next is `2`, and so on.

```luau
{
	name = "Insane",
	color = Color3.fromRGB(0, 0, 255),
	announceGlobally = true,
	image = "rbxassetid://82804483457618",
}
```

| Setting | What it does |
| :-- | :-- |
| `name` | The difficulty's name. Ticket rewards and unlock rules use it too. |
| `color` | Its colour everywhere in the UI. |
| `fancyFont` | Uses a fancier font for its wins in chat. |
| `announceGlobally` | Announces Normal wins to every server, not just this one. |
| `announceAllJumpsGlobally` | Announces All Jumps wins to every server. |
| `image` | Its icon. |
| `emoji` | Its emoji in Discord posts. |

To add a difficulty above Nil, add an entry to the end of the list, and give it a
ticket reward in `Config > Economy`.

::: warning Renaming a difficulty
Ticket rewards, unlock rules and cosmetics all use difficulty names. If you rename
one, rename it everywhere. The Output lists anything that no longer matches.
:::

## Starting below Easy

Some games have difficulties below Easy, such as Effortless at `0`, or even below
zero. Set `firstRating` in `Config > Towers` to the number of the first entry:

```luau
firstRating = 0,

difficulties = {
	{ name = "Effortless", color = Color3.fromRGB(0, 255, 213) },
	{ name = "Easy", color = Color3.fromRGB(124, 255, 77) },
	-- ...
},
```

Now Effortless is `0` and Easy is still `1`, so an Effortless tower might be
`0.45`. A negative `firstRating` works the same way.

Difficulty categories use these numbers too, so give Effortless a category with
`from = 0`. The Output names any tower or category outside your list.

## Difficulty categories

`categories` groups difficulties into bands, like EToH's "Soul Crushing". A band
also decides which Discord channel its wins are posted to:

| Band | Difficulties | Posted with |
| :-- | :-- | :-- |
| Beginner | Easy to Hard | `NORMAL_WEBHOOK` |
| Intermediate | Difficult to Challenging | `NORMAL_WEBHOOK` |
| Advanced | Intense to Remorseless | `NORMAL_WEBHOOK` |
| Soul Crushing | Insane to Catastrophic | `SC_WEBHOOK` |
| Soul Crushing+ | Horrific to Nil | `SC_WEBHOOK` |

```luau
{ name = "Soul Crushing", from = 8, to = 11, color = Color3.fromRGB(0, 0, 255), webhook = "SC_WEBHOOK" },
```

`from` and `to` are difficulty numbers, and both ends are included. `webhook`
defaults to `NORMAL_WEBHOOK`. All Jumps wins always go to `ALL_JUMPS_WEBHOOK`. See
[Announcements & Webhooks](./announcements-webhooks.md).
