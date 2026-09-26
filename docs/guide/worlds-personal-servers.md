# Worlds, Areas & Personal Servers

Configure the Teleport menu in `ReplicatedStorage > Shared > Config > Worlds`. This one ModuleScript owns the hub Place ID, every World and Area shown in the menu, access requirements, and the small Personal Server settings.

The word `areas` is intentionally neutral. An Area can be a Ring, a Zone, an Era, a subrealm, an event area, or any other destination. Each Area is one published Roblox place.

::: tip Everything below Ring 1 is an example
The kit ships two Worlds and eight Areas so you can see each unlock rule written down and watch the menus draw a real map. **They are meant to be deleted or rewritten as your own.** Only Ring 1 is real -- every tower the kit ships stands there. The rest all point at Ring 1's place, so entering one takes you to Ring 1 until you publish the place it stands for and put its ID in.

Several Areas sharing one Place ID is survivable but not tidy: the kit answers "which Area is this place?" with the first one listed, so ticket analytics tag every run as Ring 1 until the real IDs go in.
:::

## Add Worlds And Areas

Worlds are an ordered list, and each World has an ordered `areas` list:

```luau
{
	id = "World1",
	name = "World 1 (Rings)",
	areas = {
		{
			id = "Ring1",
			name = "Ring 1: Limbo",
			placeId = 73644886303842,
		},
		{
			id = "Ring2",
			name = "Ring 2: Desire",
			placeId = 1234567890,
			requirements = {
				towerCompletions = 6,
				difficulties = { Medium = 1 },
			},
		},
	},
},
```

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `id` | `string` | — | Short stable key used by the menu and server. Do not rename it after release. |
| `name` | `string` | — | Player-facing World or Area name. Change this whenever needed. |
| `placeId` | `number` | — | Roblox Place ID to enter. The place is hidden when this is `0`. It is also how the kit and the setup window work out which Area a place *is*. |
| `emblem` | `string` | none | Small icon shown beside this Area's towers on the Completions chart. |
| `image` | `string` | live thumbnail | Optional image override. Omit it to use the place's live Roblox primary thumbnail. |
| `requirements` | `table` | none | Optional access rules described below. Omit it for an open destination. |
| `sub` | `boolean` | `false` | Draws the Area in the narrower `SubPlace` card, so a subrealm reads as sitting under the Area above it. Presentation only — list order is what puts it there. |
| `disabled` | `boolean` | `false` | Optional temporary hide switch for either a World or Area. |

Add another World table to create another World tab. A World button is shown only when that World has at least one enabled Place ID. The first configured World is visible by default.

Keep every destination inside the same Roblox experience and publish the kit scripts to every place. That lets all places share Scribe player data, game-pass ownership, and Personal Server codes.

## Access Requirements

Each Area `id` is what a tower names in its `area` field in `Config > Towers`. That is how the kit knows which Ring a tower belongs to, and how it counts only the completions that belong to a World.

```luau
requirements = {
	towerCompletions = 15,
	difficulties = {
		Hard = 3,
		Difficult = 1,
	},
	requiredTowers = { "ToH" },
},
```

This example requires:

- 15 tower completions in the World;
- 3 completed Hard-or-higher towers;
- 1 completed Difficult-or-higher tower; and
- the exact tower acronym `ToH`.

| Requirement | Meaning |
| :-- | :-- |
| `towerCompletions` | Minimum number of different completed towers. |
| `difficulties` | Minimum completions at each named difficulty or harder. |
| `requiredTowers` | Exact tower acronyms that must be completed. |
| `requiredBadges` | Roblox badges the player has to own. |
| `elo` | Minimum [Elo](./elo.md). |
| `scope` | Omit for this World, or use `"All"` for every World. Does not reach `elo`. |

All fields are optional. Every completed tower counts once, and a harder completion also counts toward easier `+` requirements.

A requirement naming a tower or a difficulty Config does not have can never be
met, so it keeps the Area locked; the Output lists it when a server starts.

**Requirements are checked on arrival too.** A teleport between the places of
one experience does not have to come from the kit's menu — following a friend
from the Roblox friends list is enough — so each tower place checks the player
who arrives once their data has loaded, and sends anyone who has not unlocked
it back to the hub, telling them why. A badge only counts against them when
Roblox answered the lookup. Studio is never checked, and the administrators in
`Config > Admin` are let through, so a locked Area can still be built and
tested.

### Locking an Area behind a badge

```luau
requirements = {
	requiredBadges = {
		{ id = 2124567890, name = "Ring 1 Champion" },
	},
},
```

`name` is only what the refusal says — `Requires the Ring 1 Champion badge.` Leave it out and the refusal names the id, which is a number nobody can act on, so it is worth writing. It does not have to match the badge's real name.

