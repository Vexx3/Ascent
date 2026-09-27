# Player Elo

Elo measures what a player has beaten. It only goes up: dying, leaving or losing costs nothing, and beating a tower again adds nothing.

**One number covers both modes.** An All Jumps win counts for a quarter of the same tower beaten normally. A tower counts once, for the better of the two.

## How It's Worked Out

Each distinct tower beaten is worth points, times its mode's multiplier. Towers then count hardest first, each for `falloff` of the one before it:

```text
points = scale × difficultyGrowth ^ (rating above the first difficulty)
elo    = hardest + second × 0.95 + third × 0.95² + ...
```

Points **multiply** per difficulty, so harder towers are worth far more. At the default `1.8`:

| Difficulty | | Points |
| --: | :-- | --: |
| 1 | Easy | 10 |
| 5 | Challenging | 105 |
| 8 | Insane | 612 |
| 11 | Catastrophic | 3,570 |

One Catastrophic is worth 357 Easy towers.

**Beating more always adds, but it can't replace beating harder.** With `falloff` at `0.95`, no pile of towers adds up to more than 20 times your hardest:

| Profile | Elo | As a plain sum |
| :-- | --: | --: |
| 100 Easy | 199 | 1,000 |
| 200 Challenging | 2,099 | 20,995 |
| 1 Catastrophic | 3,570 | 3,570 |
| 1 Catastrophic and 10 Insane | 8,238 | 9,693 |
| 30 Insane | 9,616 | 18,367 |

So a player who has beaten 200 Challenging towers doesn't outrank someone with a Catastrophic, but 30 Insanes still show real depth.

## Settings

`Config > Elo`:

| Setting | Default | Effect |
| :-- | :-- | :-- |
| `points.scale` | `10` | What a tower on the first difficulty is worth. |
| `points.difficultyGrowth` | `1.8` | Multiplier per difficulty. Higher rewards only your hardest towers; `1` is flat. |
| `points.falloff` | `0.95` | What each tower counts for against the next harder one. `1` is a plain sum; `0` counts only the hardest. Left out, it's `1`. |
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

Elo is never stored as a running total: it's worked out again from the towers each player has beaten every time they join. So rebalancing needs nothing else from you. Change a tower's difficulty, or `scale`, `difficultyGrowth`, `falloff` or a multiplier, and every player's Elo moves to match the next time they join. Area locks, the Completions menu and announcements use it in every server that runs the new Config.

Two things lag behind:

- **The global Elo board** shows each player's Elo from their last visit, so it catches up as players come back.
- **Tickets already paid** stay paid. A tower's new ticket reward applies from its next win.

Publish the change to every place at once, or servers will disagree about what a tower is worth.

A tower removed from `Config > Towers` stops counting, but players keep the record; putting it back restores its points.

## In Code

```luau
local EloAwards = require(ServerScriptService.Server.Accounts.EloAwards)

local result = EloAwards.get(player) -- nil until their data loads
if result ~= nil then
	print(result.score)
end
```
