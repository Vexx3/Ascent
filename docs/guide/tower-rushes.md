# Tower Rushes

A tower rush runs an ordered list of normal towers back-to-back.

## Configure The Rush

Open `ReplicatedStorage > Shared > Config > Towers` and add an entry under `rushes`:

```luau
rushes = {
	MyRush = {
		winroomMarker = "WinroomSpawn",
		towers = { "ToH", "ToS" },
		noBoosts = true,
	},
}
```

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `towers` | `{ string }` | — | Ordered acronyms. Every acronym must also be a registered normal tower. |
| `winroomMarker` | `string` | `"WinroomSpawn"` | Marker used after the final tower. |
| `noBoosts` | `boolean` | `false` | Optional. Kills a player who equips a boost during this rush. |

**Every tower in a rush has to stand in the same Area.** A rush plays its towers
in the server the player is already in, and each Area is its own place, so a
rush that reaches into another one could never finish. The kit refuses to start
it, tells the player with `towers.rushUnavailable` from `Config > Messages`, and
names the missing towers in the Output window.

## Add Its Display Entry

A rush also needs an entry in `towers`, beside the real towers, so it shows up
on the Completions chart with everything else:

```luau
towers = {
	MyRush = { name = "My Tower Rush", difficulty = 8.50, area = "Ring1" },
},
```

The same shape as a tower, `area` included. No `rush = true` flag: the matching
key in `rushes` is what makes it a rush. The kit ships two you can copy — `ETR`
and `TSR`.

## Create A Portal

A `BasePart` under `Workspace > Portals` holding a `StringValue` named
`TowerRush` whose value is the rush acronym. See
[Markers & Portals](./markers-portals.md).

## Completion Behavior

- Individual towers record their normal or All Jumps completion as the rush advances.
- The finished rush records separate stats and awards the `badgeId` on its `towers` entry.
- Tower tickets are not awarded during the rush flow.
- The player is sent to `winroomMarker` after the final tower.

`Config > Project > restartResetsTowerRush` decides whether Restart returns to the first tower or reloads the current tower.
