# Building A Tower

Towers are `Folder` or `Model` instances inside `Workspace > Towers`. Name each one with its acronym, such as `ToH`.

## Quick Setup

1. Create `Workspace > Towers > ToH`.
2. Add a `BasePart` named `Spawn` or `SpawnLocation`.
3. Add a `BasePart` named `WinPad` at the end.
4. Add checkpoints under `ServerStorage > TowerCheckpoints > ToH` and name them `1`, `2`, `3`, and so on.
5. Register `ToH` in `ReplicatedStorage > Shared > Config > Towers`.
6. Test Normal, Practice, All Jumps, death, restart, and completion behavior in Studio.

[Tower Setup](/guide/tower-setup-plugin) can create this structure and tell you
what is still missing.

In the Explorer that is:

```text
Workspace
└─ Towers
   └─ ToH        -- the acronym, and nothing else
      ├─ Spawn   -- where a run starts
      ├─ WinPad  -- where it ends
      └─ Frames  -- your build, named anything
ServerStorage
└─ TowerCheckpoints
   └─ ToH        -- same acronym
      ├─ 1
      ├─ 2
      └─ 3
```

A tower is spread across three places, and all three use the same acronym:

```text
Workspace > Towers > ToH
├─ Spawn      -- BasePart, where the climb starts
├─ WinPad     -- BasePart, touching it finishes the run
└─ Obby       -- your build

ServerStorage > TowerCheckpoints > ToH
└─ 1, 2, 3 …  -- BaseParts, numbered up the climb

Config > Towers
└─ ToH = { difficulty = … }
```

**Checkpoints live in ServerStorage, not in the tower model.** That is the
part people miss.

## Checkpoints Are The Anti-Cheat

This is the part most people get wrong, so it is worth being plain about.

Checkpoints are not decoration and they are not respawn points. They are how the
kit proves a player actually climbed the tower.

While a player is in a tower, the server watches for them entering **the next
checkpoint in the sequence** — only that one. Touching it moves them on to the
next. When they touch the winpad, the server checks they got through every one:

```text
1  ->  2  ->  3  ->  4  ->  WinPad     accepted
1  ->  2  ->  ....  ->  WinPad         "Completed the tower out of order"
```

So a player who flies, teleports or clips straight to the top does not get the
win. **A tower with no checkpoints has no such check at all**: anyone who
reaches the winpad by any means wins it.

That is why order matters and why gaps are fatal. Name them `1`, `2`, `3` with
nothing skipped, running in the order a player meets them. Tower Setup's
**Renumber by height** does this for you.

::: tip Where to put them
Wide, thin, invisible parts across the whole path work best: a player should not
be able to get past one without going through it. `CanCollide` off.
:::

Two modes change what dying does. In **Practice** and **All Jumps**, dying puts
the player back at the position they last saved with the Place key, or at the
tower's spawn — not at one of these checkpoints. A player with **Restart on
Death** on starts the tower again instead, in every mode. The anti-cheat does not change:
an All Jumps win is checked exactly like a Normal one, and Practice never
completes a tower at all.

## Minimum Time Is The Other Half

`MinimumTime` is the seconds below which a win is refused as impossible. A run
faster than it is rejected with "Completed the tower too early".

Checkpoints prove the route; minimum time proves the pace. Set it a little under
the fastest honest run you can manage, so a good player is never punished and an
exploiter still is. Leaving it at zero turns the check off.

## Register The Tower

A tower is described in two places, and it needs both.

**Attributes on the folder** are how you author it. You can see the tower while
you set them, they take effect on the next run, and they win over anything the
config says.

**An entry in `Config > Towers`** is how the *rest of your game* knows it
exists. A fangame is several published places, and an attribute only exists in
the `Workspace` holding it — so a server in Ring 1 cannot read anything on a
folder sitting in Ring 2. Everything that has to reason about the whole game
reads the entry: the Completions chart and its totals, Area unlock
requirements, and [`recount-badges`](./commands.md).

A tower with attributes and no entry still loads and plays perfectly well in
its own place. It is simply not part of the game anywhere else. The server says
so in the Output window when it starts, and
[Tower Setup](./tower-setup-plugin.md) shows you the line and adds it for you —
so in practice you set the attributes and press a button.

### On the tower (no code)

Select the tower folder and set these in the Properties window, or let
[Tower Setup](./tower-setup-plugin.md) fill them in for you.