Badges are checked **before** every other requirement, so a player missing a badge and a tower count is told about the badge. The others tell you what to go and beat; a badge nobody mentioned does not.

A badge the kit itself awards works here — put a tower's `badgeId` from `Config > Towers` in, and beating that tower opens the Area **during the same session**, without a rejoin. Badges awarded outside the kit need a rejoin to be noticed.

::: tip Why a badge and not a tower
`requiredTowers` is the better lock for "beat this tower", because it reads off saved progress and works the moment the kit records the win. A badge is worth reaching for when the thing you are gating on happened somewhere the kit cannot see — an event, another game of yours, a badge you award by hand.
:::

::: warning A badge check is a web call
Ownership is fetched once when a player joins and kept on them from there, because the Teleport menu reads the rule while it is drawing and cannot wait. If Roblox does not answer, every gated Area stays locked and the next join asks again — the server refuses a teleport it cannot justify rather than guessing.
:::

Requirements count towers configured under the matching World by default. Add `scope = "All"` when progression should count completions from every configured World, as EToH now does for some cross-World unlocks.

The client shows `Locked` and explains the missing requirement when clicked. The server checks the same rule again before any teleport, so changing the UI cannot bypass progression.

::: warning `scope` is the one that catches people out
A World whose Areas hold no towers of their own — a Zones world, say, while all your towers are still in Rings — can never satisfy a `towerCompletions` or `difficulties` rule without `scope = "All"`. The count is zero no matter what the player beats, and the Area stays locked forever with a refusal that looks correct.
:::

### Locking an Area behind Elo

```luau
requirements = {
	elo = 2500,
},
```

`elo` asks for a minimum [Elo](./elo.md). One number covers both modes, with
an All-jumps clear folded in at its own weight, so there is one field rather
than one per mode.

Elo is the one requirement `scope` does not reach: it already counts every
tower a player has beaten, in every World. That makes it the rule that still
works in a World holding no towers of its own -- the trap that catches
`towerCompletions` out.

It also locks progression to **depth** in a way a count cannot. Elo points
multiply per difficulty tier, so a hundred Easy towers do not reach what one
Catastrophic is worth, and an Area behind `elo` cannot be opened by grinding
the easiest thing you ship.

The refusal says the number and the distance -- `Requires 2500 Elo
(1840/2500).` -- because there is nothing to name. Elo is asked **last**, the
mirror of the badge rule: a number to grind is the least useful thing to hear
while a named tower is still missing.

::: tip Pick one
An Area behind both `towerCompletions` and `elo` is asking for the same
thing twice, and a player who satisfies the harder of the two usually has the
other already. Use Elo where you want depth and a count where you want breadth.
:::

### Worked examples

The example Areas `Config > Worlds` ships each write a rule down, with a comment beside it saying what it does. Here the rules are worked through again as one `worlds` list you can paste over the shipped one while you find your feet. The Place IDs are placeholders; the tower acronyms are the ones `Config > Towers` ships.

```luau
worlds = {
	{
		id = "World1",
		name = "World 1 (Rings)",
		areas = {
			{
				id = "Ring1",
				name = "Ring 1: Limbo",
				placeId = 1234567890,
			},
			{
				id = "Ring1Sub",
				name = "Ring 1.5: The Landing",
				placeId = 1234567891,
				sub = true,
				requirements = { towerCompletions = 1 },
			},
			{
				id = "Ring2",
				name = "Ring 2: Ascent",
				placeId = 1234567892,
				requirements = {
					towerCompletions = 6,
					difficulties = { Medium = 1 },
				},
			},
			{
				id = "Ring2Sub",
				name = "Ring 2.5: The Spire",
				placeId = 1234567893,
				sub = true,
				requirements = {
					difficulties = { Difficult = 3, Insane = 1 },
				},
			},
		},
	},
	{
		id = "World2",
		name = "World 2 (Zones)",
		areas = {
			{
				id = "Zone1",
				name = "Zone 1: The Divide",
				placeId = 1234567894,
				requirements = { towerCompletions = 3, scope = "All" },
			},
			{
				id = "Zone1Sub",
				name = "Zone 1.5: Forgotten Ridge",
				placeId = 1234567895,
				sub = true,
				requirements = { requiredTowers = { "ETV5", "ETV6" } },
			},
			{
				id = "Zone2",
				name = "Zone 2: The Abyss",
				placeId = 1234567896,
				requirements = {
					requiredTowers = { "ToDA" },
					towerCompletions = 8,
					difficulties = { Remorseless = 2, Insane = 1 },
					scope = "All",
				},
			},
		},
	},
},
```

