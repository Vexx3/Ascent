# Building a Tower

A tower is made of three pieces in three places, all named with its acronym:

```text
Workspace
└─ Towers
   └─ ToH            -- a Folder or Model named with the acronym
      ├─ Spawn       -- where the run starts (a part, or a SpawnLocation)
      ├─ WinPad      -- the part that wins the tower
      └─ Frames      -- your build, named however you like
ServerStorage
└─ TowerCheckpoints
   └─ ToH
      ├─ 1           -- parts, numbered from the bottom of the climb
      ├─ 2
      └─ 3
Config > Towers
└─ ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

**Checkpoints go in ServerStorage, not inside the tower.** This is the step people
miss most.

| A tower in `Workspace > Towers` | Its checkpoints in `ServerStorage > TowerCheckpoints` |
| :-- | :-- |
| ![A tower folder, with its Spawn and WinPad marked](/images/explorer-tower.png){width=300} | ![A checkpoint folder named after its tower, holding parts named 1, 2 and 3](/images/explorer-checkpoints.png){width=300} |

The [Ascent Setup plugin](./tower-setup-plugin.md) can build all of this for you
and tells you what's missing.

## Checkpoints are the anti-cheat

In Ascent, checkpoints aren't respawn points. They're how the server knows a
player really climbed. The winpad only counts if the player passed through every
checkpoint, in order:

```text
1  ->  2  ->  3  ->  4  ->  WinPad     the win counts
1  ->  2  ->  ....  ->  WinPad         kicked: "Completed the tower out of order"
```

How to place them:

1. Make each one a wide, thin, invisible part that covers the whole path, with
   `CanCollide` off. Nobody should be able to get past it without going through it.
2. Number them `1`, `2`, `3` and so on, with no gaps, in the order players reach
   them. The plugin's **Renumber by height** does this for you.
3. Put them in `ServerStorage > TowerCheckpoints > <acronym>`.

Good to know:

- **A tower with no checkpoints has no protection.** Anyone who reaches the
  winpad wins.
- **Checkpoints check the order, not the speed.** Give every tower a
  [minimum time](#minimum-time) to catch players who are too fast.
- Checkpoints are also how the game measures how far a run got, for
  [far messages](./announcements-webhooks.md#far-messages).
- All Jumps wins are checked the same way.

## Minimum time

The minimum time is the fastest time, in seconds, a real player could beat the
tower in. A faster win is refused with "Completed the tower too early".

Set it as the tower's `MinimumTime` attribute, or as `minimumTime` in its
`Config > Towers` entry. Pick a little below the fastest honest run you've seen.
`0` turns the check off.

## Register the tower

A tower needs **both** of these:

- **Attributes on the tower** in `Workspace > Towers`. The place the tower is in
  uses these, and they work as soon as you set them.
- **An entry in `Config > Towers`**. Every other place uses this, for the
  Completions menu, Area unlocks and the [`recount-badges`](./commands.md) command.

Without the Config entry, the tower plays fine in its own place but doesn't exist
anywhere else. The plugin writes the entry from the attributes with one button.

### Attributes on the tower

Select the tower and add these in the Properties window, under **Attributes**:

| Attribute | Type | What it does |
| :-- | :-- | :-- |
| `TowerName` | string | The tower's full name, which players see. |
| `Difficulty` | number | Its difficulty, such as `5.33`. See [Difficulties](./difficulties.md). |
| `Area` | string | The `id` of the Area it's in, such as `Ring1`. |
| `BadgeID` | number | A badge for beating it. |
| `TowerPoints` | number | Points for beating it. Defaults to `1`. |
| `AllJumpsPoints` | number | Points for beating it in All Jumps. Defaults to `TowerPoints`. |
| `TowerType` | string | Its tower type, such as `Citadel`. |
| `MinimumTime` | number | See [Minimum time](#minimum-time). |
| `AJBadgeID` | number | A badge for beating it in All Jumps. |
| `TicketMultiplier` | number | Multiplies the tickets it pays. |
| `AllowRebeats` | boolean | Pays tickets every time it's beaten, ignoring the ticket cooldown. |
| `Warning` | string or boolean | A warning shown before the climb. See [below](#a-warning-before-climbing). |

To ban boost items in the tower, give it the `NoBoosts` **tag** (Properties >
Tags).

::: warning Towers from an older kit
Value objects from an older kit, such as a `Difficulty` StringValue, win over
attributes. A `Difficulty` of `"Extreme"` reads as exactly `9.00` and overrides
your Config, so delete it if the tower shows the wrong difficulty. The plugin
points these out.
:::

### The entry in Config

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

Every setting is listed in the [Configuration Reference](./configuration.md#towers).
The acronym is saved with every player who beats the tower, so **don't rename it**
after release.

## A warning before climbing

If a tower has flashing lights, loud sounds or anything else a player should know
about first, you can warn them before they climb. Add `warning` to its entry in
`Config > Towers`, or a `Warning` attribute on the tower:

```luau
towers = {
	ToFL = { name = "Tower of Flashing Lights", difficulty = 6, area = "Ring1", warning = true },
	ToLS = { name = "Tower of Loud Sounds", difficulty = 4, area = "Ring1", warning = "This tower gets very loud near the top." },
},
```

- `true` shows the default warning, `towerWarning.default` in `Config > Messages`.
  Text shows your own words instead, and `{TowerName}` is replaced with the
  tower's name.
- The warning shows every time the player enters the tower, but not when they
  restart. The timer keeps running while it's up.
- The player can press **Proceed**, **Exit Tower**, or tick **Don't show again
  for this tower**, which is saved.
- It's drawn by `MainMenu > PromptDialog`.

## Signs that change colour

A tower's signs change colour once a player beats it, such as its portal sign and
its line on a lobby chart. A tower can have as many as you like, and a sign can
be anything with a colour: a part, a whole model, a Highlight, a light, a text
label, particles and so on.

1. Select the tower and open **Signs** in the plugin's Towers window.
2. Select everything that should change colour.
3. Press **Add selected**.

To do it by hand, put an ObjectValue named `Sign` anywhere in the tower and set
its `Value` to the thing that should change colour.

The colours are `towerSigns` in `Config > Visuals`. To change one sign, give its
ObjectValue an attribute:

| Attribute | What it does |
| :-- | :-- |
| `SignProperty` | Which colour changes, such as `OutlineColor` on a Highlight. Separate several with commas. |
| `BeatenColor` | Its own colour once the tower is beaten. |
| `AllJumpsColor` | Its own colour once the tower is beaten in All Jumps only. |

Without `SignProperty`, the first of these the thing has changes: `Color`,
`Color3`, `FillColor`, `TextColor3`, `ImageColor3`, then `BackgroundColor3`. A
model or folder has every part in it changed.

## What goes on the tower, and what goes in Config

| On the tower | In `Config > Towers` |
| :-- | :-- |
| Its name, difficulty, Area, badges, points and type | The list of difficulties, with their names and colours |
| Its minimum time, ticket multiplier and rebeats | Tower types and what each pays |
| The `NoBoosts` tag | Sub-difficulties and difficulty categories |
| Its winpads' endings | Tower rushes |

Facts about one tower go on that tower. Anything shared by many towers goes in
Config. Every tower still needs its own Config entry, because other places can't
see its attributes.

## Client objects

Buttons, moving platforms and anything else each player should run on their own
screen go in `Workspace > Towers > ToH > ClientSidedObjects`, or in
`ServerStorage > TowerClientObjects > ToH`. See
[Client-Sided Objects](./client-objects.md).
