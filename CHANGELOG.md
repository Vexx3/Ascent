# Changelog

## Unreleased

### Breaking

**Functions that wait are named for it.** The kit's rule is that a function
which yields ends in `Async`, so a caller can see which calls hold up the
script, and several documented ones did not. A script of your own that calls
one needs the new name:

| Module | Was | Now |
| :-- | :-- | :-- |
| `Server > Towers > TowerRegistry` | `loadForPlayer`, `resetClientObjects` | `loadForPlayerAsync`, `resetClientObjectsAsync` |
| `Server > Accounts > Progress` | `incrementTowers`, `incrementAllJumps`, `incrementTowerAttempt`, `incrementRushAttempt`, `addTowerTimeSpent` | the same, each ending in `Async` |
| `Server > Announcements > AnnouncementsService` | `globalNotification` | `globalNotificationAsync` |

Nothing saved changes; only the names a script calls.

### Fixed

**A `%` in a message no longer breaks it.** Win, kick, shutdown, anti-cheat
and shop-rotation messages filled their placeholders with `gsub`, which reads
`%` in the inserted text as a pattern escape. An ending called "100% Ending", a
boost named with a percent sign, or a shutdown reason like "50% off sale" made
the message error instead of appearing. They are filled the safe way now.

**A misnamed menu part is reported instead of hanging.** The spectate panel,
the tower display and the reset effect waited for their parts with no time
limit, so a renamed label held the menu up forever and printed nothing, which
left every player on the loading screen. They wait ten seconds and then say
which name is missing; a problem in the spectate panel now switches spectating
off rather than the whole menu.

**A lobby spawn inside a model works everywhere.** Leaving a tower found
`SpawnLocation` anywhere under `Workspace > Markers`, but setting up the
`LobbyTP` teleporter only looked at the top level, so a lobby built as one
model errored on startup. Both look everywhere now.

**Restarting a tower rush reports a load that failed.** It said the restart
worked whether or not the rush's first tower loaded.

**A tower acronym with a symbol in it no longer breaks Config.** Acronyms
like `ToH:AC` are not names Luau accepts as a table key, and the Tower Setup
window wrote them bare -- `ToH:AC = { ... }` -- which stops the whole file
parsing. The first sign was not one bad line but every Config read failing,
including the window's own. Such a key is now written as `["ToH:AC"]`.

The same acronym was also being used as a search pattern, so the check for
an entry that already exists missed a bracketed one and would have written a
second entry for the same tower. One holding `[` or `%` was a malformed
pattern, which errors outright. Acronyms are escaped before searching now,
and both spellings are looked for.

**A typo in a Tower Setup number box no longer deletes the value.** Every
number box handed its text to `tonumber`, which reads `5.3x` as nothing, and
nothing is what clears an attribute -- so a slip in Difficulty removed the
tower's difficulty without a word, and `nan` or `inf` went into the place as
values no check expects. A box now refuses what is not a number, puts back
what it held and says why underneath. IDs and counts must be whole, and each
Config number is held to what the server will start with.

**Tower Setup could write a Config file that no longer loads.** A text value
holding a backslash was written straight into a quoted string, where it
starts an escape; `C:\path` stopped the whole file parsing. Such a value is
refused now. Numbers were written to fourteen significant digits, which
rounded a sixteen-digit badge ID; whole numbers are written whole.

**The checkpoint size setting did nothing.** The Config tab saved it and
**Add checkpoint here** ignored it, always building a flat 24 by 1 by 24
slab -- the shape the server's position sampling is most likely to miss a
falling player through. New checkpoints are built at the saved size.

**A tower with its checkpoints shown counted none.** Checkpoints moved into
Workspace for editing were not counted, so the next one added was named `1`
beside the `1` already there, and **Renumber by height** did nothing while
they were out.

