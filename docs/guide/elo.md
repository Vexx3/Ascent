# Player Elo

Elo measures what a player has beaten. It starts at zero and only ever goes
up: dying, resetting, leaving a tower and disconnecting all cost nothing, and
beating a tower you have already beaten adds nothing. It is a record, not a
contest you can lose.

**One number covers both modes.** An All-jumps clear counts, at a fraction of
what the same tower is worth beaten normally -- a quarter as shipped, and
`allJumps.multiplier` in `Config > Elo` is the whole of that decision.
All-jumping a tower you have already beaten normally adds nothing at all: a
tower is worth the better of the two modes, never the sum.

## How An Elo Is Worked Out

Every distinct tower you have beaten is worth points, scaled by what the mode
you beat it in is worth, and your Elo is their sum:

```text
points  = scale × difficultyGrowth ^ (difficulty - 1)
weight  = the higher multiplier of the modes you cleared that tower in
elo     = round(sum of points × weight over every distinct tower)
```

Difficulty is the numeric value in `Config > Towers`, decimals included, so a
tower at `5.42` sits between the fifth and sixth tiers rather than on one.

`difficultyGrowth` is the setting that decides what your game rewards. Points
**multiply** per tier rather than adding, and that is the whole design: with
linear points a hundred Easy towers would beat one Catastrophic, so the fastest
way up would be to grind the easiest thing you ship. At the default `1.8`:

| Difficulty | | Points |
| --: | :-- | --: |
| 1 | Easy | 10 |
| 5 | Challenging | 105 |
| 8 | Insane | 612 |
| 11 | Catastrophic | 3,570 |

One Catastrophic is worth 357 Easy towers. Breadth still counts -- every clear
you own keeps contributing forever -- it just cannot outrun depth in any game of
a realistic size.

## Settings

Open **ReplicatedStorage > Shared > Config > Elo**.

| Setting | Default | Effect |
| :-- | :-- | :-- |
| `points.scale` | `10` | What a difficulty 1 tower is worth. |
| `points.difficultyGrowth` | `1.8` | Multiplier per difficulty tier. `1` is flat; below `1` is refused. |
| `leaderstat.enabled` | `false` | Show the Elo on the in-experience player list. |
| `leaderstat.name` | `"Elo"` | What that column is called. |
| `normal.enabled`, `allJumps.enabled` | `true` | Whether clears in that mode count at all. |
| `normal.multiplier` | `1` | What a normal clear is worth. |
| `allJumps.multiplier` | `0.25` | What an All-jumps clear is worth against the same tower beaten normally. `0` stops it counting. |
| `normal.countRushClears`, `allJumps.countRushClears` | `true` | Whether a tower beaten in a rush earns its points. |

Raise `difficultyGrowth` to make only your hardest towers matter; lower it
toward `1` to reward beating a lot of towers.

All Jumps lets a player place their own checkpoints, so it is the easier way
through the same tower, and a quarter keeps somebody who does both from
out-ranking somebody who only ever went the hard way. Set it to `1` for the
old behaviour, where an All-jumps clear was worth exactly as much. For
All-jumps at a tenth:

```luau
allJumps = {
	enabled = true,
	multiplier = 0.1,
	countRushClears = true,
},
```

Disabling a mode shows zero and stops new credit, but keeps the saved clears --
re-enabling recalculates from them. `Project.allJumpsEnabled = false` also
disables the All-jumps Elo.

The whole config is checked when the place starts, by name. `scale` must be
positive and `difficultyGrowth` at least `1`. A setting that would let a harder
clear lower an Elo, or push points past the range a number stores exactly,
stops the server rather than producing a wrong Elo quietly.

## Where Players See It

