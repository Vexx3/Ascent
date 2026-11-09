# Worlds, Areas & Personal Servers

`Config > Worlds` is the map of your game.

- An **Area** is one place in your game, such as a Ring, a Zone or a subrealm.
- A **World** is a group of Areas. Each World is a tab in the Teleport menu.

Each tower says which Area it's in with `area` in `Config > Towers`.

::: tip The shipped Areas are examples
The kit comes with two Worlds and eight Areas to show off every unlock rule.
Delete or rewrite everything after Ring 1.
:::

## Add Worlds and Areas

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

Players see Worlds and Areas in the order you write them. Every place must be in
the **same Roblox experience**.

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `id` | | The Area's ID. It's saved with players, so don't rename it after release. |
| `name` | | The name players see. |
| `placeId` | | The Place ID players are sent to. `0` hides the Area. |
| `emblem` | none | A small icon next to this Area's towers in the Completions menu. |
| `image` | the place's thumbnail | The picture on the Area's card. |
| `requirements` | none | What a player needs to unlock the Area. See [below](#access-requirements). |
| `sub` | `false` | Shows the Area as a subrealm, under the Area before it. |
| `disabled` | `false` | Hides the Area. Also works on a whole World. |
| `extended` | `false` | Marks an event or closed place. See [Extended Completions](./ui-and-hud.md#extended-completions). |

These go at the top of the file:

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `hubPlaceId` | | The hub's Place ID. **Return to Hub** sends players here. |
| `personalServers.enabled` | `true` | Set to `false` to turn [personal servers](#personal-servers) off. |
| `personalServers.codeLength` | `16` | How many characters a personal server's share code has, from 8 to 30. |
| `personalServers.ownerLeaveGracePeriod` | `600` | Seconds a personal server stays open after its owner leaves. |
| `personalServers.free` | `false` | Lets every player make personal servers, without the game pass. |
| `personalServers.lagFree` | `true` | Lets owners make [lag free servers](#lag-free-servers). |

## Access requirements

Add `requirements` to an Area to lock it until a player has earned it:

```luau
requirements = {
	towerCompletions = 15,
	difficulties = { Hard = 3, Difficult = 1 },
	requiredTowers = { "ToH" },
},
```

| Requirement | The player needs |
| :-- | :-- |
| `towerCompletions` | This many different towers beaten. |
| `difficulties` | This many towers beaten at each difficulty **or harder**. |
| `requiredTowers` | These exact towers beaten. |
| `requiredBadges` | These Roblox badges. |
| `elo` | At least this much [Elo](./elo.md). |
| `scope` | Leave it out to count only this World's towers. Set it to `"All"` to count towers from every World. |

A player needs every requirement listed. The menu shows each one with their
progress, such as `Beat 12 Towers (3/12)`. You can change the wording in the
`locks` group of `Config > Messages`.

::: warning A World with no towers needs `scope`
Without `scope = "All"`, a World with no towers of its own counts nothing, so its
`towerCompletions` and `difficulties` requirements can never be met.
:::

::: tip Lock the places too
In the Creator Dashboard, set **Access Control for Places** to **Secure within
universe only**. Then players can only reach an Area through the kit's teleports,
which check its requirements. See [Place settings](./getting-started.md#place-settings).
:::

### Behind a badge

```luau
requiredBadges = {
	{ id = 2124567890, name = "Ring 1 Champion" },
},
```

`name` is what the player is told they need. A badge a tower gives unlocks the Area
straight away. A badge given some other way is noticed the next time the player
joins.

### Behind Elo

```luau
requirements = { elo = 2500 },
```

Elo counts every tower in every World, in both Normal and All Jumps. While Elo is
off in `Config > Elo`, an Area doesn't ask for it, and the Output says so.

### Examples

These are the Areas the kit ships with:

| Area | Requirements |
| :-- | :-- |
| `Ring1` | None |
| `Ring1Sub` | `towerCompletions = 1` |
| `Ring2` | `towerCompletions = 6`, `difficulties = { Medium = 1 }` |
| `Ring2Sub` | `difficulties = { Remorseless = 2, Insane = 1 }` |
| `Ring3` | `requiredTowers = { "ToDNE" }`, `towerCompletions = 12` |
| `Zone1` | `towerCompletions = 10`, `scope = "All"` |
| `Zone1Sub` | `towerCompletions = 7`, `scope = "All"`. With Elo on, try `elo = 500`. |

## Personal servers

A personal server is a private copy of an Area that only the owner and people
they share a code with can join. To offer them, do one of these:

- **Sell them:** set the `PersonalServers` pass's `id` in `Config > GamePasses`.
- **Give them away:** set `personalServers.free = true` in `Config > Worlds`.

To turn personal servers off altogether, set `personalServers.enabled = false`.
Their switch, the join box and the hub's **Servers** button go too.

How players use them:

| To | Do this |
| :-- | :-- |
| Make one | Turn on **Personal Server** at the bottom of the Teleport menu, then press an Area's **Enter**. |
| Share it | Inside the server, the owner opens **Your Server** on the Servers tab and turns on the share code. **Regenerate** makes a new code. |
| Join one | Type the code at the top of the Servers tab. Anyone can join with a code, pass or not. |
| Get back in | **Rejoin** returns a player to the same server. |

- When the owner leaves, the server closes after `ownerLeaveGracePeriod` seconds
  and guests are sent to the hub. If the owner comes back first, it stays open.
- A personal server is for one Area only.
- Personal servers don't work in Studio.
- Players can also make, join and return to personal servers from the hub. See
  [Friends and servers](./ring-select.md#friends-and-servers).
- The switch's text is `personalServerOn` and `personalServerOff` in the
  `teleportMenu` group of `Config > Messages`.

## Lag free servers

A lag free server is a personal server with only the towers its owner picks, so
the place has less to run.

1. Turn on **Personal Server**. A box appears next to it.
2. Type the acronyms of the towers you want, separated by commas, such as
   `ToAST, ToEM`.
3. Press the Area's **Enter**.

- Every tower you type must be in that Area. If one isn't, the server isn't made
  and you're told why.
- Leave the box empty to make a normal personal server.
- Every other tower is removed from the server, along with its portal. A rush
  keeps its portal only if you typed all of its towers.
- Nobody can change the list once the server exists.
- If the list can't be read, the server keeps every tower and says so in the Output.

The text is the `lagFree` group in `Config > Messages`. Set
`personalServers.lagFree = false` to turn lag free servers off. The hub can only
make normal personal servers.

## The Teleport menu

The kit copies `World1Button`, `World1Menu`, `Place` and `SubPlace` for every World
and Area, so style those and every copy follows.

The friends list shows friends who are in Areas the player has unlocked. Roblox
can't tell the kit whether a friend is in a personal server, so joining one sends
the player to a public server of the same Area.

## See also

- [Ring Select](./ring-select.md), the hub
- [Game Passes](./game-passes.md)