**Config can be shared between places as a Roblox package.** Games made from
the kit package `Config` so one publish updates every place, and three things
got in the way. The hub's built `Config` held only the modules the hub
requires, so a package made from it took `Admin` and `Economy` out of every
tower place that updated; the hub now ships `Config` whole. The Tower Setup
window reported an edit to a locked package script as done when Studio had
not taken it; it reads the script back and says to unlock it. And an edit it
made to an unlocked package said nothing about publishing, which is the step
that stops a change staying in one place. The Setup tab also reports a
`Config` missing a module, a copy with AutoUpdate off, and a place behind the
latest published version. [Sharing Config between your places](https://kiels.dev/Ascent/guide/configuration#sharing-config-between-your-places)

**Smaller Tower Setup fixes.** Two towers, cosmetics or shop items sharing a
name drew as one. Pointing a sign at a part made a second `ObjectValue` when
the tower's existing one sat deeper than the top level, and pressing it with
nothing selected did nothing silently. **Add to catalogue** ignored whether
the write worked, and showed its line in a box that looked editable and was
not. A Tool whose name differed from another only by a symbol was offered to
the shop under the same key, and one starting with a digit could not be
added at all. **New tower here** made a second `NEW` beside the first. The
Menus check described the client's startup order from before this release,
so several of its "what this costs" explanations were wrong. Config read
through `require` stayed as it was when the place opened; it is re-read now
whenever a Config script changes.

### Added

**The hub can be Ring Select: the map of your game.** A lobby whose whole job
is to show your Worlds and Areas, how far through each one the player is and
what is still locked, and to send them in. It draws entirely from
`Config > Worlds` and `Config > Towers`, so a ring you add appears on it
without touching code, and Return to Hub brings players back to it.

What a place runs is decided by which project is synced into it:
`hub.project.json` (or the new `Ascent Hub.rbxlx`) makes a place the ring
select hub, and `default.project.json` (`Ascent Area.rbxlx`) makes it a tower
place, as before. Nothing is checked at run time, so no setting can switch one
into the other by mistake, and a game that keeps syncing the kit into its hub
keeps the hub it had.

Each ring gets a folder in Workspace holding its build and a camera part, and
the camera flies between them as the player browses. A ring can be lit
differently by adding a `Lighting` folder beside that part, with attributes
named after Lighting properties; anything it does not mention goes back to what
the place itself is lit with. Changing World happens behind a short black
screen, since two sets are two sets and the camera cuts rather than flying
through whatever is between them.

`Q` and `E` and the two on-screen arrows move between Worlds, the left and
right keys or `A` and `D` between Areas, and up and down or `W` and `S` between
an Area and its subrealm. Each action takes a list of keys, so a fangame can
add its own. The Area list scrolls the picked ring to the top.

The hub wants its server size set to 1 and `CharacterAutoLoads` off -- neither
is something Luau can set, so both are checked at startup and reported.

Progress reads two ways: a single bar per Area, or one bar per tower coloured
by difficulty with the acronym on hover. Which one is each player's own choice,
the **Detailed Progress Meter** in the screen's Settings, and it is saved as
`settings.ringSelectDetailedProgress` through the same checked path as every
other setting. A ring with more towers than the bar template has room for
narrows the bars to fit rather than running off the screen, and widens each
acronym label back up so it reads the same on a thin bar.

A loading screen covers the first moments, until the player's data and the
place around the screen have both arrived, with animated dots and a rotating
tip. The tips are yours to write, in `Config > Messages` under `ringSelect`,
which also holds every other word the screen shows. Full instructions,
including the instance names the screen attaches to, are in the guide.

The hub is synced with only the modules it loads, worked out by following the
requires rather than listed, so it cannot fall behind.

**Config > Worlds ships a map rather than a single Area.** Two Worlds and eight
Areas, each a worked example of one unlock rule -- a count, a tier, two tiers, a
named tower, an Elo, a badge, `scope = "All"`, and all of them at once on a
final Area. Subrealms are shown as well, since nothing in the shipped file used
to demonstrate one.

They are meant to be deleted or rewritten: only Ring 1 is real, and the rest
point at the hub until their places exist. The suite now checks the shipped ones
both ways -- every Area has to open for a player who has beaten everything, and
at least one has to lock a new player -- because a rule naming a difficulty or a
tower that does not exist only warns, which reads as the Area simply being open.

**The Tower Setup window can show a tower's checkpoints while you build.**
They live in `ServerStorage > TowerCheckpoints`, which is the only place the
game reads and somewhere you cannot see them. **Show in Workspace** moves a
tower's folder into the tower so you can drag them, **Put back** returns it,
and a new checkpoint added while a tower is shown lands beside the others
rather than out of sight. A shown tower loads with no checkpoints, so the
Setup tab carries a banner and a **Put all back** button the whole time one
is out, and the folder is marked so closing Studio does not lose track of it.

**It also notices checkpoints left in Workspace by hand.** A folder in the
tower with nothing in ServerStorage is an error -- that tower loads with none
-- and **Move to ServerStorage** fixes it. One in each place is a warning
with no fix, because which set you meant to keep is not something a button
can know. A folder counts if it is named for checkpoints or holds a part
numbered `1`, `2`, `3`; `ClientSidedObjects` never does.

**`checkpointsMissingWarning` is in the Config tab**, under Build warnings
beside the three that were already there. It was the one missing from a group
that otherwise covered them all.
[Seeing checkpoints while you build](https://kiels.dev/Ascent/guide/tower-setup-plugin#seeing-checkpoints-while-you-build)

### Changed

**The guide and the issue tracker have a public home.**
[github.com/Vexx3/Ascent](https://github.com/Vexx3/Ascent) holds the guide
(still at kiels.dev/Ascent) and issue forms for bugs, ideas and problems with
the guide. Every page's *Suggest a change to this page* link now opens somewhere
you can actually edit, and a fix to the kit itself can be pasted into a bug
report. You still get the kit through the Vendr hub and the Discord.

**The Tower Setup window is easier to find your way round.** The tab for the
selected tower is called **Selected** rather than **Tower**, which sat beside
**Towers** and read as the same thing. Cards are rounded, and every card that
needs attention says so in its corner and is outlined in the matching colour.
**Open** on the Towers tab jumps to a tower on the Selected tab, which now
leads with that tower's own problems and fixes. The window reopens on the tab
you left it on, and says what each file edit did in a notice you can dismiss.
**Take out of the shop** asks twice, since a file edit is not Ctrl+Z's to undo.
A cosmetic's **Beat tower** is picked from `Config > Towers` rather than typed.

**Working from the repository: one build step, live sync, and both places at
once.** darklua is gone -- the kit ran it with no rules, so it only copied
files -- and `scripts/build.cjs` does the copy and the require rewriting in one
pass, checked to produce the old output byte for byte. `npm run dev` rebuilds on
every save and serves a tower place (port 34872) and the hub (34873) together,
so an edit reaches Studio without a manual regenerate. `npm run build` writes
all three files, now named for what they are: `Ascent Area.rbxlx`,
`Ascent Hub.rbxlx` and `Tower Setup.rbxm`; `build:plugin` is folded into it.
The type check fetches the current Roblox API definitions first, and CI runs
exactly `npm test` rather than a hand-kept copy of its steps, which had drifted.

**Kit modules moved into the folders of the features they belong to.** Only
matters if you changed kit code rather than Config: `Server` had seventeen loose
modules and now has three. `Settings`, `EditUILayout`, `Announcements` and
`Shutdown` each became a folder holding a `<Feature>Service`; `Tickets`,
`GamePasses` and `PermanentTools` moved to `Shop`; `TowerRemotes` and
`AntiCheatLog` to `Towers`; `PlayerTeams` and `CharacterSpawns` to `Accounts`.
In Shared, `Submitted` is now `ClientInput` and `Features` is
`Shop/EconomyFeatures`, names that say what they are, and `Startup` and
`Settings/Enums` are gone: the first into a new `Shared/Instances` that also
replaced three private copies of the same lookups, the second in favour of
Roblox's own `Enum.KeyCode:FromName`. On the client, `MenuController` moved to
`Client/Menu`. Nothing saved changed.

## 1.0.0-rc.3

### Breaking

**One Elo instead of two.** `normalElo` and `allJumpsElo` are replaced by a
single saved `elo`, and an All-jumps clear now counts towards it at
`allJumps.multiplier` -- a quarter of a normal clear, as shipped. A tower
beaten in both modes is worth the better of the two and not the sum, so
All-jumping something you already beat adds nothing.

Nothing a player earned is lost and there is no migration: the number was
always rebuilt on load from `eloTowers` and `eloAjTowers`, which are
unchanged, so every profile recomputes itself the first time it loads. What
does change is the value -- a player with All-jumps clears will see their
number move. Set both multipliers to `1` in `Config > Elo` to keep an
All-jumps clear worth as much as a normal one.

Also renamed with it: the leaderboard `Elo` and its store `LB_Elo` replace
`NormalElo` and `AllJumpsElo`, an Area's `requirements.elo` replaces
`normalElo`/`allJumpsElo`, `EloAwards.get(player)` no longer takes a mode,
and the completions reply carries one Elo.
[Player Elo](https://kiels.dev/Ascent/guide/elo)

### Added

**Players can gift a game pass**, with an optional note. Give the pass a
`giftProductId` in `Config > GamePasses` -- a developer product, because
Roblox cannot buy a pass for somebody else -- and its shop modal shows a Gift
button that opens `InfoModal > GiftingFrame`. Scribe delivers the gift whenever
the recipient next plays, refuses one they already own, and keeps it as a
credit if they got it some other way first. The note is filtered and only sent
once the purchase went through. Needs `Options > Gift` and `GiftingFrame` with
`RecipientBox` and `MessageBox` in the place.
[Gifting A Pass](https://kiels.dev/Ascent/guide/game-passes#gifting-a-pass)

**Chat tags can be gradients.** Swap a tag's `color` for `colors` in
`Config > Chat` and it fades between them -- any number of stops, spread
evenly, first at the start and last at the end. **Owner** and **VIP** ship as
gradients: Owner is gold out to a highlight and back, VIP is yellow falling
into amber. Every other tag keeps its one colour.

Drawn by Roblox's own `UIGradient` through `OnChatWindowAdded`, since rich
text has no gradient markup. A gradient covers a whole label, so the chat
window is given the tag as the prefix on its own and the player's name moves
to the front of the message -- the fade lands on the tag and nothing else.
The name then takes the message's colour; `tags.nameColor` gives it one of
its own. Gradient tags show in the chat window, not in bubble chat. A tag
with neither a `color` nor `colors` is now reported at startup rather than
erroring on the first message.
[Gradients](https://kiels.dev/Ascent/guide/chat#gradients)

**An FPS cap players can set and step through.** **Settings > Gameplay >
FPS Cap** holds the client to a frame rate, and two new keybinds --
**FPS Cap Increase** (`=`) and **FPS Cap Decrease** (`-`) -- step through the
same options without opening the menu. Neither wraps: Increase stops at the
fastest option, Decrease stops at Off. The list is yours, in `fpsCaps` in
`Config > Project`; Off is always first and cannot be removed.

Roblox exposes no framerate cap to experience code, so the kit holds the
render thread, which has to spin. Off is the default and disconnects the loop
entirely, so a player who never turns it on pays nothing for it.
[FPS Cap](https://kiels.dev/Ascent/guide/settings#fps-cap)

**An Area can be locked behind Elo.** `elo` in an Area's `requirements` asks
for a minimum, which gates a Ring on depth rather than on a tower count --
Elo points multiply per difficulty tier, so grinding the easiest thing you
ship will not reach it. `scope` does not apply, because Elo already counts
every World, and it is asked last, after every rule that names something to
go and beat.
[Locking an Area behind Elo](https://kiels.dev/Ascent/guide/worlds-personal-servers#locking-an-area-behind-elo)

**Three global leaderboards, ready for Roblox's own.** Two rank what a player
has beaten -- `LB_Towers` and `LB_AllJumps`, the same counts as the player
list -- and one ranks Elo, `LB_Elo`. Register one in the Creator Hub and
toggle it on: Scribe already keeps every ordered store
and writes every player who joins, so there is nothing to build and no
leaderboard UI in the kit. Roblox shows one board per experience. The store
names are written out in `Shared > Accounts > AccountData` instead of left to
Scribe's default, so renaming a board in code cannot quietly point the Hub at
an empty store -- treat them like the datastore keys and leave them alone
after release.
[Leaderboards](https://kiels.dev/Ascent/guide/player-data#leaderboards)

### Fixed

**An old-kit profile's completions import as the right towers.** That kit
keyed `CompletedTowers` by the full tower name and this one keys by acronym,
and the migration was taking each key as an acronym already -- so every
completion arrived as a tower the chart could not find and the Elo could not
price. Names are now looked up against `name` in `Config > Towers`, trimmed
and ignoring case; a key that is already an acronym still reads as one, and a
name this game does not have is kept rather than dropped.

The same lookup now runs on **every load**, not only in the migration. The
migration can only translate what `Config > Towers` named at the time, so a
name corrected afterwards would otherwise leave those profiles broken -- and
an untranslated completion is worse than cosmetic: beating that tower again
records its acronym, which the set does not have, so the completion counts
twice and the tower score rises for a tower already paid for.
[What comes across](https://kiels.dev/Ascent/guide/player-data#what-comes-across)

**Looking up another player in Completions no longer hangs on "Loading".**
The reply described each time as a table while saves hold a number, so any
player who had played a tower could not be looked up at all, and Blink sends
no reply when that happens. The reply is now built to fit whatever the save
holds, including one from before Elo and an old-kit save not yet brought over,
and a lookup that gets no answer gives up after 15 seconds with a message.

**One bad value in Studio no longer stops the Shop or Cosmetics menu loading
for everybody.** A cosmetic model with a `Rarity` outside the five, or a shop
item with a mistyped category or rarity, is left out with a warning naming it.

**One misnumbered checkpoint folder no longer stops the whole server.** A gap
in the numbering skipped the rest of startup; now only that tower is skipped,
with a warning saying why.

**Honest players are no longer kicked for crossing two checkpoints quickly.**
A drop through two floors inside one sample only counted the first, and the
winpad then refused the run as out of order.

**Dying no longer restarts the tower.** In All Jumps and Practice a death
from damage puts you back at your checkpoint and leaves the run standing,
whatever **Reset on Death** is set to. That setting now does what its name
says and applies to Roblox's Reset button: on, a reset restarts the tower;
off, it behaves like a death. The kit binds the reset button on the client,
because a Humanoid cannot tell a reset from a killbrick.
[Dying And Resetting](https://kiels.dev/Ascent/guide/settings#dying-and-resetting)

**Time spent in a tower counts when you leave the game mid-climb.** Leaving
is the commonest way a run ends, and none of that climb reached Total Time
Spent. Scribe's `OnPlayerLeaving` now records it before the final save.

**Time spent in a tower rush is counted per tower.** Leaving, restarting or
changing mode in a rush charged the whole rush's time to the tower you were on.

**All Jumps respawns at the tower spawn use `teleportHeight`** and the spawn's
facing, like every other teleport.

### Changed

**Scribe 2.4.0.** Server and client must be published together, which a normal
publish already does. Four saved fields the client never reads --
`eloTowers`, `eloAjTowers`, `eloHistoryImported` and `claimedGamePassRewards` --
are now `Scribe.ServerOnly`: saved exactly as before, no migration, but no
longer sent to every player at join. Scribe 2.4's new "your data is being
reset" kick reads from `Config > Messages > dataKicks.erasing` like the rest.

**The backpack's topbar icon only appears where there is no key for it.**
Phones, tablets and controllers keep it; a keyboard has the backquote key,
which still opens the backpack with the icon gone. `Client > BackpackIcon`
holds the rule.
[The Backpack Icon](https://kiels.dev/Ascent/guide/ui-and-hud#the-backpack-icon)

**`elo-board` is now `leaderboard`**, because it reads three boards rather
than two: `Towers`, `AllJumps` and `Elo`. `elo-board` still works as an
alias, but `alljumps` and `aj` now mean the All-jumps completion count.

The tower-load counter is called `loadId` everywhere, and the client-side
counters that only repeated what cancelling a task already did are gone.

## 1.0.0-rc.2

### Added

**Settings of your own.** `Config > CustomSettings` is a new module where one
entry becomes a settings row, a saved field and a server-side rule:

```luau
hideHealthBar = { kind = "toggle", default = false, category = "Visual" },
```

Toggles, sliders and cycle buttons. The row is copied from
`SettingsMenu > CustomTemplates`, so it matches the rest of your menu and you
restyle all of them by editing those three. Nothing else is touched -- not the
network schema, not the server, not the menu code -- and a setting added after
release needs no migration, because only what a player changed is stored.
[Adding A Saved Setting](https://kiels.dev/Ascent/guide/custom-settings)

**An Area can be locked behind a badge.** `requiredBadges` sits beside the rules
that were already there:

```luau
requiredBadges = { { id = 2124567890, name = "Ring 1 Champion" } },
```

Ownership is fetched once per join and kept on the player, so the menu can read
it while it draws. A badge the kit awards opens its Area in the same session.
Badges are asked for before every other requirement, because the others name
what to go and beat and a badge does not.

**The Blink schema ships in the place**, at
`ServerScriptService > Server > Network > NetworkSchema`. The place carried the
two generated modules and nothing they were generated from, which left anybody
working only in Studio unable to add a network message at all.

**Two more tabs in the setup window**, Cosmetics and Shop, for the two things
that had no window of their own.

### Changed

`Config > Worlds` and `Config > Economy` ship without worked examples. The file
you open first is the map of your game rather than six Areas and two cosmetics
to delete; every rule is worked through in the guide instead.

**`subDifficulties` entries say `upTo` rather than `threshold`.** Each one is the
last decimal in its band -- `upTo = 0.11` covers `.01` to `.11` -- and the old
name read like the opposite, which is how the bug below got written. Rename the
field if you customised that list; nothing saved is affected.

### Fixed

**A difficulty's decimal named the band below the one it is in.** 9.3 read
`Bottom-Low` rather than `Low`, and anything from .01 to .11 read `Baseline`.
93 of the 100 decimals were wrong. Your difficulty values do not need changing
-- only what they were called.

**A subrealm drew the full-width card** in any World past the first, because
each World menu was read for its own card templates and only the first had the
narrow one.

**A shop item selling a cosmetic authored on its model** was reported as an
error by the setup window, which asked `Config > Economy` only.

**Raising `maximumQuickResetDelay` moved the feature and nothing a player sees.**
The slider still stopped at 3.5 and still read `Off` above 3, because its end and
its label were written out in kit code while only the Config value could be
changed. All three follow that value now. At the default of 3 nothing moves.

**One anti-cheat kick posted a webhook report per limb.** Several limbs touch a
winpad before a kicked player disconnects, and the kick and the announcement
were already guarded against that -- the report was not, so one offence filled a
channel. The win webhook was never affected.

**A failed badge award or webhook post was simply lost.** Both are web calls and
both fail under exactly the load a fangame produces, so each is now attempted
three times, two seconds apart and doubling. A badge Roblox says is not
awardable is *not* retried, because asking again cannot change that answer.

**Badges were awarded before the run was saved.** A slow badge endpoint held up
the save, and a player who left in between lost the win. Awards no longer make
the win path wait.

**The setup window was silent when an old tower overrode its catalogue entry.**
A tower folder carrying `Difficulty = "Extreme"` -- the way older kits wrote it
-- plays at rating 9.00 and wins over whatever `Config > Towers` lists, but the
window read only the number attribute, so it found nothing to disagree with and
drew the row green. It now says which value the tower is actually playing at,
and a difficulty name Config does not have is an error rather than a note.

### Updating

The place-side half matters this time: **custom settings need
`SettingsMenu > CustomTemplates`**, which is new, so a copy that only takes the
scripts gets a warning in Output and no rows.

## 1.0.0-rc.1

The first release.

Ascent is a Roblox Studio template for Eternal Towers of Hell-style fangames:
tower loading, winpads, tower rushes, Practice and All Jumps, saved completions,
Elo, tickets, a ticket shop, cosmetics, game passes, chat tags, announcements,
teleports and personal servers, an admin console, and a Studio window that
checks your place while you build it. You set it up by editing the modules under
`ReplicatedStorage > Shared > Config` rather than by writing code.

A release candidate rather than 1.0.0 because nobody outside the project has
played it yet. **The names saved with a player are settled from here** — tower
acronyms, shop item keys, cosmetic keys, game pass keys, World and Area IDs, and
the datastore keys. Anything that moves before 1.0.0 gets its own entry above
this one.

### Version

`1.0.0-rc.1`. The server publishes it on `game` as `AscentVersion` at startup,
and the `kit-info` console command prints it. A server that has fallen behind
says so on screen: publish a new version and everyone still on the old one is
told, which nothing else would do, because `game.PlaceVersion` never changes for
a server once it has started.

### Coming from fanofpixels' Multi-Tower Kit

One migration ships, and this is it. Point `dataStoreKey` in `Config > Project`
at the store your live game already uses — for the v4.22 kit that is
`[MTKv4.22 Mod]` — and each profile is rewritten into the current shape the
first time that player joins. Nothing is copied and no second store is involved.

Tower completions come across, because that is what a player spent their time on
and cannot get back, and they are credited toward Elo in the same step. Settings
and shop inventories do not: a setting can be set again, and an inventory is
keyed against a shop this kit does not have, so carrying it would grant items
that do not exist.

Read [Moving An Old Kit Across](https://kiels.dev/Ascent/guide/migrating) before
you publish — it covers doing a dry run against your real data first.

### Licensing

`ReplicatedStorage > Shared > Licenses` carries the kit's terms and the
third-party notices. Two of them ask something of you: **Purse** and
**TopbarPlus** both want their attribution kept, or a credit in your experience
description.
