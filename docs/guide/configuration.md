# Configuration Reference

Every setting the kit has, in one place. All of it lives in Studio under:

```text
ReplicatedStorage > Shared > Config
```

| ModuleScript | What it controls |
| :-- | :-- |
| [`Project`](#project) | Save keys, timers, winpad flashing, build warnings. |
| [`Towers`](#towers) | Towers, tower rushes, difficulties. |
| [`Worlds`](#worlds) | Teleport destinations and Personal Servers. |
| [`RingSelect`](#ringselect) | The hub's ring select screen: keys, camera and loading screen. |
| [`Economy`](#economy) | Tickets, ticket shop, cosmetics, rarity colors. |
| [`Elo`](./elo.md) | What beating a tower is worth, and whether rushes count. |
| [`GamePasses`](#gamepasses) | Your Roblox passes and what each gives. |
| [`Settings`](#settings) | Starting settings for new players. |
| [`CustomSettings`](./custom-settings.md) | Settings you add yourself. |
| [`Chat`](#chat) | Chat tags, win messages, webhook messages. |
| [`Messages`](#messages) | Every other line of text a player reads. |
| [`Admin`](#admin) | Admin console access and hotkey. |
| [`Visuals`](#visuals) | Colors, sounds, and animation timings for the kit's own UI. |

Each file returns one ordinary Luau table. Edit the values; you should not need
to change kit code to make a normal fangame.

::: tip Config is checked when a server starts
Anything that does not add up — a tower naming an Area that does not exist, an
unlock rule naming a tower Config does not have, a difficulty renamed in one
place and not another, a game pass with no ID, a place ID that is not in your
experience — is listed in the Output under **Ascent Config**, naming the line
to open. Place IDs come a moment later in a block of their own, since checking
them asks Roblox. Nothing there stops the game.
:::

::: warning Names that are saved forever
Tower acronyms, shop item keys, cosmetic keys, game pass keys, custom setting
keys, and World and Area IDs are written into every player's save. Renaming one after release loses
whatever players earned under the old name. Test structural changes with the
Studio save key first.
:::

## Project

Settings that apply to your whole game.

### Config version

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `configVersion` | `number` | `1` | Which shape of Config this is. A release that changes Config raises the number it expects, and the Output says so when yours is behind. Change it only after following that release's Updating steps. See [Updating Ascent](./updating.md). |

### What your game calls a tower

Not every Towers of Hell fangame is about towers. These set the word players
read, without renaming anything in Workspace or in saved data.

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `towerWord` | `string` | `"Tower"` | Singular. Used on the Exit button, the Exit confirmation, and the Loading Behavior setting. |
| `towerWordPlural` | `string` | `"Towers"` | Plural. Used as the leaderboard stat name. |

Your tower folders in `Workspace > Towers` keep their names, and so does every
acronym in saved data, so this is safe to change after release.

Win and Discord messages are separate: they are templates you already write
yourself in [Chat](#chat), so change the wording there.

::: tip
The Tower Loading Behavior options players pick from (`Load All`,
`Unload Towers`, `Unload All`) keep their wording. Those exact strings are
what gets saved, so renaming one would reset that setting for everybody.
:::

### What your game calls its currency

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `currencyWord` | `string` | `"ticket"` | Singular. |
| `currencyWordPlural` | `string` | `"tickets"` | Plural. |

Reward messages ask for `{Currency}` and get whichever of these fits the amount,
so a message never spells out an English plural rule and never has to be
rewritten to rename your currency. Like `towerWord`, this renames nothing in
saved data and is safe to change after release.

### Teams

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `teamNames.start` | `string` | `"Start"` | The team a player is on outside a run. |
| `teamNames.winners` | `string` | `"Winners"` | The team a player is moved to on a win. |

These have to match the `Team` instances in your place. If they do not, the
server says so by name when it starts rather than leaving everyone teamless.

### Gameplay timings

How the kit feels, in seconds.

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `timings.touchDebounce` | `number` | `0.1` | How long a part ignores the same player after they touch it. Every checkpoint, winpad and marker shares this. |
| `timings.teleportCooldown` | `number` | `1.5` | The shortest gap between one player's teleport requests. |
| `timings.teleportTimeout` | `number` | `30` | How long before the kit tells a player their teleport did not happen. |
| `timings.maximumQuickResetDelay` | `number` | `3` | The longest hold the Quick Reset setting can be set to. The slider runs one half-second step past it, and that last step is what players see as `Off`. |

The caps that stop a client sending nonsense are deliberately **not** here — the
ceiling on trap damage, the limits on a submitted backpack layout, and so on.
Those live in the code they protect, because a fangame able to raise its own
limits from a settings file would be a fangame with no limits.

### Emotes

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `emotes` | `{ string }` | `{ "dance2", "laugh", "cheer" }` | The emotes players can play, in the order the on-screen picker shows them. Each has a key of its own. |
| `fpsCaps` | `{ number }` | `{ 60, 75, 90, 144, 165, 240 }` | The frame rates the [FPS Cap](./settings.md#fps-cap) setting offers. Off is always first and is not listed here. |

These are the emotes built into Roblox's own `Animate` script, so every avatar
can play them — owning an emote has nothing to do with it. The full set is
`dance`, `dance2`, `dance3`, `laugh`, `cheer`, `point` and `wave`. A name
`Animate` does not recognise simply does nothing.

Each emote also needs an action to bind a key to. The kit ships the three above,
declared under `ReplicatedStorage > AscentInputs > Gameplay` as `Emote_dance2`,
`Emote_laugh` and `Emote_cheer`. To add one of the others, copy an existing
`InputAction` there and rename it `Emote_<name>`, keeping its `Keyboard` child.
An emote listed in Config with no matching action says so in the Output.

Its starting key goes in `keybinds.emotes` in [`Settings`](#settings); one with
no key there has none until a player binds one. Players rebind it from a row in
**Settings > Controls** named after the emote with a capital first letter —
`Dance2` for `dance2` — and an emote with no such row cannot be rebound.

### Turning modes off

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `allJumpsEnabled` | `boolean` | `true` | All Jumps mode. |
| `practiceEnabled` | `boolean` | `true` | Practice mode. |

Turning one off removes it everywhere, not just visually:

- Its button and menu are deleted from the main menu.
- Its keybind rows are deleted from Settings > Controls, and the keys stop working.
- The server never starts it and never listens for its remote, so a crafted
  request cannot switch a player into it.
- All Jumps also drops its leaderboard stat, its mobile buttons, and the
  All Jumps bars and lines in the Completions menu.

Progress players already earned stays in their save. Turning the mode back on
shows it again.

### Saved data

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `dataStoreKey` | `string` | `"BETA_RC_3_SCRIBE"` | Where progress is stored in a published game. |
| `dataStoreKeyStudio` | `string` | `"STUDIO_KEY_1_SCRIBE"` | A separate store used only while testing in Studio. |
| `dataStoreStudioMode` | `"Mock" \| "Live" \| "NoSave"` | `"Mock"` | `Mock` fakes saving and forgets on stop. `Live` really writes to the Studio key. `NoSave` reads the real save under the Studio key and never writes it. |

::: danger
Changing a save key points the game at a different, empty save. Existing
progress is not moved for you.
:::

### Timers and restarts

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `timerSyncInterval` | `number` | `2` | Seconds between timer updates sent to players. |
| `checkpointInterval` | `number` | `0.25` | How often the server checks whether players reached a checkpoint. |
| `restartCooldown` | `number` | `0.1` | Shortest gap between restarts from one player. A restart that rebuilds the tower — any Normal-mode restart — waits at least half a second whatever this says. |
| `restartResetsTowerRush` | `boolean` | `true` | Restarting during a rush returns to its first tower. |

### Winpads and warnings

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `winpadInterval` | `number` | `0.25` | Seconds between winpad color and material changes. |
| `winpadsChangeColor` | `boolean` | `true` | Winpads flash color while somebody is inside the tower. |
| `winpadsChangeMaterial` | `boolean` | `true` | Winpads change material at the same time. |
| `useDisplayName` | `boolean` | `false` | Show display names instead of usernames in win messages. |
| `teleportHeight` | `number` | `3` | Studs above a checkpoint, spawn, or marker a player lands on. |
| `allJumpsMarkerSize` | `Vector3` | `2, 2, 1` | Size of the block All Jumps places at a saved position. |
| `hidePlayersNearDistance` | `number` | `10` | Studs the "Near" option of Hide Players uses. |
| `checkpointsMissingWarning` | `boolean` | `true` | Warn in Output when a tower has no checkpoints. |
| `noMinimumTimeWarning` | `boolean` | `true` | Warn when a tower has no minimum completion time. |
| `r15Warning` | `boolean` | `true` | Warn when the experience is not set to R6. |
| `uncataloguedTowerWarning` | `boolean` | `true` | Name any tower standing in this place that `Config > Towers` does not list. |

The last four only help while you are building, and turning them off once your
game is finished is the intended use. `uncataloguedTowerWarning` is the one
worth leaving on longest: a tower it names plays perfectly well here and is
invisible from every other place in your game.

## Towers

Your towers, tower rushes, and the difficulty list.

::: warning Every tower needs an entry here
A tower's own attributes still win over its entry, so you can list a tower and
still nudge one value in Studio. But attributes only exist in the place whose
`Workspace` holds them, and a fangame is several published places — so a tower
that is **not** listed here is one only its own place knows about. It loads and
plays there, and it is off the Completions chart everywhere, counts toward no
Area's unlock requirements, and cannot be restored by
[`recount-badges`](./commands.md).

You do not have to write the entry yourself. Set the attributes in Studio and
[Tower Setup](./tower-setup-plugin.md) shows you the line and adds it.
:::

### Shape

Every tower in the game, keyed by acronym, each naming the Area it stands in.
`area` is an `id` from [`Worlds`](#worlds).

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
	ToA = { name = "Tower of Annoyance", difficulty = 2.10, area = "Ring2" },
},
```

One flat list rather than a tree, because that is the same shape as the
attributes you set on the folder in Studio: one tower, one line, naming its own
Area. The Areas themselves — their names, emblems, Place IDs and unlock
requirements — are described once in [`Worlds`](#worlds).

### Tower types

`types` says what kinds of tower your game has. A tower names one with `type`,
and `defaultType` covers the ones that do not.

```luau
types = {
	Steeple = { name = "Steeple", ticketMultiplier = 0.5 },
	Tower = { name = "Tower" },
	Citadel = { name = "Citadel", ticketMultiplier = 2, noBoosts = true },
},
defaultType = "Tower",
```

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | What players see this kind called. |
| `ticketMultiplier` | `number` | no | Scales tickets for every tower of this type. Defaults to `1`. |
| `noBoosts` | `boolean` | no | Bans boost items in every tower of this type. |

Boosts are decided like this: a `NoBoosts` tag on the model turns the ban on, a
type with `noBoosts = true` turns it on too, and **the tower's own entry has the
last word** — a `noBoosts` there overrides both the tag and the type, either
way. So a Citadel bans coils by being a Citadel, and one Citadel can opt back in
with `noBoosts = false` in its entry.

Ticket multipliers stack: the type scales the difficulty reward, then a
per-tower entry in `Config > Economy` scales that.

### Tower fields

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | The name players see. |
| `difficulty` | `number` | yes | `rating.sub`, so `5.33` is Challenging at Low. |
| `area` | `string` | yes | An Area `id` from [`Worlds`](#worlds). This is what puts the tower on the chart, and what tells the rest of the game which place it is in. |
| `badgeId` | `number` | no | Badge awarded for beating it. |
| `ajBadgeId` | `number` | no | Badge awarded for an All Jumps completion. |
| `minimumTime` | `number` | no | The fastest a run of this tower can plausibly be, in seconds. A win quicker than this is rejected. Leaving it out is what `Project.noMinimumTimeWarning` warns you about on startup. |
| `towerPoints` | `number` | no | Points this tower is worth. Defaults to `1`. |
| `allJumpsPoints` | `number` | no | Points for an All Jumps win. |
| `type` | `string` | no | A key from `types`. Defaults to `defaultType`. |
| `noBoosts` | `boolean` | no | Overrides the type for this one tower. |

The table key (`ToH`) is the tower's acronym and must match the model name in
`Workspace > Towers`.

All of these except `noBoosts` can also be set as an attribute on the tower
model, which is where older kits put them, and the attribute wins. The attribute
names are listed in [Building A Tower](./tower-setup.md#on-the-tower-no-code).
That is the right way round for the place the tower stands in — you change a
value in Studio and the next run uses it — but it is not a way to skip the
entry, because no other place can read it. `noBoosts` is the exception because
the model side of it is the `NoBoosts` tag rather than an attribute.

`area` is an exception the other way. Which Area a tower counts toward — its
place on the Completions chart and in unlock requirements — always comes from
this entry, so an `Area` attribute on its own files the tower nowhere.

Endings are attributes only, and deliberately so: a tower can have several
winpads, each with its own ending name, difficulty and badge, and an ending
means nothing away from the part that awards it. See [Winpads and
endings](./winpads-endings.md).

### Tower rushes

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `towers` | `{ string }` | yes | Tower acronyms, played in this order. |
| `winroomMarker` | `string` | no | Marker to teleport to after the last tower. |
| `noBoosts` | `boolean` | no | Bans boost items for the whole run. |

A rush also needs its own entry in `towers` so it can appear in menus. See
[Tower Rushes](./tower-rushes.md).

### Difficulties

`difficulties` is an ordered list: the first entry is rating 1, the last is the
highest rating. `subDifficulties` names the decimal part, each entry giving the
last decimal in its band as `upTo` — see
[Sub-Difficulties](./difficulties.md#sub-difficulties).

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | Difficulty name used by towers and ticket rewards. |
| `color` | `Color3` | yes | Color used across the UI. |
| `fancyFont` | `boolean` | no | Use the fancy chat font for wins at this difficulty. |
| `announceGlobally` | `boolean` | no | Announce Normal wins to every server. |
| `announceAllJumpsGlobally` | `boolean` | no | Announce All Jumps wins to every server. |
| `image` | `string` | no | Difficulty icon. |
| `emoji` | `string` | no | Emoji used in webhook messages. |

### Difficulty categories

`categories` groups ratings into named bands, the way EToH calls everything past
Remorseless "Soul Crushing". `from` and `to` are ratings and both ends are
included.

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | Band name. |
| `from`, `to` | `number` | yes | First and last rating in the band. |
| `color` | `Color3` | yes | Color for the band. |
| `webhook` | `string` | no | Discord secret wins in this band post to. Defaults to `NORMAL_WEBHOOK`. |

See [Difficulties](./difficulties.md).

## Worlds

The map of your game: every World, every Area, and the place each one is. An
Area is one published Roblox place — a Ring, a Zone, an Era — and this is the
only description of it. Towers say which Area they stand in by naming an `id`
from here.

Everything the kit ships below Ring 1 is a worked example of one unlock rule,
and is meant to be deleted or rewritten. See
[Worlds, Areas & Personal Servers](./worlds-personal-servers.md).

Worlds and Areas are lists rather than tables of names, so the order you write
them in is the order players read on the Teleport menu, the ring select screen
and the Completions chart.

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `hubPlaceId` | `number` | — | Place that **Return to Hub** sends players to. |
| `personalServers.codeLength` | `number` | `16` | Characters in a share code. Clamped to 8–30. |
| `personalServers.ownerLeaveGracePeriod` | `number` | `600` | Seconds a personal server stays open after its owner leaves. |
| `worlds` | `{ World }` | — | Ordered list of Worlds shown as tabs. |

### Area fields

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `id` | `string` | yes | Stable ID. This is what a tower's `area` names, and what the setup window matches against. |
| `name` | `string` | yes | Name shown on the card and as the chart's group title. |
| `placeId` | `number` | yes | Roblox Place ID. `0` hides the Area. Also how the kit works out which Area a place *is*. |
| `emblem` | `string` | no | Small icon shown beside this Area's towers on the Completions chart. |
| `image` | `string` | no | Overrides the live place thumbnail on the Teleport menu card. |
| `requirements` | `table` | no | Unlock rules. Omit for an open destination. |
| `disabled` | `boolean` | no | Temporarily hide this Area. |
| `sub` | `boolean` | no | Draws it as a subrealm, on the narrower `SubPlace` card under the Area written above it. Presentation only. |

A World takes `id`, `name`, its `areas`, and `disabled` to hide the whole World.

### Requirements

| Field | Type | What it does |
| :-- | :-- | :-- |
| `towerCompletions` | `number` | Total towers the player must have beaten. |
| `difficulties` | `{ [string]: number }` | How many at each difficulty **or harder**. |
| `requiredTowers` | `{ string }` | Specific acronyms that must be beaten. |
| `requiredBadges` | `{ { id: number, name: string? } }` | Roblox badges the player must own. Checked first. |
| `elo` | `number` | Minimum [Elo](./elo.md), both modes in one number. Checked last. |
| `scope` | `"World" \| "All"` | Count only this World's towers, or every tower. Defaults to `"World"`. Applies to `towerCompletions` and `difficulties` only. |

See [Worlds, Areas & Personal Servers](./worlds-personal-servers.md).

## Economy

### Turning parts of the economy off

Not every fangame wants a shop, or cosmetics, or a currency at all. These switch
whole features off the way [`allJumpsEnabled`](#turning-modes-off) does — the
menu and its button are deleted, the server never starts the feature and never
listens for its remote, and a crafted request cannot reach it.

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `enabled.tickets` | `boolean` | `true` | Tickets as a currency. |
| `enabled.shop` | `boolean` | `true` | The Ticket Shop menu. |
| `enabled.cosmetics` | `boolean` | `true` | The Cosmetics menu, and every trail and aura with it. |
| `enabled.cosmeticCategories.Trails` | `boolean` | `true` | Just trails. |
| `enabled.cosmeticCategories.Auras` | `boolean` | `true` | Just auras. |

Some of these imply each other, and the kit resolves that for you rather than
letting a feature end up half-off:

- **Turning tickets off turns the shop off too.** The shop only sells for
  tickets, so a shop without them has nothing to charge.
- **Turning off every cosmetic category is the same as turning cosmetics off.**
  The menu would have nothing left to draw.
- Turning off `shop` on its own leaves tickets earnable but unspendable. That is
  allowed — just know it is what you are choosing.

Turning one category off removes its tab and list from the Cosmetics menu, stops
its shop items being sold, makes the server refuse to equip or grant one, and
stops the startup check asking for models you deliberately do not have.

Nothing is deleted from saved data. Players keep what they earned, and turning a
feature back on gives it back exactly as it was.

### Tickets

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `cooldownDays` | `number` | `7` | Days before the same tower pays again. `0` disables the cooldown. |
| `rewards` | `{ [string]: number }` | — | Tickets per difficulty name. `0` pays nothing, and so does a difficulty left out — the Output names it. |
| `perTower` | `{ [string]: table }` | `{}` | Per-tower overrides, keyed by acronym. |
| `perTower[x].multiplier` | `number` | — | Scales that tower's reward. |
| `perTower[x].allowRebeats` | `boolean` | — | Ignores the cooldown, so every win of that tower pays. |

Both also exist as attributes on the tower itself, `TicketMultiplier` and
`AllowRebeats`, which win over the entry here.

See [Tickets](./tickets.md).

### Shop

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `featured.refreshMinutes` | `number` | `60` | Minutes before featured items change. |
| `featured.itemCount` | `number` | `4` | How many items are featured at once. |
| `featured.discountPercent` | `number` | `25` | Percent off while featured. `0` disables it; capped at 90, and never below 1 ticket. |
| `featured.categories` | `{ string }` | all three | Which categories can be featured. |
| `items` | `{ [string]: ShopItem }` | — | Everything the shop sells. |

Shop item fields:

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | Name players see. |
| `description` | `string` | yes | Line under the name. |
| `price` | `number` | yes | Cost in tickets. |
| `category` | `"Items" \| "Trails" \| "Auras"` | yes | Which tab it appears in. |
| `rarity` | `string` | yes | Picks its color from `rarityColors`. |
| `icon` | `string` | yes | Roblox image ID. |
| `featuredOnly` | `boolean` | no | Lists the item only in the Featured page's Items list, never in All. It is always buyable and never discounted. |
| `template` | `string` | no | Tool in `ServerStorage > TicketShopItems > Tools` to grant. Left out, the Tool is found by `name`. |

See [Ticket Shop](./ticket-shop.md).

### Cosmetics

Trails and auras, each needing a matching model in `ServerStorage > Cosmetics`.

| Field | Type | Required | What it does |
| :-- | :-- | :-- | :-- |
| `name` | `string` | yes | Name players see. |
| `rarity` | `string` | yes | Picks its color from `rarityColors`. |
| `hint` | `string` | no | Text shown while it is still locked. |
| `unlocks` | `{ UnlockRule }` | yes | What earns it. Empty means shop or game pass only. |
| `template` | `string` | no | Model name, when it differs from the key. |

Unlock rules:

| Rule | Fields | Unlocks when |
| :-- | :-- | :-- |
| `Tower` | `tower` | That tower is beaten. |
| `Difficulty` | `difficulty` | Any tower at that difficulty is beaten. |
| `TowerCount` | `count` | That many towers are beaten. |
| `Group` | `groupId`, `minRank` | The player is in that group. |
| `Premium` | — | The player has Roblox Premium. |

See [Cosmetics](./cosmetics.md).

### Rarity colors

`rarityColors` gives each rarity its `Color3`, shared by the shop and the
cosmetics menu. The rarities themselves are fixed at five — `Uncommon`, `Rare`,
`Epic`, `Legendary` and `Mythic` — because the network sends a rarity as one of
those and nothing else. A shop item or cosmetic with any other rarity is left
out, and the Output window names it when the server starts.

## GamePasses

One entry per pass, keyed by a name you choose. Roblox supplies the live name,
description, image, price, and sale state, so only kit behavior belongs here.

| Field | Type | Applies to | What it does |
| :-- | :-- | :-- | :-- |
| `id` | `number` | all | The Roblox pass ID. `0`, as shipped, means the pass is off. |
| `kind` | `"Tool" \| "VIP" \| "PersonalServers"` | all | What the kit does with it. |
| `disabled` | `boolean` | all | Turn the pass off without deleting it. |
| `giftProductId` | `number` | all | A developer product that gifts this pass. Leave it out and the pass has no Gift button. See [Gifting A Pass](./game-passes.md#gifting-a-pass). |
| `tool` | `string` | `Tool` | Tool in `ServerStorage > TicketShopItems > Tools` to grant. |
| `ticketMultiplier` | `number` | `VIP` | Scales all ticket rewards. |
| `trail` | `string` | `VIP` | Cosmetic key unlocked by owning it. |
| `chatTag` | `string` | `VIP` | Chat tag granted to owners. |
| `tickets` | `number` | `VIP` | One-time ticket grant on first ownership check. |

See [Game Passes](./game-passes.md).

## Settings

What a brand new player's settings start as. Players change these in the
in-game Settings menu, and their choices are saved, so editing this file only
affects people who have never played.

| Field | Type | Default |
| :-- | :-- | :-- |
| `quickResetDelay` | `number` (0 to off) | `1` |
| `restartOnDeath` | `boolean` | `false` |
| `highFPSPhysicsFix` | `boolean` | `false` |
| `fpsCap` | `"Off"` or a rate from `fpsCaps`, as text | `"Off"` |
| `alignmentButtons` | `boolean` | `false` |
| `emoteButtons` | `boolean` | `false` |
| `transparentAccessories` | `boolean` | `false` |
| `towerLoadingBehavior` | `"Load All" \| "Unload Towers" \| "Unload All"` | `"Unload Towers"` |
| `fpsDisplay` | `boolean` | `false` |
| `hideTimer` | `boolean` | `false` |
| `hideUI` | `boolean` | `false` |
| `hideDisabledItems` | `boolean` | `false` |
| `invisiblePlayers` | `"Off" \| "Not Friended" \| "Everyone Else" \| "Near" \| "You"` | `"Off"` |
| `mobileDPad` | `"Off" \| "Mode 1" \| "Mode 2"` | `"Off"` |
| `hideCosmetics` | `"Off" \| "Everyone Else" \| "Yours" \| "All"` | `"Off"` |
| `keyDisplayLimit` | `number` (0–20) | `5` |
| `hideBubbleChat` | `boolean` | `false` |
| `alignmentDot` | `boolean` | `false` |
| `audioVisualizer` | `"Off" \| "Low" \| "Medium" \| "High" \| "OMG Why" \| "AAAAA"` | `"Off"` |
| `musicVolume` | `number` (0–2) | `0.5` |
| `checkpointCamera` | `boolean` | `true` |
| `checkpointTransparency` | `number` (0–1) | `0.5` |
| `keybinds` | `table` | see below |
| `custom` | `table` | empty — a new player has chosen nothing yet |

`quickResetDelay`'s top of the slider is one step past
`timings.maximumQuickResetDelay` in [`Project`](#project), and that last notch
is **Off**. Raise the maximum and the slider grows with it. As shipped that is
`3`, so the slider runs 0 to 3 and then Off at `3.5`.

`custom` is not something you edit. Settings you add yourself are declared in
[`CustomSettings`](./custom-settings.md), and this is only where each player's
choices are kept — a new player has made none.

Your character follows Roblox's normal fade as you zoom in, becoming partially
transparent before full first person. `transparentAccessories` additionally
hides your accessories once the camera has faded your body past halfway.
Disabling it preserves the normal camera fade. This affects only your view;
equipped tools keep their normal visibility, and other players still see your
avatar.

Keybinds take any Roblox `KeyCode` name: `quickRestart`, `cornerFlipKeyboard`,
`cornerFlipController`, `allJumpsPlace`, `allJumpsTeleport`,
`allJumpsRemove`, `fpsIncrease` and `fpsDecrease`, plus `emotes`, which is
one key per emote keyed by the emote's own name.

The allowed values and ranges above are enforced on the server, in
`Shared > Settings > Schema`. See [Settings](./settings.md).

## Chat

Anything in curly braces is filled in for you: `{PlayerName}`, `{EndingName}`,
`{Time}`, `{BoostList}`, `{TowerCount}`, `{DifficultyEmoji}`, and `{Player}`.

| Section | What it controls |
| :-- | :-- |
| `tags.styles` | What each tag looks like: `text`, plus `color` for a flat tag or `colors` for a [gradient](./chat.md#gradients). |
| `tags.byUser` | Give a tag to one player by user ID. A VIP pass gives its own `chatTag` from `Config > GamePasses`. |
| `tags.byGroup` | Give a tag to everyone in a Roblox group. |
| `messages` | In-game win messages, their channel, and their fonts. |
| `webhooks` | Discord messages, `enabled` to turn them on (off as shipped, until the secrets exist), and `antiCheat` to post a report when a win fails the server checks (also off). |
| `antiCheatKickMessages` | Picked at random when a win fails server checks. |

See [Chat](./chat.md) and
[Announcements & Webhooks](./announcements-webhooks.md).

## Admin

| Field | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `enabled` | `boolean` | `true` | Turns the admin console on or off. |
| `allowStudio` | `boolean` | `true` | Every Studio tester gets access. |
| `activationKeys` | `{ Enum.KeyCode }` | `{ F4 }` | Keys that open the console. |
| `userIds` | `{ number }` | `{}` | Roblox user IDs allowed in a live server, such as your moderators. |
| `maxTicketChange` | `number` | `1000000` | Largest single change `tickets-add` accepts. |
| `maxTicketBalance` | `number` | `1000000000` | Largest balance `tickets-set` accepts. |
| `saveTimeout` | `number` | `15` | Seconds a command waits for a save to confirm. |

Whoever owns the experience is always allowed — you, or the owner rank of the
group it belongs to. Every command is checked
again on the server, so hiding the console on an unauthorized client is not
treated as security. See [Admin Commands](./commands.md).

## RingSelect

The ring select screen, which is the whole of the hub: the place players join
first, which draws the map from [`Worlds`](#worlds) and sends players into it.
Which place is the hub is not set here -- it is the place made from
`Ascent Hub.rbxlx`, so nothing in `Config` can turn a tower place into a hub by
mistake.

| Field | What it controls |
| :-- | :-- |
| `keys` | A list of keys per action, spelled as `Enum.KeyCode` spells them. |
| `detailedProgress` | Where a new player starts on the Detailed Progress Meter setting. |
| `beatenColor`, `notBeatenColor` | The status strip on each tower bar. |
| `cameraFolder`, `cameraPartName` | Where each Area keeps the part the camera flies to. |
| `cameraTween` | How the camera and the lighting move between rings. |
| `worldFade`, `worldHold` | The black a World change happens behind. |
| `scrollTween` | How the Area list scrolls the picked ring to the top. |
| `loadingScreen` | The loading screen's minimum time, tip interval and dot speed. |

The screen itself, the instance names it attaches to, and how to build the
Workspace sets behind it are in [Ring Select](./ring-select.md).

## Visuals

Colors, sounds and animation timings for the kit's own menus, tower signs, and
HUD. Pick a color with the Studio color picker and read off its Red, Green, and
Blue numbers.

| Section | What it colors |
| :-- | :-- |
| `completions.beaten` | Towers you have beaten, in the Completions menu. |
| `completions.allJumpsBeaten` | Towers beaten in All Jumps. |
| `completions.notBeaten` | Towers not beaten yet, and progress bars. |
| `completions.rainbowSpeed` | How fast a 100% bar cycles. `0` stops it. |
| `towerSigns` | Portal signs and chart lines on the towers themselves. |
| `towerRush` | The tower list shown during a rush. |
| `menu` | Selected tab, equipped cosmetic, settings toggles, shop text. |
| `shopBuyButton` | The Buy button, affordable and unaffordable. |
| `allJumpsMarker` | The floating block an All Jumps checkpoint leaves behind: its color and material. Its size is in [`Project`](#project), and each player picks how see-through it is, starting from `checkpointTransparency` in [Settings](#settings). |
| `menuSounds` | The kit's interface sounds, an asset ID and a volume each: `click` and `hover` on a menu button, `notification` on each toast, and `victory` for the player who just beat a tower. |
| `timing` | How long the kit's animations take: loading screen fade, menu open and close, settings toggle, and how long a notification stays up before fading. |
| `audioVisualizerStrength` | How hard each Audio Visualiser option shakes the camera. Smaller shakes harder. |

Difficulty colors live in [`Towers`](#towers) and rarity colors in
[`Economy`](#economy), next to the things they belong to.

## Messages

Every line of text the kit shows a player that is not a win announcement or a
chat tag. Reword them to suit your game, or translate them.

| Group | What it holds |
| :-- | :-- |
| `loading` | The loading screen. `playerData` is the first thing anyone reads. |
| `ringSelect` | The hub's ring select screen: its loading screen, tips and buttons. |
| `dataKicks` | Why a player was removed because their saved data could not be used. |
| `wins` | The `[GLOBAL]` and `[SERVER]` prefixes on a win announcement. |
| `rewards` | What a player is told when a tower or a game pass pays out. |
| `teleports` | Why a teleport did not happen. |
| `friends` | The Join Friend tab. |
| `personalServers` | Creating, joining, sharing and closing a personal server. |
| `durations` | "a week", "3 days", "10 minutes": how long something lasts, in notifications. |
| `towers` | Things that go wrong on the way into a run, a Studio test run, and the Exit button. |
| `antiCheat` | Why the anti-cheat removed somebody, as their kick screen says it. |
| `locks` | Why an Area is locked, on its card and when a player tries to go in. |
| `teleportMenu` | The Teleport menu's buttons. |
| `shop` | The ticket shop: buttons, the item panel, and what a purchase says. |
| `cosmetics` | Equipping a trail or an aura, and how a locked one is unlocked. |
| `completions` | The Completions chart and its details panel. |
| `spectate` | The spectate panel. |
| `settingsMenu` | Keybind rows, the music line and the place version. |
| `editLayout` | The buttons along the bottom of Edit UI Layout. |
| `allJumpsLeaderstat` | The All Jumps column on the player list. |
| `shopRotation` | The featured row changing over. |
| `gifts` | Gifting a game pass. |
| `shutdown` | The countdown shown before a server closes. |
| `shutdownKick` | Shown to everyone when an administrator closes the server. |
| `kickedByAdmin` | Shown to a player removed with `kick` when no reason was given. |
| `commands` | What the admin console tells somebody who is not allowed to use it. |

Anything in curly braces is filled in for you, and each message names the ones
it understands in a comment above it. `{Currency}` arrives already singular or
plural to match `{Amount}`, so a message never has to spell out an English
plural rule.

Win announcements and the webhook messages that mirror them are in
[`Chat`](#chat) instead, since those belong together.

::: warning After an update
A Config carried over from an older release is missing any group added since,
and the kit reads them. The Output names each missing group when a server
starts; copy it in from the new release's `Messages`. See
[Updating Ascent](./updating.md).
:::

## Sharing Config between your places

A game made with the kit is a hub and a place per Area, and every one of them
needs the same `Config`. Nothing in `Config` is about one place in particular —
which place is which comes from `Worlds`, which every place reads alike — so
the whole folder can be made a Roblox
[package](https://create.roblox.com/docs/projects/assets/packages) and updated
everywhere from one publish.

1. In the place you consider the original, right-click
   `ReplicatedStorage > Shared > Config` and choose **Convert to Package**.
   Package the `Config` folder only: `ConfigTypes` and the rest of `Shared` are
   kit code, which you update with the kit rather than with your settings.
2. In each of your other places, delete its `Config` and insert the package in
   the same spot, then select the `PackageLink` inside it and tick
   **AutoUpdate**.
3. To change a setting, open any `Config` script and click the link at the top
   to unlock the package, make the change, then right-click `Config` and choose
   **Publish to Package**. Your other places pick it up the next time each is
   opened in Studio; players get it once each place is published.

::: warning Things that catch people out
- **A package's scripts are read-only until unlocked**, and an unlocked copy is
  a *modified* one, which Studio stops auto-updating until you publish it. An
  edit you forget to publish stays in that one place, and that place quietly
  stops receiving everybody else's.
- **Auto-update happens in Studio, not in live servers.** Publish every place
  after a Config change, or players in the places you did not publish still
  play by the old settings. Any place you publish tells its running servers a
  newer version exists.
- **Do not delete the `PackageLink`** inside `Config`. That turns the folder
  back into an ordinary one in that place.
- **Package a complete `Config`.** Every module is required by name, so a
  package missing one takes it out of every place that updates. The Tower
  Setup window's Setup tab reports a `Config` missing any module, a copy with
  AutoUpdate off, and a place behind the latest published version.
- **With Rojo, leave `Config` unpackaged.** Rojo writes `Config` from your
  files every time it syncs, which marks the package modified in that place.
  A Rojo project is already the one copy of your settings, and syncing it into
  each place does what the package would.
:::

The Tower Setup window works on a packaged `Config`. When it changes one, it
reminds you to publish; when `Config` is still locked, it tells you to unlock
it rather than claiming a change it could not make.

## Where the types live

The shape of every Config file is described in
`ReplicatedStorage > Shared > ConfigTypes`, which is what makes Studio
autocomplete them. What a type cannot catch — a name that points at nothing —
the server reports when it starts. It sits outside `Config` on purpose: it is not a setting, and
`Config` should hold nothing you would not want to edit. Read it if you want the
exact shape of something; you never need to change it to make a fangame.
