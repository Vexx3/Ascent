# Worlds, Areas & Personal Servers

`Config > Worlds` is the map of your game. A **World** is a group of Areas, shown as a tab. An **Area** is one published Roblox place: a Ring, a Zone, a subrealm. Towers say which Area they are in by naming its `id`.

::: tip Everything below Ring 1 is an example
The kit ships two Worlds and eight Areas to show each unlock rule. Only Ring 1 is real; the others point at Ring 1's place until you put in your own Place IDs. Delete or rewrite them.
:::

## Add Worlds And Areas

```luau
hubPlaceId = 1234567890,
worlds = {
	{
		id = "World1",
		name = "World 1 (Rings)",
		areas = {
			{ id = "Ring1", name = "Ring 1: Limbo", placeId = 73644886303842 },
			{
				id = "Ring2",
				name = "Ring 2: Desire",
				placeId = 1234567890,
				requirements = { towerCompletions = 6, difficulties = { Medium = 1 } },
			},
		},
	},
},
```

The order you write them in is the order players see them.

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `id` | — | Stable key. Saved with players, so never rename it after release. |
| `name` | — | What players see. |
| `placeId` | — | The place to send players to. `0` hides the Area. |
| `emblem` | none | Small icon beside this Area's towers on the Completions chart. |
| `image` | the place's thumbnail | Picture on the Area's card. |
| `requirements` | none | Unlock rules, below. |
| `sub` | `false` | Draws it as a subrealm, on the narrower card under the Area above it. |
| `disabled` | `false` | Hides the Area, or a whole World. |

At the top of the file:

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `hubPlaceId` | — | Where **Return to Hub** sends players. |
| `personalServers.codeLength` | `16` | Characters in a share code, 8–30. |
| `personalServers.ownerLeaveGracePeriod` | `600` | Seconds a personal server stays open after its owner leaves. |

Every place must be in the **same Roblox experience**, so they share player saves, passes and personal server codes.

## Access Requirements

```luau
requirements = {
	towerCompletions = 15,
	difficulties = { Hard = 3, Difficult = 1 },
	requiredTowers = { "ToH" },
},
```

| Field | The player needs |
| :-- | :-- |
| `towerCompletions` | This many different towers beaten. |
| `difficulties` | This many at each difficulty **or harder**. A harder tower counts toward every easier line. |
| `requiredTowers` | These exact towers beaten. |
| `requiredBadges` | These Roblox badges. |
| `elo` | At least this much [Elo](./elo.md). |
| `scope` | Leave out to count only this World's towers; `"All"` counts every World. Does not affect `elo`. |

Players see each rule with their progress, such as `Beat 12 Towers (3/12)`. The Teleport menu shows the first one not met; the hub lists them all (see [Ring Select](./ring-select.md#locked-areas)). The wording is `locks` in `Config > Messages`.

The server checks again before every teleport. A tower place also checks each player who arrives and sends anyone locked out back to the hub, except in Studio and for admins, so you can still build a locked Area.

::: warning `scope` catches people out
A World with no towers of its own can never meet a `towerCompletions` or `difficulties` rule without `scope = "All"`. The count stays at zero and the Area never opens.
:::

### Locking an Area behind a badge

```luau
requiredBadges = {
	{ id = 2124567890, name = "Ring 1 Champion" },
},
```

`name` is what players are told; without it they see the badge's number. A badge a tower awards (its `badgeId`) opens the Area straight away. A badge given outside the kit is noticed on the next join.

For "beat this tower", `requiredTowers` is simpler. Use a badge for things the kit cannot see, like an event.

### Locking an Area behind Elo

```luau
requirements = { elo = 2500 },
```

Elo counts every tower in every World, in both modes, and harder towers are worth far more. So an Elo rule asks for **depth**: a hundred Easy towers don't add up to one Catastrophic. It also works in a World with no towers of its own.

### The order rules are asked in

A player told one reason hears, in order: badges, named towers, the tower count, each difficulty from easiest up, then Elo.

### Worked examples

The shipped Areas each show one rule:

| Area | Rule |
| :-- | :-- |
| `Ring1` | none |
| `Ring1Sub` | `towerCompletions = 1` |
| `Ring2` | `towerCompletions = 6`, `difficulties = { Medium = 1 }` |
| `Ring2Sub` | `difficulties = { Remorseless = 2, Insane = 1 }` |
| `Ring3` | `requiredTowers = { "ToDNE" }`, `towerCompletions = 12` |
| `Zone1` | `towerCompletions = 10`, `scope = "All"` |
| `Zone1Sub` | `elo = 500` |
| `Zone2` | named towers, a count, a difficulty and Elo together, with `scope = "All"` |

For comparison, EToH's World 1 asks Ring 2 for 6 towers and 1 Medium+, Ring 5 for 22 and 3 Difficult+ and 1 Challenging+, Ring 9 for 60 and 4 Intense+ and 1 Remorseless+. See the [EToH wiki](https://jtoh.fandom.com/wiki/Realm).

## Teleport Menu UI

The Teleport menu uses these instances in `MainMenu`:

```text
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

`World1Button`, `World1Menu`, and `World1Menu`'s `Place` and `SubPlace` cards are the templates for every World. Style them in Studio, but keep the names. An Area with `sub = true` uses `SubPlace`.

## Join Friend

The `Friend` tab lists friends playing in Areas the player has unlocked, one row cloned from `JoinFriendMenu > Friend` each: the Area's picture, the friend's headshot (`PlayerThumb`), `PlayerInfo` reading `Name (Area)`, and `EnterButton` to join them. It refreshes when opened, at most every ten seconds. `InfoLabel` explains an empty list. The words are under `friends` in `Config > Messages`.

Roblox can't tell whether a friend is in a personal server. Joining one sends the player to a new public server of that Area instead, and they're told they could not join.

## Personal Servers

Set the `PersonalServers` pass's `id` in `Config > GamePasses` to sell them.

- A pass owner presses an Area's `PSButton` to make a personal server there and go to it. It starts private.
- In it, the owner's `SettingsMenu > SettingsSidebar > PSButton` opens the controls. `ToggleServerCode` creates a share code, shown in `CodeBox`. `RegenButton` replaces it. Turning the toggle off cancels it.
- Anyone can join with the code through `PSMenu`, pass or not.
- When the owner leaves, the server closes after `ownerLeaveGracePeriod` and guests go to the hub. They're warned when the owner leaves, and told if the owner comes back in time, which cancels the closing.
- **Rejoin** in settings returns a player to the same personal server.
- In the hub, the [server list](./ring-select.md#friends-and-servers) makes, joins and returns to personal servers.

A personal server belongs to one Area. Going to another Area leaves it, and the player is warned first.

Teleports and personal servers don't work in Studio playtests. Test them in the published game.

## See Also

- [Ring Select](./ring-select.md), the hub
- [Game Passes](./game-passes.md)
