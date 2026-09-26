# Building A Tower

A tower is spread across three places, all using its acronym:

```text
Workspace
└─ Towers
   └─ ToH           -- Folder or Model, named with the acronym
      ├─ Spawn      -- BasePart where the run starts (or SpawnLocation)
      ├─ WinPad     -- BasePart that finishes it
      └─ Frames     -- your build, named anything
ServerStorage
└─ TowerCheckpoints
   └─ ToH
      ├─ 1          -- BaseParts, numbered up the climb
      ├─ 2
      └─ 3
Config > Towers
└─ ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

**Checkpoints go in ServerStorage, not in the tower.** That's the step people miss.

The [Tower Setup window](./tower-setup-plugin.md) builds this for you and tells you what's missing.

## Checkpoints Are The Anti-Cheat

Checkpoints aren't respawn points. They prove a player really climbed. The server watches for each player passing through the next checkpoint in order, and the winpad only counts if they passed every one:

```text
1  ->  2  ->  3  ->  4  ->  WinPad     accepted
1  ->  2  ->  ....  ->  WinPad         kicked: "Completed the tower out of order"
```

- Number them `1`, `2`, `3` with no gaps, in the order players reach them. **Renumber by height** in Tower Setup does it for you.
- Make them wide, thin, invisible parts across the whole path, with `CanCollide` off, so nobody can get past one without going through it.
- **A tower with no checkpoints has no check at all.** Anyone who reaches the winpad wins.

In Practice and All Jumps, dying returns the player to the spot they saved, not to these checkpoints. All Jumps wins are still checked the same way.

## Minimum Time

`MinimumTime` is the fastest believable run, in seconds. A faster win is refused ("Completed the tower too early"). Set it a little under the fastest honest run. `0` turns it off.

## Register The Tower

A tower needs **both**:

- **Attributes on its folder**, which this place uses. They take effect straight away.
- **An entry in `Config > Towers`**, which every other place uses: the Completions chart, unlock requirements, and [`recount-badges`](./commands.md).

Without the entry, the tower plays fine in its own place but doesn't exist anywhere else. Tower Setup writes the entry from the attributes with one button.

### On the tower (no code)

| Attribute | Kind | Purpose |
| :-- | :-- | :-- |
| `TowerName` | String | The name players see. |
| `Difficulty` | Number | The rating, such as `5.33`. |
| `Area` | String | The Area `id` it stands in, such as `Ring1`. |
| `BadgeID` | Number | Badge for beating it. |
| `TowerPoints` | Number | Points for beating it. Defaults to `1`. |
| `AllJumpsPoints` | Number | Points for an All Jumps win. Defaults to `TowerPoints`. |
| `TowerType` | String | A tower type, such as `Citadel`. |
| `MinimumTime` | Number | See [Minimum Time](#minimum-time). |
| `AJBadgeID` | Number | Badge for an All Jumps win. |
| `TicketMultiplier` | Number | Scales its ticket payout. |
| `AllowRebeats` | Boolean | Pays tickets on every win, ignoring the cooldown. |

The `NoBoosts` **tag** (CollectionService) bans boost items in the tower.

::: warning Towers from an older kit
Old towers describe themselves with `StringValue` and `NumberValue` children, which win over attributes. Their `Difficulty` is a name like `"Extreme"`, which reads as `9.00` and overrides the `9.26` in your Config. If a tower shows the wrong sub-difficulty, delete that value. Tower Setup flags it.
:::

### In `Config > Towers`

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

See the [Configuration Reference](./configuration.md#towers) for every field. The acronym is saved with every player who beats it, so **never rename it** after release.

## What Goes In Code And What Goes On The Tower

| On the tower | In `Config > Towers` |
| :-- | :-- |
| Its name, difficulty, area, badges, points, type | The difficulty list, names and colours |
| Minimum time, ticket multiplier, rebeats | Tower types and what each pays |
| The `NoBoosts` tag | Sub-difficulties and categories |
| Its winpads' endings | Tower rushes |

One tower's facts go on the tower. Anything shared between towers goes in Config. And every tower still needs its Config entry, because other places can't see its attributes.

## Client Objects

Objects only the player's own client should run go in `Workspace > Towers > ToH > ClientSidedObjects` or `ServerStorage > TowerClientObjects > ToH`. See [Client-Sided Objects](./client-objects.md).
