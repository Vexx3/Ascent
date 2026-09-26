# Configuration Reference

All settings are ModuleScripts in `ReplicatedStorage > Shared > Config`. Each one is a table of values, each with a comment explaining it. You shouldn't need to touch kit code to make a fangame.

| Module | What it controls | Details |
| :-- | :-- | :-- |
| [`Project`](#project) | Save keys, words, timings, modes, build warnings | this page |
| `Towers` | Towers, types, difficulties, rushes | [below](#towers) |
| `Worlds` | Worlds, Areas, unlock rules, personal servers | [Worlds & Personal Servers](./worlds-personal-servers.md) |
| `RingSelect` | The hub screen | [Ring Select](./ring-select.md#config-ringselect) |
| [`Economy`](#economy) | Tickets, shop, cosmetics | [Tickets & Shop](./ticket-shop.md), [Cosmetics](./cosmetics.md) |
| `Elo` | What each tower is worth | [Player Elo](./elo.md) |
| [`GamePasses`](#gamepasses) | Your game passes | [Game Passes](./game-passes.md) |
| [`Settings`](#settings) | New players' settings and keys | this page, [Settings](./settings.md) |
| `CustomSettings` | Settings you add | [Adding A Saved Setting](./custom-settings.md) |
| [`Chat`](#chat) | Chat tags, win messages, webhooks | [Chat](./chat.md) |
| [`Admin`](#admin) | Who can use admin commands | [Admin Commands](./commands.md) |
| [`Visuals`](#visuals) | The kit's UI colours, sounds, timings | this page |
| [`Messages`](#messages) | Every other line of text players read | this page |

::: tip Config is checked when a server starts
Mistakes, like a tower naming an Area that doesn't exist or a pass with no ID, are listed in the Output under **Ascent Config**, naming the line to fix.
:::

::: warning Names that are saved forever
Tower acronyms, shop item keys, cosmetic keys, game pass keys, custom setting keys, and World and Area IDs are written into player saves. Renaming one after release loses what players earned under it.
:::

## Project

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `configVersion` | `1` | Which version of Config this is. Raise it only after following a release's Updating steps. See [Updating Ascent](./updating.md). |
| `towerWord`, `towerWordPlural` | `"Tower"`, `"Towers"` | What players read your towers called. Renames nothing saved. |
| `currencyWord`, `currencyWordPlural` | `"ticket"`, `"tickets"` | What players read your currency called. |
| `teamNames.start`, `teamNames.winners` | `"Start"`, `"Winners"` | Your two `Team`s. They must exist in the place. |
| `emotes` | `{ "dance2", "laugh", "cheer" }` | Emotes players can play. |
| `fpsCaps` | `{ 60, 75, 90, 144, 165, 240 }` | Rates the [FPS Cap](./settings.md#fps-cap) setting offers. |
| `allJumpsEnabled`, `practiceEnabled` | `true` | Turns a mode off everywhere: its buttons, keys and server side. |

### Saved data

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `dataStoreKey` | `"BETA_RC_3_SCRIBE"` | Where progress is saved in the published game. |
| `dataStoreKeyStudio` | `"STUDIO_KEY_1_SCRIBE"` | A separate save used only in Studio. |
| `dataStoreStudioMode` | `"Mock"` | `Mock` forgets everything when you stop. `Live` saves to the Studio key. `NoSave` loads the Studio key but never saves. |

::: danger
Changing a save key starts everyone on an empty save.
:::

### Timings

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `timings.touchDebounce` | `0.1` | Seconds a part ignores the same player after a touch. |
| `timings.teleportCooldown` | `1.5` | Least seconds between one player's teleports. |
| `timings.teleportTimeout` | `30` | Seconds before a stuck teleport is reported as failed. |
| `timings.maximumQuickResetDelay` | `3` | The highest Quick Reset setting. |
| `timerSyncInterval` | `2` | Seconds between timer corrections. |
| `checkpointInterval` | `0.25` | How often checkpoints are checked. |
| `restartCooldown` | `0.1` | Least seconds between restarts. |
| `restartResetsTowerRush` | `true` | Restarting in a rush goes back to its first tower. |

### Winpads and other

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `winpadInterval` | `0.25` | Seconds between winpad flashes. |
| `winpadsChangeColor`, `winpadsChangeMaterial` | `true` | Winpads flash while someone is in the tower. |
| `useDisplayName` | `false` | Display names instead of usernames in win messages. |
| `teleportHeight` | `3` | Studs above a checkpoint or marker a player lands. |
| `allJumpsMarkerSize` | `2, 2, 1` | Size of the All Jumps checkpoint block. |
| `hidePlayersNearDistance` | `10` | Studs for Hide Players' "Near" option. |

### Build warnings

Turn these off once your game is finished, so live servers' Output stays quiet.

| Field | Warns when |
| :-- | :-- |
| `checkpointsMissingWarning` | A tower has no checkpoints. |
| `noMinimumTimeWarning` | A tower has no `minimumTime`. |
| `r15Warning` | The game isn't set to R6. |
| `uncataloguedTowerWarning` | A tower in the place isn't in `Config > Towers`. |

### Emotes

The emotes are Roblox's built-in ones: `dance`, `dance2`, `dance3`, `laugh`, `cheer`, `point`, `wave`. To add one, copy an `InputAction` in `ReplicatedStorage > AscentInputs > Gameplay` and name it `Emote_<name>`, then give it a key in `keybinds.emotes` in [Settings](#settings). A Controls row named after it (`Dance2` for `dance2`) lets players rebind it.

## Towers

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

The key is the acronym, which must match the tower's model name in `Workspace > Towers`. **Every tower needs an entry**, or it is missing from every other place. The [Tower Setup window](./tower-setup-plugin.md) writes it for you.

| Field | Required | Purpose |
| :-- | :-- | :-- |
| `name` | yes | What players see. |
| `difficulty` | yes | `rating.sub`: `5.33` is Low Challenging. See [Difficulties](./difficulties.md). |
| `area` | yes | The Area `id` it's in. |
| `badgeId` | no | Badge for beating it. |
| `ajBadgeId` | no | Badge for beating it in All Jumps. |
| `minimumTime` | no | Fastest believable time, in seconds. Faster wins are refused. |
| `towerPoints` | no | Points it's worth. Defaults to `1`. |
| `allJumpsPoints` | no | Points for an All Jumps win. |
| `type` | no | A tower type. See [Tower Types](./difficulties.md#tower-types). |
| `noBoosts` | no | Overrides its type's boost rule. |

Most of these can also be set as attributes on the tower model, and the attribute wins in that place. See [Building A Tower](./tower-setup.md). Endings are only attributes; see [Winpads & Endings](./winpads-endings.md).

Types, difficulties, sub-difficulties and categories are on [Difficulties](./difficulties.md). Rushes are on [Tower Rushes](./tower-rushes.md).

## Economy

| Field | Default | Turns off |
| :-- | :-- | :-- |
| `enabled.tickets` | `true` | Tickets, and the shop with them. |
| `enabled.shop` | `true` | The Ticket Shop. |
| `enabled.cosmetics` | `true` | The Cosmetics menu and every trail and aura. |
| `enabled.cosmeticCategories.Trails` / `.Auras` | `true` | Just one kind. |

Turning a feature off removes its menu and stops the server accepting it. Saves keep everything.

`tickets` and `shop` are on [Tickets & Shop](./ticket-shop.md), `cosmetics` on [Cosmetics](./cosmetics.md). `rarityColors` gives each of the five rarities its colour.

## GamePasses

One entry per pass. Roblox supplies its name, price and picture; see [Game Passes](./game-passes.md) for the fields.

## Settings

What a **new** player's settings start as. Players' own choices are saved, so this doesn't change existing players.

| Field | Default |
| :-- | :-- |
| `quickResetDelay` | `1` |
| `restartOnDeath` | `false` |
| `highFPSPhysicsFix` | `false` |
| `fpsCap` | `"Off"` |
| `alignmentButtons` | `false` |
| `emoteButtons` | `false` |
| `transparentAccessories` | `false` |
| `towerLoadingBehavior` | `"Unload Towers"` |
| `fpsDisplay` | `false` |
| `hideTimer` | `false` |
| `hideUI` | `false` |
| `hideDisabledItems` | `false` |
| `invisiblePlayers` | `"Off"` |
| `mobileDPad` | `"Off"` |
| `hideCosmetics` | `"Off"` |
| `keyDisplayLimit` | `5` |
| `hideBubbleChat` | `false` |
| `alignmentDot` | `false` |
| `audioVisualizer` | `"Off"` |
| `musicVolume` | `0.5` |
| `checkpointCamera` | `true` |
| `checkpointTransparency` | `0.5` |
| `keybinds` | see [Settings](./settings.md) |

What each does, and the allowed values, are on [Settings](./settings.md).

## Chat

`tags` gives players chat tags, `messages` holds the win messages, and `webhooks` the Discord ones. See [Chat](./chat.md) and [Announcements & Webhooks](./announcements-webhooks.md).

## Admin

Who can use the admin console. See [Admin Commands](./commands.md). The owner of the experience always can.

## Visuals

Colours, sounds and timings for the kit's own UI.

| Section | Controls |
| :-- | :-- |
| `completions` | Completions menu colours, and how fast a 100% bar cycles. |
| `towerSigns` | Portal signs and chart lines on the towers. |
| `towerRush` | The tower list during a rush. |
| `menu` | Selected tabs, toggles, equipped cosmetics, shop text. |
| `shopBuyButton` | The Buy button, affordable and not. |
| `allJumpsMarker` | The All Jumps checkpoint block's colour and material. |
| `menuSounds` | Click, hover, notification and victory sounds. |
| `timing` | Animation lengths, and how long notifications stay up. |
| `audioVisualizerStrength` | How hard each Audio Visualiser option shakes the camera. |

Difficulty colours are in `Towers`, rarity colours in `Economy`.

## Messages

Every line of text players read, apart from win messages and chat tags (those are in `Chat`). Reword or translate them freely. Text in `{Braces}` is filled in for you; each message's comment says which it takes.

| Group | Holds |
| :-- | :-- |
| `loading` | The loading screen. |
| `ringSelect` | The hub screen. |
| `dataKicks` | Kicks for unusable saves. |
| `wins` | The `[GLOBAL]` and `[SERVER]` prefixes. |
| `rewards` | Ticket payouts. |
| `teleports` | Teleport refusals and the loading screen's "Teleporting...". |
| `friends` | Joining friends. |
| `personalServers` | Personal servers. |
| `durations` | "a week", "10 minutes". |
| `towers` | Entering, testing and leaving towers. |
| `antiCheat` | Anti-cheat kick reasons. |
| `locks` | Area requirements, such as `Beat 12 Towers (3/12)`. |
| `teleportMenu` | The Teleport menu's buttons. |
| `shop` | The ticket shop. |
| `cosmetics` | Equipping cosmetics. |
| `completions` | The Completions chart. |
| `spectate` | The spectate panel. |
| `checkpoints` | The All Jumps checkpoint panel. |
| `settingsMenu` | Keybind rows, music, place version, the FPS counter. |
| `editLayout` | Edit UI Layout's buttons. |
| `allJumpsLeaderstat` | The All Jumps player list column. |
| `shopRotation` | The featured row changing. |
| `gifts` | Gifting passes. |
| `shutdown`, `shutdownKick` | Server shutdowns. |
| `kickedByAdmin` | An admin kick with no reason. |
| `commands` | Admin console refusals. |

::: warning After an update
A new release can add groups. The Output names any your `Messages` is missing; copy them from the new release.
:::

## Sharing Config between your places

Every place in your game needs the same `Config`. Make it a Roblox [package](https://create.roblox.com/docs/projects/assets/packages) so one change reaches them all:

1. In one place, right-click `ReplicatedStorage > Shared > Config` and choose **Convert to Package**. Package only `Config`.
2. In each other place, delete its `Config`, insert the package in the same spot, and tick **AutoUpdate** on the `PackageLink` inside it.
3. To change a setting, unlock the package (the link at the top of any Config script), edit, then right-click `Config` and **Publish to Package**.

::: warning Things that catch people out
- An unlocked, edited copy stops auto-updating until you publish it.
- Auto-update happens in Studio. **Publish every place** after a change, or live servers keep the old settings.
- Don't delete the `PackageLink`.
- Package the whole `Config`. The Tower Setup window's Setup tab warns about a package missing modules or behind the latest version.
- If you use Rojo, don't package `Config`; Rojo already keeps every place in step.
:::

The types behind each module are in `ReplicatedStorage > Shared > ConfigTypes`, which is what gives you autocomplete. You never need to edit it.
