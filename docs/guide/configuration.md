# Configuration Reference

All of the kit's settings are ModuleScripts in `ReplicatedStorage > Config`.
Open one, change a value, and press Play. Every setting has a comment above it
saying what it does, so this page is a map of where things are rather than a copy
of those comments.

| Module | What it controls | More detail |
| :-- | :-- | :-- |
| `Project` | Save keys, words, timings, game modes, build warnings | [Below](#project) |
| `Towers` | Your towers, tower types, difficulties and rushes | [Below](#towers) |
| `Worlds` | Worlds, Areas, unlock rules and personal servers | [Worlds & Personal Servers](./worlds-personal-servers.md) |
| `RingSelect` | The hub's screen | [Ring Select](./ring-select.md#config-ringselect) |
| `Economy` | Tickets, the shop and cosmetics | [Below](#economy) |
| `Elo` | How much each tower is worth | [Player Elo](./elo.md) |
| `Modifiers` | The modifiers players can pick, and what they pay | [Modifiers](./modifiers.md#config) |
| `GamePasses` | Your game passes | [Game Passes](./game-passes.md) |
| `Settings` | The settings and keys new players start with | [Settings](./settings.md) |
| `CustomSettings` | Settings you add yourself | [Adding a Saved Setting](./custom-settings.md) |
| `Chat` | Chat tags, win messages and Discord webhooks | [Chat](./chat.md) |
| `Credits` | The Credits page, opened from the ⓘ button | [UI & HUD](./ui-and-hud.md#credits) |
| `Admin` | Staff roles and which commands each one can use | [Admin Commands](./commands.md) |
| `Visuals` | Colours, sounds and timings for the kit's UI | [Below](#visuals) |
| `Messages` | Every other line of text players read | [Below](#messages) |

::: tip Config is checked when a server starts
If something in Config doesn't add up, such as a tower in an Area that doesn't
exist, the Output lists it under **Ascent Config** and names the line to fix.
:::

## Turning features on and off

The kit ships with the simpler features on. To add more, or keep your game
simple, change these:

| Feature | Setting | Ships |
| :-- | :-- | :-- |
| [Elo](./elo.md) | `enabled` in `Config > Elo` | Off |
| [Modifiers](./modifiers.md) | `enabled` in `Config > Modifiers` | Off |
| [Saved runs](./saved-runs.md) | `savedRuns.enabled` in `Config > Project` | Off |
| [The shop's daily items](./ticket-shop.md#daily-items) | `shop.featured.enabled` in `Config > Economy` | Off |
| [All Jumps, Practice](./practice-all-jumps.md) | `allJumpsEnabled`, `practiceEnabled` in `Config > Project` | On |
| [Leaderboards](./ui-and-hud.md#leaderboards-menu) | `leaderboardsEnabled` in `Config > Project` | On |
| [Personal servers](./worlds-personal-servers.md#personal-servers) | `personalServers.enabled` in `Config > Worlds` | On |
| [Tickets, the shop, cosmetics](#economy) | `enabled` in `Config > Economy` | On |
| [Admin console](./commands.md) | `enabled` in `Config > Admin` | On |

Turning a feature off removes its menu, and the server stops accepting it.
Players keep what they earned, and get it back if you turn it on again.

::: warning Some names are saved forever
Tower acronyms, shop item IDs, cosmetic IDs, game pass keys, custom setting keys,
and World and Area IDs are all saved with players. If you rename one after
release, players lose whatever they earned under the old name.
:::

## Project

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `configVersion` | `2` | Which version of Config this is. Only change it when [Updating Ascent](./updating.md) tells you to. |
| `towerWord`, `towerWordPlural` | `"Tower"`, `"Towers"` | What your game calls a tower, in the menus. |
| `currencyWord`, `currencyWordPlural` | `"ticket"`, `"tickets"` | What your game calls its currency. |
| `teamNames.start`, `teamNames.winners` | `"Start"`, `"Winners"` | The names of your two teams. Both teams must exist in `Teams`. |
| `emotes` | `{ "dance2", "laugh", "cheer" }` | The emotes players can use. See [Adding an emote key](./settings.md#adding-an-emote-key). |
| `fpsCaps` | `{ 60, 75, 90, 144, 165, 240 }` | The frame rates the [FPS Cap](./settings.md#fps-cap) setting offers. |
| `allJumpsEnabled`, `practiceEnabled` | `true` | Set to `false` to remove that mode from the whole game. |
| `leaderboardsEnabled` | `true` | Set to `false` to remove the Leaderboards menu. |

The emotes you can list are Roblox's built-in ones: `dance`, `dance2`, `dance3`,
`laugh`, `cheer`, `point` and `wave`.

### Saved data

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `dataStoreKey` | `"ASCENT_STABLE"` | Where player progress is saved in the published game. Change this to your own. |
| `dataStoreKeyStudio` | `"STUDIO_KEY_1_SCRIBE"` | A separate save that's only used in Studio. |
| `dataStoreStudioMode` | `"Mock"` | How Studio saves. `"Mock"` forgets everything when you stop. `"Live"` saves to the Studio key. `"NoSave"` loads the Studio key but never saves to it. |

::: danger
Changing a save key starts everyone on an empty save.
:::

### Timings

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `timings.touchDebounce` | `0.1` | Seconds before a part reacts to the same player touching it again. |
| `timings.teleportCooldown` | `1.5` | The shortest time, in seconds, between two teleports by one player. |
| `timings.teleportTimeout` | `30` | Seconds to wait before a teleport counts as failed. |
| `timings.maximumQuickResetDelay` | `3` | The longest Hold Time a player can pick for restarting. |
| `timings.doubleTapRestartWindow` | `0.4` | How quickly, in seconds, the two presses of a double-tap restart must come. |
| `timings.shutdownWarnings` | `{ 300, 120, 60, 30, 15 }` | How many seconds before a shutdown players get warned. |
| `timings.shutdownNotice` | `8` | Seconds each shutdown warning stays on screen. |
| `timerSyncInterval` | `2` | Seconds between the server correcting each player's timer. |
| `checkpointInterval` | `0.25` | Seconds between checks of which checkpoint a player has reached. |
| `restartCooldown` | `0.1` | The shortest time, in seconds, between two restarts. |
| `restartResetsTowerRush` | `true` | Restarting during a rush goes back to its first tower. `false` restarts just the current tower. |

### Winpads and other settings

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `winpadInterval` | `0.25` | Seconds between winpad colour changes. |
| `winpadsChangeColor`, `winpadsChangeMaterial` | `true` | Whether winpads flash while someone is in the tower. |
| `useDisplayName` | `false` | Use display names instead of usernames in win messages. |
| `teleportHeight` | `3` | How many studs above a checkpoint or marker a player lands. |
| `allJumpsMarkerSize` | `2, 2, 1` | The size of the block an All Jumps checkpoint shows as. |
| `savedRuns` | Off, 7 slots | See [Saved Runs](./saved-runs.md#set-it-up). |
| `hidePlayersNearDistance` | `10` | How close, in studs, another player must be to be hidden by the **Near** option of Hide Players. |

### Build warnings

These print a warning in the Output while you build. Once your game is finished,
set them to `false` so live servers stay quiet.

| Setting | Warns when |
| :-- | :-- |
| `checkpointsMissingWarning` | A tower has no checkpoints. |
| `noMinimumTimeWarning` | A tower has no `minimumTime`. |
| `r15Warning` | The game isn't set to R6. |
| `uncataloguedTowerWarning` | A tower in this place isn't listed in `Config > Towers`. |

## Towers

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

The key (`ToH`) is the tower's acronym, and it must match the tower's name in
`Workspace > Towers`. **Every tower needs an entry here**, or no other place knows
it exists. The [Ascent Setup plugin](./tower-setup-plugin.md#making-a-tower)
can write the line for you.

| Setting | Required | What it does |
| :-- | :-- | :-- |
| `name` | Yes | The tower's full name, which players see. |
| `difficulty` | Yes | `5.33` is a Low Challenging. See [Difficulties](./difficulties.md). |
| `area` | Yes | The `id` of the Area the tower is in. |
| `badgeId` | No | A badge for beating the tower. |
| `ajBadgeId` | No | A badge for beating it in All Jumps. |
| `minimumTime` | No | The fastest time, in seconds, that a real player could beat it in. Faster wins are refused. |
| `towerPoints` | No | How many points beating it is worth. Defaults to `1`. |
| `allJumpsPoints` | No | Points for beating it in All Jumps. |
| `type` | No | Its tower type, such as `"Citadel"`. See [Tower types](./difficulties.md#tower-types). |
| `noBoosts` | No | `true` bans boost items in this tower, and `false` allows them, whatever its type says. |
| `extended` | No | Marks an event tower. See [Extended Completions](./ui-and-hud.md#extended-completions). |
| `warning` | No | Warns players before they climb. See [A warning before climbing](./tower-setup.md#a-warning-before-climbing). |

You can also set most of these as attributes on the tower itself. See
[Building a Tower](./tower-setup.md). Endings are set on the winpads. See
[Winpads & Endings](./winpads-endings.md).

Tower types, difficulties and difficulty categories are on
[Difficulties](./difficulties.md). Rushes are on [Tower Rushes](./tower-rushes.md), and
badges for goals, such as beating 10 towers, are on [Badges](./badges.md).

## Economy

| Setting | Default | Set to `false` to turn off |
| :-- | :-- | :-- |
| `enabled.tickets` | `true` | Tickets, and the shop with them. |
| `enabled.shop` | `true` | The ticket shop. Players still earn tickets. |
| `enabled.cosmetics` | `true` | The Cosmetics menu and every trail and aura. |
| `enabled.cosmeticCategories.Trails`, `.Auras` | `true` | Just trails, or just auras. |

Turning something off removes its menu and the server stops accepting it.
Players keep what they have, and get it back if you turn it on again.

Tickets and the shop are explained on [Tickets & Shop](./ticket-shop.md), and
cosmetics on [Cosmetics](./cosmetics.md). `rarityColors` sets the colour of each
of the five rarities.

## GamePasses

One entry per game pass. Roblox supplies each pass's name, price and picture, so
Config only says what the pass does. See [Game Passes](./game-passes.md).

## Settings

The settings and keys a **new** player starts with. Players who have already
changed a setting keep their own choice. Every setting and key is listed on
[Settings](./settings.md).

## Chat

| Part | What it holds | Page |
| :-- | :-- | :-- |
| `tags` | Chat tags, such as `[Owner]` | [Chat](./chat.md) |
| `messages` | The win messages in chat | [Chat](./chat.md#win-messages) |
| `webhooks` | Discord posts for wins | [Announcements & Webhooks](./announcements-webhooks.md) |
| `farMessages` | Messages when a run ends far up a hard tower | [Far messages](./announcements-webhooks.md#far-messages) |
| `antiCheatKickMessages` | The chat line when the anti-cheat kicks someone | [Announcements & Webhooks](./announcements-webhooks.md) |

## Admin

Your staff roles, given by user ID or group rank, and which roles can use which
commands. The experience's owner always has the top role. See
[Roles and permissions](./commands.md#roles-and-permissions).

## Visuals

Colours, sounds and timings for the kit's own UI. The menu's and HUD's colours,
fonts and sizes are in `ReplicatedStorage > Design` instead. See
[Styling the Menu & HUD](./styling.md).

| Setting | What it controls |
| :-- | :-- |
| `completions` | The Completions chart's colours, and how fast a 100% bar cycles through the rainbow (`rainbowSpeed`). |
| `towerSigns` | The colours a tower's signs change to once it's beaten. See [Signs that change colour](./tower-setup.md#signs-that-change-colour). |
| `towerRush` | The tower list shown during a rush. |
| `allJumpsMarker` | The colour and material of All Jumps checkpoint blocks. |
| `timing` | How long animations take, how long notifications stay up, how fast the loading dots move, Hide UI's fades, and how long the FPS key notice stays up. |
| `audioVisualizerStrength` | How hard each Audio Visualizer option shakes the camera. |
| `flipIndication` | The colours of the Flip Indication preview. |
| `screenScaling` | Makes the menu, HUD, backpack and music button bigger on screens above 1080p, up to twice the size on 4K. Remove it to keep them at their built size. |
| `cosmeticPreview` | How far behind (`distance`) and above (`height`) the cosmetic preview camera sits. |
| `layoutEditor` | The colours of Edit UI Layout's backdrop, guides and outlines. Its buttons are `HUD > EditLayoutBar`, and its backdrop, guides, grip and outline are in `HUD > EditLayoutParts`. |

Difficulty colours are in `Towers`, and rarity colours in `Economy`.

## Messages

Every line of text players read is here, except win messages and chat tags,
which are in `Chat`. Reword or translate anything you like.

- Words in `{Braces}` are filled in by the game. Each message's comment lists the
  ones it can use.
- Notifications use [rich text](https://create.roblox.com/docs/ui/rich-text), so
  `<b>bold</b>` works, and a plain `&` must be written as `&amp;`.

| Group | Holds |
| :-- | :-- |
| `loading` | Every loading screen's text. |
| `ringSelect` | The hub's screen. |
| `dataKicks` | What a player is told if their save can't be used. |
| `wins` | The `[GLOBAL]` and `[SERVER]` tags in front of win messages. |
| `rewards` | Ticket payouts. |
| `personalBests` | New personal bests, and the best time shown on the HUD. |
| `leaderboards` | The Leaderboards menu. |
| `savedRuns` | The Saved Runs menu. |
| `modifiers` | The Modifiers menu and the HUD's modifier line. |
| `teleports` | Teleports that fail or are refused. |
| `friends` | Joining friends. |
| `personalServers` | Personal servers. |
| `lagFree` | [Lag free servers](./worlds-personal-servers.md#lag-free-servers). Remove the group to turn them off. |
| `durations` | Lengths of time, such as "a week" and "10 minutes". |
| `towerWarning` | The warning before a tower. |
| `confirmations` | The "Are you sure?" questions. |
| `towers` | Entering, testing and leaving towers. |
| `antiCheat` | Why a player was kicked by the anti-cheat. |
| `locks` | Area unlock rules, such as `Beat 12 Towers (3/12)`. |
| `teleportMenu` | The Teleport menu. |
| `shop` | The ticket shop. |
| `cosmetics` | The Cosmetics menu. |
| `completions` | The Completions menu. |
| `spectate` | The spectate bar. |
| `checkpoints` | The All Jumps checkpoint panel. |
| `settingsMenu` | The Settings menu, including key names and the Controls tab's hints. |
| `editLayout` | Edit UI Layout's buttons. |
| `allJumpsLeaderstat` | The All Jumps column in the player list. |
| `shopRotation` | The shop's featured items changing. |
| `gifts` | Gifting game passes. |
| `shutdown`, `shutdownKick` | Server shutdowns. |
| `kickedByAdmin` | An admin kick with no reason given. |
| `commands` | The admin console refusing a command. |

::: warning After an update
A new version of Ascent can add message groups. If your `Messages` is missing
one, the Output names it when the server starts. Copy that group in from the new
version's `Messages`.
:::

## Sharing Config between your places

Every place in your game needs the same `Config`. The easiest way to keep them
the same is to turn `Config` into a Roblox
[package](https://create.roblox.com/docs/projects/assets/packages), so one change
reaches every place.

1. In one place, right-click `ReplicatedStorage > Config` and choose
   **Convert to Package**.
2. In every other place, delete its `Config`, insert the package in the same
   spot, and turn on **AutoUpdate** on the `PackageLink` inside it.
3. To change a setting later, unlock the package (the link at the top of any
   Config script), make your change, then right-click `Config` and choose
   **Publish to Package**.

::: warning Things that catch people out
- A copy you've unlocked and edited stops updating until you publish it.
- Packages only update in Studio. After a change, **publish every place**, or
  live servers keep the old settings.
- Don't delete the `PackageLink`.
- Package the whole `Config` folder. The plugin's **Check** window warns if a
  package is missing modules or is out of date.
- If you use Rojo, don't package `Config`. Rojo already keeps every place the same.
:::

You'll also see `ReplicatedStorage > Shared > ConfigTypes`. It describes what each
Config setting can be, which is what gives you autocomplete. You never need to
edit it.