**On the player list.** With `leaderstat.enabled` on -- it ships off -- the
Elo sits in `leaderstats` beside the tower and All-jumps counts, so it shows in
the in-experience player list Roblox draws from that folder. Rename the column
with `leaderstat.name`. See Roblox's
[Leaderboards](https://create.roblox.com/docs/players/leaderboards) page for how
that list works.

**A global leaderboard.** The Scribe leaderboard `Elo` ranks every player who
has ever played, not just the ones in your server. It is declared in
`Shared > Accounts > AccountData` and streamed to clients, so reading it needs
no remote of your own:

```luau
local Data = AccountData.Client

for _, entry in ipairs(Data.GetLeaderboard("Elo", 10)) do
	print(entry.Rank, entry.Name, entry.Score)
end
print("you are", Data.GetMyRank("Elo"))
```

An entry is `{ Rank, UserId, Name, Score }`. `Data.OnLeaderboard` fires when a
board refreshes. Scribe keeps the ordered store behind it; you do not write to
it. In Studio a board holds only the players in that test -- see the testing
note below.

It is one of three. To show it with Roblox's own leaderboard, or to read the
two that rank completion counts rather than Elo, see
[Leaderboards](./player-data.md#leaderboards).

The kit reads it in two places. The Completions menu puts the rank beside the
Elo it is already showing — `1,240 (#7)` — for the local player through
`GetMyRank`, and for anybody looked up by matching the replicated board, which is
why a rank appears for them only while they are on it. On the server,
`leaderboard` prints the top of it and where everyone currently in the server
sits.

**Locked Areas.** An Area in `Config > Worlds` can ask for a minimum Elo, which
gates a Ring on depth rather than on a tower count. See
[Locking an Area behind Elo](./worlds-personal-servers.md#locking-an-area-behind-elo).

## Which Clears Count

New credit needs a primary tower win the server accepted, through its
minimum-time and checkpoint checks. The mode you beat it in decides the
weight, and the two credited sets stay apart in the save so a later normal
clear can still upgrade a tower you first beat in All Jumps. Boost-assisted,
debug-assisted and Practice runs earn nothing -- the clear still counts as a
completion, it just does not count as a measure of skill. A later clean clear
can still earn Elo for a tower an assisted run already completed.

Validated rush segments count as their individual towers. Alternate endings and
the final rush award give no extra Elo. Assistance flags persist across a
rush, so help early in one disqualifies its later segments until a fresh run.

The credited tower and the recalculated Elo are written in one Scribe
transaction, so a duplicate win event cannot add duplicate credit.

## Existing Players And Difficulty Changes

A profile arriving from fanofpixels’ kit is credited for the completions it
brings, in the same migration that carries them. That old history has no
reliable assistance record, so it may include boosted clears; everything after
it follows the stricter rules above.

An Elo is recomputed from the saved sets rather than added up as you go, which
is what lets a difficulty change in `Config > Towers`, or a multiplier change
here, re-value every profile that references that tower. Scribe recalculates on join, before the account is ready,
and again whenever a new clear lands. Offline players update on their next join.
Publish the same catalog and settings to every place and replace running servers
when you change the balance, or servers will disagree.

Workspace difficulty overrides do not change an Elo. A tower missing from the
catalog, or with a difficulty outside `1` up to one above your tier count, is
excluded with an Output warning while its saved credit is kept -- restoring the
catalog entry restores its points on the next recalculation.

## Reading An Elo

The saved field is `elo`. The credited towers stay in two sets, `eloTowers`
and `eloAjTowers`, because the weight depends on which one a tower is in --
the two numbers became one, the two records did not. `eloHistoryImported` is
true on a profile whose old-kit history has been credited, which is what stops
that credit happening twice.

```luau
local EloAwards = require(ServerScriptService.Server.Accounts.EloAwards)

local result = EloAwards.get(player)
if result ~= nil then
	print(result.score)
	print(#result.excluded, "credited towers are missing from the catalog")
end
```

`nil` means the account is not ready yet.

## Testing In Studio

Elo itself works in Studio. Leaderboards read an OrderedDataStore, and with
`dataStoreStudioMode` on `Mock`, as shipped, Scribe swaps in an in-memory one,
so a board holds only the players in that test. Keep it that way rather than
pointing a development place at live data: real ordered writes from a test
place are difficult to undo. To draw a board full of fake entries in edit mode
rather than a play test, Scribe's client `Data.Mock` accepts a `Leaderboards`
table.

Elo uses the kit's existing win validation. It does not make
client-owned movement or client-only hazards exploit-proof.
