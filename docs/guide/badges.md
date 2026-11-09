# Badges

The kit can give Roblox badges for beating towers, endings and rushes, and for
reaching goals like "beat 10 towers". Make each badge in the Creator Dashboard
first, then put its ID in the right place:

| Badge for | Where its ID goes |
| :-- | :-- |
| Beating a tower | `badgeId` on the tower in `Config > Towers`, or a `BadgeID` attribute on the tower |
| Beating a tower in All Jumps | `ajBadgeId` in `Config > Towers`, or an `AJBadgeID` attribute |
| Reaching an ending | A `BadgeID` attribute on that winpad. See [Winpads & Endings](./winpads-endings.md#side-endings). |
| Beating a rush | `badgeId` on the rush's entry in `towers`. See [Tower Rushes](./tower-rushes.md). |
| Reaching a goal | `goalBadges` in `Config > Towers`. See [below](#goal-badges). |

## Goal badges

Goal badges are for progress across your whole game, such as beating a number of
towers, beating your first Insane, clearing a whole Ring, or playing for three
hours. Add one entry per badge to
`goalBadges` in `Config > Towers`:

```luau
goalBadges = {
	{ id = 1234567890, towerCompletions = 10 },
	{ id = 1234567891, difficulties = { Insane = 1 } },
	{ id = 1234567892, requiredTowers = { "ToH", "ToS" } },
	{ id = 1234567893, completedAreas = { "Ring1" } },
	{ id = 1234567894, towerCompletions = 10, allJumps = true },
	{ id = 1234567895, elo = 5000 },
	{ id = 1234567896, sessionMinutes = 180 },
	{ id = 1234567897, towerCompletions = 25, difficulties = { Remorseless = 3 } },
},
```

| Rule | The player needs |
| :-- | :-- |
| `towerCompletions` | This many different towers beaten. |
| `difficulties` | This many towers beaten at each difficulty **or harder**. `{ Insane = 1 }` is also met by an Extreme. |
| `requiredTowers` | These exact towers beaten. |
| `completedAreas` | Every tower in these Areas beaten, using the Area `id` from `Config > Worlds`. Rushes, and towers marked `extended`, are left out. |
| `elo` | At least this much [Elo](./elo.md). Ignored while Elo is off, and a badge that needs only Elo is never given. |
| `sessionMinutes` | This many minutes in one server without leaving. Teleporting to another Area or rejoining starts it again. |
| `allJumps` | Set to `true` to count All Jumps wins instead of Normal ones, for the tower rules in that entry. |

An entry can have several rules, and the player needs all of them. The first
three work the same way as
[Area requirements](./worlds-personal-servers.md#access-requirements), except that
towers from every World count.

- The badge is given right after a win that reaches the goal, and
  `sessionMinutes` is checked every 30 seconds while the player is in the game.
- Goals are also checked when a player joins. So if you add a goal badge after
  release, everyone who already qualifies gets it the next time they play.
- Only Normal wins count, unless the entry has `allJumps = true`. Practice wins
  never count.
- If an entry has no ID, no rules, or a tower or difficulty that doesn't exist,
  the Output says so when the server starts, and the badge is never given.

::: tip Testing a goal again
Each player can only get a badge once. To test a goal again, delete the badge
from your test account's inventory first.
:::
