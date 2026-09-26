# Player Elo

Elo measures what a player has beaten. It only goes up: dying, leaving or losing costs nothing, and beating a tower again adds nothing.

**One number covers both modes.** An All Jumps win counts for a quarter of the same tower beaten normally. A tower counts once, for the better of the two.

## How It's Worked Out

Each distinct tower beaten is worth points, and Elo is the sum:

```text
points = scale × difficultyGrowth ^ (difficulty - 1)
elo    = the sum of each tower's points × its mode's multiplier
```

Points **multiply** per difficulty, so harder towers are worth far more. At the default `1.8`:

| Difficulty | | Points |
| --: | :-- | --: |
| 1 | Easy | 10 |
| 5 | Challenging | 105 |
| 8 | Insane | 612 |
| 11 | Catastrophic | 3,570 |

One Catastrophic is worth 357 Easy towers.

## Settings

`Config > Elo`:

| Setting | Default | Effect |
| :-- | :-- | :-- |
| `points.scale` | `10` | What an Easy tower is worth. |
| `points.difficultyGrowth` | `1.8` | Multiplier per difficulty. Higher rewards only your hardest towers; `1` is flat. |
| `leaderstat.enabled` | `false` | Show Elo on the player list. |
| `leaderstat.name` | `"Elo"` | That column's name. |
| `normal.enabled`, `allJumps.enabled` | `true` | Whether that mode counts. |
| `normal.multiplier` | `1` | What a normal win is worth. |
| `allJumps.multiplier` | `0.25` | What an All Jumps win is worth. `0` stops it counting. |
| `normal.countRushClears`, `allJumps.countRushClears` | `true` | Whether towers beaten in a rush count. |

Turning a mode off keeps what players earned; turning it on again restores it.

## Where Players See It

- **The player list**, with `leaderstat.enabled`.
- **The Completions menu**, with the player's global rank: `1,240 (#7)`.
- **A global leaderboard**, `Elo`, ranking everyone who has played. See [Leaderboards](./player-data.md#leaderboards).
- **Locked Areas** can ask for a minimum Elo. See [Locking an Area behind Elo](./worlds-personal-servers.md#locking-an-area-behind-elo).

## Which Wins Count

A win counts once the server has accepted it (checkpoints and minimum time). Wins with a boost item, a Studio test tool, or in Practice don't earn Elo, though a later clean win of the same tower does. Each tower of a rush counts on its own.

## Changing Difficulties Later

Elo is recalculated from what each player has beaten, so changing a tower's difficulty re-values every player's Elo the next time they join. Publish the change to every place at once, or servers will disagree.

A tower removed from `Config > Towers` stops counting, but players keep the record; putting it back restores its points.

## In Code

```luau
local EloAwards = require(ServerScriptService.Server.Accounts.EloAwards)

local result = EloAwards.get(player) -- nil until their data loads
if result ~= nil then
	print(result.score)
end
```
