# Player Elo

Elo is one number that shows how good a player is, based on the hardest towers
they've beaten. It only ever goes up: dying, leaving or failing a run costs
nothing, and beating a tower again adds nothing.

**One number covers both modes.** An All Jumps win is worth a quarter of a Normal
win of the same tower, and each tower counts once, for whichever is worth more.

Elo ships off. To turn it on, set `enabled = true` in `Config > Elo`.

## How it's worked out

Every tower a player has beaten is worth some points. Harder towers are worth
**much** more, because the points multiply with each step up in difficulty:

```text
points = scale × difficultyGrowth ^ (difficulties above the first)
```

With the defaults (`scale = 10`, `difficultyGrowth = 1.8`):

| Difficulty | | Points |
| --: | :-- | --: |
| 1 | Easy | 10 |
| 5 | Challenging | 105 |
| 8 | Insane | 612 |
| 11 | Catastrophic | 3,570 |

One Catastrophic is worth as much as 357 Easy towers.

The player's towers are then added up, hardest first, with each one counting a
little less than the one before (`falloff`):

```text
elo = hardest + second × 0.95 + third × 0.95² + ...
```

So beating more towers always adds something, but no pile of easy towers can
outweigh a much harder one. With `falloff = 0.95`, a player's Elo can never be
more than 20 times what their hardest tower is worth:

| Player has beaten | Elo | A plain sum would be |
| :-- | --: | --: |
| 100 Easy | 199 | 1,000 |
| 200 Challenging | 2,099 | 20,995 |
| 1 Catastrophic | 3,570 | 3,570 |
| 1 Catastrophic and 10 Insane | 8,238 | 9,693 |
| 30 Insane | 9,616 | 18,367 |

## Settings

These are in `Config > Elo`:

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `enabled` | `false` | Elo as a whole. Off, wins are worth no Elo, and its Leaderboards tab, Completions stat and player list stat are hidden. |
| `points.scale` | `10` | What a tower of the first difficulty is worth. |
| `points.difficultyGrowth` | `1.8` | How much more each difficulty is worth than the one below. Higher makes only the hardest towers matter. `1` makes every tower worth the same. |
| `points.falloff` | `0.95` | How much each tower counts compared with the next harder one. `1` adds them all up in full, and `0` counts only the hardest. If you leave it out, it's `1`. |
| `leaderstat.enabled` | `false` | Shows Elo in the player list. |
| `leaderstat.name` | `"Elo"` | The name of that player list column. |
| `normal.enabled`, `allJumps.enabled` | `true` | Whether wins in that mode count. |
| `normal.multiplier` | `1` | What a Normal win is worth. |
| `allJumps.multiplier` | `0.25` | What an All Jumps win is worth. `0` stops them counting. |
| `normal.countRushClears`, `allJumps.countRushClears` | `true` | Whether towers beaten during a rush count. |

Turning a mode off doesn't take away what players earned. Turning it back on
brings it back.

## Where players see it

- **The player list**, if `leaderstat.enabled` is on.
- **The Completions menu**, with the player's rank across the whole game, such as
  `1,240 (#7)`.
- **The Leaderboards menu**, on the Elo board. See
  [Leaderboards](./player-data.md#leaderboards).
- **Locked Areas**, which can ask for a minimum Elo. See
  [Behind Elo](./worlds-personal-servers.md#behind-elo).

## Which wins count

A win counts once the server has accepted it, after checking checkpoints and the
minimum time. Wins in Practice, wins using a boost item, and wins using a Studio
test tool don't earn Elo, but a later clean win of the same tower does. Each tower
in a rush counts on its own.

## Modifiers

A tower beaten with [modifiers](./modifiers.md) is worth more or less, depending on
the set. Its points are multiplied by 1 plus each modifier's `elo`, kept between
`elo.min` and `elo.max` in `Config > Modifiers`.

Each tower counts once, at the best set it's been beaten with. A win with a
modifier that has `counts = false` earns no Elo.

## Changing difficulties later

A player's Elo is worked out again every time they join, so if you change a
tower's difficulty or a setting here, everyone's Elo follows. Publish the change to
every place at the same time.

- The Elo leaderboard catches up as players come back.
- Tickets that were already paid stay paid.
- A tower you remove from `Config > Towers` stops counting. Putting it back brings
  its points back.

## Reading it from a script

```luau
local ServerScriptService = game:GetService("ServerScriptService")
local EloAwards = require(ServerScriptService.Server.Accounts.EloAwards)

local result = EloAwards.get(player) -- nil until the player's data has loaded
if result ~= nil then
	print(result.score)
end
```
