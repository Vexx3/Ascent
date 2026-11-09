# Tower Rushes

A tower rush is a list of towers played back to back as one run. When a player
beats one tower, they're sent straight into the next.

## Set up a rush

A rush needs three things: its tower list, an entry so it shows in the menus, and
a portal.

### 1. List its towers

Open `ReplicatedStorage > Config > Towers` and add the rush to `rushes`:

```luau
rushes = {
	MyRush = {
		winroomMarker = "WinroomSpawn",
		towers = { "ToH", "ToS" },
		noBoosts = true,
	},
}
```

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `towers` | | The towers' acronyms, in the order they're played. Each one must also be in `towers`. |
| `winroomMarker` | `"WinroomSpawn"` | The [marker](./markers-portals.md) the player is sent to after the last tower. |
| `noBoosts` | `false` | Kills a player who equips a boost item during the rush. |

**Every tower in a rush must be in the same Area.** If one isn't, the rush won't
start, the player sees `towers.rushUnavailable` from `Config > Messages`, and the
Output names the towers that are missing.

### 2. Add it to `towers`

The rush also needs an entry in `towers`, under the same key. This gives it a name
and a difficulty, and puts it on the Completions chart under
[Extended Completions](./ui-and-hud.md#extended-completions):

```luau
towers = {
	MyRush = { name = "My Tower Rush", difficulty = 8.50, area = "Ring1" },
},
```

You can give it a `badgeId` here too, for beating the whole rush.

The kit comes with two example rushes to copy: `ETR` and `TSR`.

### 3. Make a portal

Put a part in `Workspace > Portals` with a StringValue named `TowerRush` inside
it. Set the StringValue's `Value` to the rush's key (`MyRush`). See
[Markers & Portals](./markers-portals.md).

## What a rush gives

- Each tower in the rush counts as beaten, in Normal or All Jumps, as the player
  gets through it.
- Beating the whole rush saves its own stats, and gives the `badgeId` from its
  `towers` entry.
- Towers don't pay tickets during a rush.
- After the last tower, the player is sent to `winroomMarker`.
- Rushes have no Practice mode.

By default, restarting during a rush goes back to its first tower. Set
`restartResetsTowerRush = false` in `Config > Project` to restart only the current
tower.