| Area | Rule | What it shows |
| :-- | :-- | :-- |
| `Ring1` | none | An open destination. |
| `Ring1Sub` | `towerCompletions = 1` | The cheapest lock to open — one tower. |
| `Ring2` | `towerCompletions` + `difficulties` | Two conditions, both required. |
| `Ring2Sub` | `difficulties` only | The rule on its own, across two tiers. |
| `Zone1` | `towerCompletions` + `scope = "All"` | Counting towers from another World. |
| `Zone1Sub` | `requiredTowers` | Named towers; the refusal says which is missing. |
| `Zone2` | all four together | What a final destination usually wants. |

`Ring2Sub` is the one worth reading. It asks for `{ Difficult = 3, Insane = 1 }`, and because each number means that tier **or harder**, one Insane clear counts toward both lines — so three Difficult+ where one is Insane+ opens it, while three Difficult+ that stop at Remorseless stay locked on the second line. A `towerCompletions` alongside it would have hidden that, which is why it has none.

Every World 2 Area above carries `scope = "All"`, because every tower the kit ships stands in Ring 1. Drop the scope from `Zone1` and it never opens, however many towers a player beats.

### Only one reason at a time

A player is told a single reason, and the rules are checked in a fixed order: **`requiredBadges`, then `requiredTowers`, then `towerCompletions`, then each difficulty from the easiest named tier upward, then `elo`.** Somebody missing everything is told about the badge, then the named tower, and only hears about the count once they have both.

`Zone2` above combines all four so you can watch that happen:

| Beaten | Told |
| :-- | :-- |
| nothing | `Requires completion of ToDA.` |
| ToDA | `Requires 8 tower completions (1/8).` |
| ToDA + 7 easier | `Requires 2 Remorseless+ tower completions (1/2).` |
| + one Remorseless | opens |

Stacking four rules on the Area everyone is trying to reach reads as the game moving the goalposts unless your own wording says what is coming — so say it in the Area's name or in a sign beside the portal, not in the refusal.

## EToH-Style Reference

The kit follows EToH's shape — Areas grouped into Worlds, each unlocked by
completions and difficulty — without copying its progression values.

For reference, the current World 1 main-ring pattern is:

| Ring | Tower completions | Additional completions |
| :-- | --: | :-- |
| Ring 0 | 0 | None |
| Ring 1 | 3 | None |
| Ring 2 | 6 | 1 Medium+ |
| Ring 3 | 10 | 1 Hard+ |
| Ring 4 | 15 | 3 Hard+, 1 Difficult+ |
| Ring 5 | 22 | 3 Difficult+, 1 Challenging+ |
| Ring 6 | 30 | 5 Difficult+, 2 Challenging+ |
| Ring 7 | 39 | 4 Challenging+, 1 Intense+ |
| Ring 8 | 49 | 6 Challenging+, 2 Intense+ |
| Ring 9 | 60 | 4 Intense+, 1 Remorseless+ |