| Attribute | Kind | Purpose |
| :-- | :-- | :-- |
| `TowerName` | String | The name players see. |
| `Difficulty` | Number | The rating. `5.33` means rating 5, sub-difficulty 0.33. |
| `Area` | String | The Area `id` from `Config > Worlds` it stands in, such as `Ring1`. |
| `BadgeID` | Number | Normal completion badge. Omit for none. |
| `TowerPoints` | Number | Normal completion points. Defaults to `1`. |
| `AllJumpsPoints` | Number | All Jumps points. Defaults to `TowerPoints`. |
| `TowerType` | String | A key from the `types` list, such as `Citadel`. |

`TowerName`, `Difficulty` and `Area` are the three that matter. With those set,
the tower is named and rated in this place, and Tower Setup has everything it
needs to write the tower's `Config > Towers` line. That line is what files it in
the right Ring: the chart and unlock requirements take a tower's Area from its
entry, never from the attribute.

::: warning A tower from an older kit may already carry these
Towers built for the legacy framework describe themselves with `StringValue` and
`NumberValue` **children** rather than attributes, and the child wins. Two of
those names differ: `ProperName` is the old spelling of `TowerName`, and
`Difficulty` there is a **name** — `"Extreme"` — not a number.

A named difficulty resolves to that rating with **no decimal at all**, so a
tower carrying `Difficulty = "Extreme"` reads as `9.00`, Baseline Extreme, and
**overrides the `9.26` your config gave it**. If a tower shows the wrong
sub-difficulty, this is almost always why: delete the value, or replace it with
the number. Tower Setup flags it.
:::

### In `Config > Towers`

One line, keyed by acronym, naming the Area it stands in:

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

Same shape as the attributes above, on purpose. `area` is an `id` from
`Config > Worlds`, which is where an Area's name, emblem and Place ID live.

Keep acronyms stable after release because completion data uses them as IDs.

## What Goes In Code And What Goes On The Tower

Two questions, not one.

**Does it describe one tower, or your whole game?** One tower's facts belong to
that tower, where you can see it. Anything shared between towers, or that puts
them in an order, is a decision about the game.

| On the tower, as attributes or tags | In `Config > Towers`, as code |
| :-- | :-- |
| Its name, difficulty, area, badge, points, type | The difficulty chart itself: what rating 5 is called, its colour, its emoji |
| `MinimumTime`, `AJBadgeID`, `TicketMultiplier`, `AllowRebeats` | The tower types and what each one pays |
| `NoBoosts` | Difficulty categories, sub-difficulties |
| Its winpads' endings | Tower rushes, which are ordered lists of towers |

**Does anywhere else need to know?** This is the one that catches people. An
attribute is readable only in the place holding the folder, so every question
asked from another Ring — how many towers there are, what fraction you have
beaten, which badge belongs to which tower, whether you have earned your way
into Ring 2 — is answered from `Config > Towers` alone.

That is why a tower needs its entry even though its attributes already say
everything. The attributes are what this place does; the entry is what your
game is.

Your Worlds and Areas are only ever described in `Config > Worlds`, for the same
reason.

## Tower Attributes And Tags

| Name | Kind | Purpose |
| :-- | :-- | :-- |
| `MinimumTime` | Number attribute | Fastest accepted completion time in seconds. |
| `AJBadgeID` | Number attribute | All Jumps completion badge. Use `0` for none. |
| `NoBoosts` | CollectionService tag | Rejects boosted wins in this tower. |
| `TicketMultiplier` | Number attribute | Scales this tower's ticket payout. |
| `AllowRebeats` | Boolean attribute | Pays tickets on every win, ignoring the cooldown. |

The `NoBoosts` tag can only add a ban. A `Citadel` or an `Obelisk` bans boosts
with or without it, because the type's own `noBoosts` turns the ban on. To let
one of them allow boosts, set `noBoosts = false` in its `Config > Towers` entry,
which overrides both the tag and the type.

## Optional Client Objects

Put client-only objects in either:

- `Workspace > Towers > ToH > ClientSidedObjects`; or
- `ServerStorage > TowerClientObjects > ToH`.

Removing a released tower's config entry takes it off the chart, out of every
total and unlock requirement, and out of `recount-badges`, although the folder
still loads where it stands. Plan saved-data changes carefully and test them
with the Studio save key first.

## See Also

- [Configuration Reference: Towers](./configuration.md#towers)
- [Tower Setup](./tower-setup-plugin.md)
- [Winpads & Endings](./winpads-endings.md)
- [Troubleshooting](./troubleshooting.md)