These values are a design reference, not kit defaults. Sources: [EToH Realms](https://jtoh.fandom.com/wiki/Realm), [Ring Select](https://jtoh.fandom.com/wiki/Ring_Select), and the individual Ring pages such as [Ring 2](https://jtoh.fandom.com/wiki/Ring_2) and [Ring 8](https://jtoh.fandom.com/wiki/Ring_8).

## Existing Teleport Menu UI

The controller uses the authored Studio UI below. It does not create fallback designs:

```text
StarterGui
  MainMenu
    Main
      MenusContainer
        TeleportMenu
          OptionsHolder
            World1Button
            World2Button
            Friend
            PS
          World1Menu
            Place
              PlaceName
              EnterButton
              PSButton
            SubPlace
          World2Menu
            Place
          PSMenu
            InputCode
            JoinCode
          JoinFriendMenu
            Friend
              EnterButton
              PlayerInfo
              PlayerThumb
            InfoLabel
        SettingsMenu
          SettingsSidebar
            PSButton
          PSFrame
            ToggleServerCode
              ToggleButton
            ServerCodeFrame
              CodeBox
              RegenButton
```

`World1Button` and `World1Menu` are the reusable templates, and so are **`World1Menu`'s `Place` and `SubPlace` — the only two cards, used by every World.** Existing World 2 instances are reused; later Worlds are runtime clones of the authored World 1 templates.

Every Area is cloned from `Place` unless it sets `sub = true`, which draws it from `SubPlace` instead — the narrower card, for a subrealm under the Area above it. Both come from World 1's menu wherever the Area lives, so restyling a card is one edit and a World cannot drift from the rest. A card left in any other menu is treated as a leftover template and hidden; you can delete it. Without a `SubPlace` at all, every Area draws full-width rather than losing the destination. Place cards use Roblox's `GameThumbnail` content URI unless `image` is configured.

Do not rename the template descendants. Style and resize them normally in Studio.

## Join Friend

The `Friend` tab lists online friends who are inside one of your Areas, one row per friend cloned from `JoinFriendMenu > Friend`:

- The row's own image is that Area's picture -- `image` from `Config > Worlds` when set, and the place's Roblox `GameThumbnail` otherwise, the same as a place card.
- `PlayerThumb` is the friend's headshot, drawn straight from `rbxthumb://type=AvatarHeadShot`.
- `PlayerInfo` reads `DisplayName (Area)`, using the Area's own `name` -- `simply_kiel (Ring 1: Limbo)`.
- `EnterButton` teleports into that friend's server. A friend already in this server gets `Here` instead, and the button says so rather than doing anything.

A friend only appears if the local player has met that Area's `requirements`. Someone playing a Ring you have not unlocked is not listed at all, and the list refreshes each time the tab is opened, at most once every ten seconds.

`InfoLabel` is the panel's content when there are no rows. It says which reason
applies: nobody playing, nobody in an Area you have unlocked, the friends list
failed to load, or your data has not arrived yet.

All four strings are in `Config > Messages` under `friends`.

The list is built on the client because it cannot be built anywhere else:
`Player:GetFriendsOnlineAsync` answers the LocalPlayer and errors elsewhere, and
no server API carries presence.

So the client reports the Area and server it found, and **the server re-checks
that Area against the player's saved progress** before teleporting anyone.

### Friends in personal servers

Roblox does not say whether a server is a reserved one. `GetFriendsOnlineAsync` returns a place id and a job id and nothing that distinguishes a personal server from a public one, so a friend inside theirs is listed and their `EnterButton` looks like any other.

The teleport does not fail either.
[`ServerInstanceId`](https://create.roblox.com/docs/reference/engine/classes/TeleportOptions)
opens a *new public server* when no match is found, so the player lands in the
right Area alone.

The kit says so on arrival instead, with `friends.couldNotJoin`. The same notice
covers a full server and a friend who left mid-teleport — indistinguishable from
here.

## Personal Servers

The included `PersonalServers` game pass is enabled in `Config > GamePasses`.

- A pass owner clicks a Realm's `PSButton` to reserve that Realm and teleport there.
- The new personal server starts private, with no active share code.
- In the personal server, `SettingsMenu > SettingsSidebar > PSButton` opens the personal server controls. It is shown to the owner only, since the server refuses those controls to anyone else.
- The owner can turn on `ToggleServerCode` to create a share code. `ServerCodeFrame > CodeBox` displays it through the `Text` property, and `RegenButton` invalidates it and creates a replacement.
- Turning the toggle off invalidates the active share code and hides `ServerCodeFrame`.
- Anyone can enter that code and click `JoinCode`; joining does not require the pass.
- The reserved access code never goes to a client. The settings endpoint sends the 16-character lowercase hexadecimal share code only to the owner; guests receive only whether sharing is enabled.
- When the owner leaves, the code expires and remaining players return to the hub after `ownerLeaveGracePeriod` (10 minutes by default). If the owner comes back within it, the countdown is called off.
- **Rejoin** in the settings menu puts a player back into the same personal server, through its access code rather than a public server.
- In the hub, Ring Select's [server list](./ring-select.md#friends-and-servers) makes one for the Area on screen, joins one by its code, and takes an owner back to the one they left while it is still open.

A personal server belongs to **one Area**, because a reserved server is reserved
in one place.

Changing Area therefore leaves it behind. The kit warns before the teleport
rather than letting the player work it out from the sudden company — everyone
who wants to stay together needs a fresh code in the new Area.

The two settings are intentionally small:

```luau
personalServers = {
	codeLength = 16,
	ownerLeaveGracePeriod = 10 * 60,
},
```

`codeLength` is kept between 8 and 30 characters whatever you write, and `ownerLeaveGracePeriod` is in seconds. Guests are warned when the owner leaves, and if the return to the hub fails they are removed with `personalServers.ownerLeftKick` from `Config > Messages`.

Roblox teleports and reserved servers do not run in Studio playtests. Publish all places, enable Studio API access only when intentionally testing MemoryStore, and perform the final flow in the Roblox app.

See Roblox's official [Teleport between places](https://create.roblox.com/docs/projects/teleport), [Memory stores](https://create.roblox.com/docs/cloud-services/memory-stores), and [asset URI](https://create.roblox.com/docs/projects/assets#rbxthumb) documentation.

## See Also

- [Ring Select](./ring-select.md) -- the hub, which draws this same map for players to pick from
- [Configuration Reference: Worlds](./configuration.md#worlds)
- [Game Passes](./game-passes.md)
