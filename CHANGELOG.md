# Changelog

## 1.0.0

The first stable release. From here on, the names in
[Hooking Into the Kit](https://kiels.dev/Ascent/guide/hooks) -- the server's
`Events`, `CustomData` and the `CustomCommands` folder -- stay as they are
within 1.x, and every release says under **Updating** what, if anything, has to
be done by hand.

### Updating

Coming from 1.0.0-rc.3, follow [Updating Ascent](https://kiels.dev/Ascent/guide/updating)
and then:

1. **Add `configVersion = 1` to `Config > Project`.** The server now compares
   it with the Config shape the kit expects and says so in the Output when they
   differ, which is how every later release will tell you Config needs editing.
2. **Bring `Config > Messages` up to date.** It gained groups for the shop,
   cosmetics, Completions, lock reasons, spectating, the settings menu and more,
   and the kit reads them. Replace it with this release's and copy back any
   wording of your own. The Output names any group still missing.
3. **In `Config > Chat`, delete the loop at the top and the `byGamePass =
   gamePassTags` line.** A VIP pass's tag comes from its `chatTag` in
   `Config > GamePasses` as before; the kit works it out itself now.
4. **Check `Config > Admin.userIds` and `Config > Chat.tags.byUser`.** Earlier
   releases shipped the kit author's own account in both. Take it out if it is
   still there. Whoever owns the experience -- you, or the owner of the group it
   belongs to -- has the console without being listed.
5. **In `Config > Settings.keybinds`, set `allJumpsPlace = "E"` and
   `allJumpsTeleport = "Q"`**, unless you already gave them keys of your own.
   The old defaults shared keys with Corner Flip and Quick Restart (see
   **Fixed**), and the Output says so on every start until they differ.
6. **Copy `SettingsMenu > VisualFrame > HideUI` from the new place into your
   menu** for the new Hide UI setting, and add `hideUI = false` to
   `Config > Settings` if you want to choose its default. Without the row the
   setting is not offered; without the line it starts off.
7. **Rename `resetOnDeath` to `restartOnDeath` in `Config > Settings`**, and the
   `SettingsMenu > GameplayFrame > ResetonDeath` row to `RestartonDeath` with its
   label. The Output names the Config line until it is renamed; the row still
   works under its old name. See **Changed** for what the setting does now.
8. **Copy `ButtonsHolder > AJMenuButton` and `MainMenu > AJSettings` from the new
   place** for the checkpoint panel, and add `checkpointCamera = true` and
   `checkpointTransparency = 0.5` to `Config > Settings`. The transparency
   used to be `allJumpsMarker.transparency` in `Config > Visuals`, which is no
   longer read: move your value across. Without the button and panel the game
   works as before; without the lines, those two values are the defaults.
9. **In the hub, copy `RingSelect > TopRightBar > FriendButton`, `ServerButton`
   and `Lists` from the new hub place** for its friend and server lists. A hub
   without them works as before, with neither. Copy `RingSelect > Requirements`
   across too: `AreaReqLabel` now sits in a `RequirementsList` inside it, and
   the hub does not start without one.
10. **Install the new Tower Setup plugin.** Its Setup tab now says whether it
    matches the kit the place runs.
11. **Publish every place at the same time, then shut down the old servers.**
    This release runs Scribe 2.5.0, whose save has a new shape, and a server
    still on the old version refuses a player whose save a new one has written.
    Then check the Output of one live server: anything Config gets wrong is now
    reported there when it starts.

Nothing a player has saved is lost. The save gains an empty `custom` table for
your own values, which Scribe fills in on load, and each player's Reset on
Death choice carries across to Restart on Death the first time they join.

### Security

**A locked Area is enforced on arrival, not only in the menu.** The menu and
the server checked an Area's requirements before sending anyone, but a teleport
between the places of one experience does not have to come from the kit: a
modified client can start one, and following a friend from the Roblox friends
list lands a player in whatever server the friend is in. A tower place now
checks each player who arrives once their data has loaded, and sends anyone who
has not unlocked it back to the hub with the reason. Badges only count against
a player when Roblox answered, Studio is never checked, and the administrators
in `Config > Admin` are let through so a locked Area can still be tested.

**The shipped Config no longer names anybody.** `Config > Admin` gave console
access, and `Config > Chat` an Owner tag, to the kit author's account in every
game built from the kit; the game passes and developer products were the
author's too. Both lists ship empty, the passes ship with `id = 0` -- which is
off -- and a game owned by a group now gives the console to the group's owner
without listing them.

**Every message a client sends is bounded, rate-limited and answered.**

- Strings and lists in `game.blink` carry a length, and Blink refuses a message
  over it before any handler runs.
- The settings, UI layout, backpack, cosmetics and shop requests each have a
  rate limit. They allow a good run of genuine clicks and drop a flood.
- Every client message now has a listener from the moment the server starts.
  Blink keeps a message nothing listens for and only warns after 256, so one
  sent to a feature that was switched off -- or to the hub, which listens to
  almost nothing -- piled up for as long as the server ran.
- Looking another player up in Completions reads their save from the
  datastore, from the same budget every profile load and save spends. A lookup
  is now kept for a minute, each player gets ten before waiting, and none is
  made while the budget is low.

**A gift note is shown as text.** The note is filtered, but a filter leaves
RichText tags alone, so a note could draw giant text or a fake system line on
the recipient's screen.

**Runs that used a Studio test tool earn nothing.** A tool from
`ServerStorage > StarterPackStudio` skips the minimum time and the checkpoint
check, and the run still paid out its completion, badges and tickets. It still
reaches the winroom, so an ending can be tested with one, and the player is told
it did not count.

**Webhook posts ping nobody**, whatever a player's name spells.

### Breaking

**Functions that wait are named for it.** The kit's rule is that a function
which yields ends in `Async`, so a caller can see which calls hold up the
script, and several documented ones did not. A script of your own that calls
one needs the new name:

| Module | Was | Now |
| :-- | :-- | :-- |
| `Server > Towers > TowerRegistry` | `loadForPlayer`, `resetClientObjects` | `loadForPlayerAsync`, `resetClientObjectsAsync` |
| `Server > Accounts > Progress` | `incrementTowers`, `incrementAllJumps`, `incrementTowerAttempt`, `incrementRushAttempt`, `addTowerTimeSpent` | the same, each ending in `Async` |
| `Server > Announcements > AnnouncementsService` | `globalNotification`, `winAnnouncementAsync` | `globalNotificationAsync`, `winAnnouncement` (it no longer waits) |
| `Shared > Commands > Authorization` | `isAuthorized` | `isAuthorizedAsync` (a group-owned game asks Roblox for the rank) |

Nothing saved changes; only the names a script calls.

**`Config > Chat.tags.byGamePass` is gone.** It was code sitting in the one
folder that should hold none; see **Updating**.

**Webhooks ship switched off**, since they post nothing until the secrets
exist and warned on every win until then. Set `webhooks.enabled = true` in
`Config > Chat` once they are set up.

### Fixed

**A win announced across servers could be lost.** A difficulty that announces
globally made the win wait for Roblox's cross-server messaging before it was
saved, so a player who left in that moment lost the completion, its points and
tickets -- and for a rush, the whole rush -- while keeping the Elo. The hardest
towers were the ones this hit. The announcement no longer holds anything up.

**Looking up a player in Completions could show somebody else.** The user ID
travelled as a 32-bit number, which newer accounts are past, so a lookup read
a different, older account and showed it under the name typed.

**Tower client objects went to every player in the server.** Anything parented
to a Player replicates to every client, so each tower load and each Normal-mode
restart sent the whole tower's client objects -- thousands of instances in a big
tower -- to everyone, and each player's everpresent objects sat on every client
for the session. They now go through the player's own PlayerGui, which only
they receive, and the client waits for the whole folder before copying it
rather than copying the moment its first part arrives.

**A personal server's closing countdown could not be called off.** An owner who
left and came back inside the grace period still had their guests told the
server was closing, and a second departure then closed it with no warning.

**A slow moment of Roblox's group service took group cosmetics off players.**
A failed group lookup read as "not a member", and the server unequipped the
cosmetic and saved that. A lookup is now remembered for five minutes and a
failure changes nothing.

**Rejoin in a personal server opened a public one.** A reserved server cannot
be joined by its instance ID; its access code is used instead.

**A teleport that failed once under way could leave a player where they were
being sent from.** Guests of a closing personal server, and a player sent back
from an Area they had not unlocked, were removed if the teleport failed at
once but not if it failed later. Both are now. Guests also go to the hub one at
a time, since the hub holds one player a server.

**The shop could charge more than it showed.** A purchase that arrived just
after the featured row rotated was charged full price for an item shown at a
discount. The server now refuses a price higher than the one shown, and says
why.

**A global win showed twice on the server it came from** when two landed close
together, and a player whose data was slow to load past two minutes stayed on
the loading screen for good. A webhook refused outright is no longer asked
twice more, and an empty `antiCheatKickMessages` no longer stops the kick it
was announcing.

**Restarting as fast as a key repeats rebuilt the tower each time.** A restart
that rebuilds the tower now waits at least half a second whatever
`restartCooldown` says, and walking back into your own tower's portal counts as
a restart rather than a reload with no limit.

**Removing an All Jumps checkpoint no longer throws away the rest on a death.**
The client keeps every checkpoint placed, but the server kept only the latest,
and Remove cleared it. A player who placed three and removed one still saw two,
and the next death sent them to the tower's spawn. The server now keeps the
same stack, so a death goes to the checkpoint on top.

**A gradient chat tag no longer turns the player's name white.** A UIGradient
colours the whole chat prefix, so the name was moved into the message to keep
the fade off it, and took the message's colour there. A gradient tag is now
coloured one character at a time, in front of the name like a flat tag, and
the name keeps the colour the chat gives it. `tags.nameColor` in
`Config > Chat` existed only for that; delete it if you set it.
[Gradients](https://kiels.dev/Ascent/guide/chat#gradients)

**A saved name spelled like one of Scribe's own no longer breaks.** Scribe
answers `Count`, `Max`, `Default`, `Toggle` and two dozen other names with a
method of its own, so `CustomData.get(player, "Count")` errored, and so would a
custom setting, an emote or a tower acronym called one of them. Saved names are
now looked up with Scribe 2.5's `Child`, which reaches the entry whatever it is
called.

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

**On a phone, the D-pad setting could hold up the rest.** Switching the touch
control asks Roblox's control module to choose again, and on a device whose
touch controls were not up yet that call waited for them -- and so did every
setting applied after it, which on a phone was most of the menu. The switch now
runs beside the other settings instead of in front of them.

**All Jumps' on-screen buttons did nothing on a phone** when the menu arrived
after All Jumps started, which on a live server is often. They were looked for
once; they are waited for now.

**All Jumps' default keys each did two things.** Teleport was `R`, which is
also Quick Restart, and Place was `F`, which is also Corner Flip, so a press
did both. They are `Q` and `E` now. A player who has already played keeps the
keys saved with them and can change them in Settings; your own Config needs the
edit in **Updating**.

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

**Hooks for your own Scripts.** `ServerScriptService > Server > Events`
announces a tower won, a rush won, a tower loaded or left, a shop purchase, a
game pass applied, tickets awarded and a player's data ready, and
`Events.waitForStartAsync()` waits for the kit to finish starting. The client
has its own for what the player sees. `Server > CustomData` saves numbers,
strings and flags of your own with each player, and a
`ServerScriptService > CustomCommands` folder adds admin commands. All three
live outside the kit's folders, so updating the kit leaves them alone.
[Hooking Into the Kit](https://kiels.dev/Ascent/guide/hooks)

**Hide UI, a focus mode for climbing.** A Visual setting that fades the Menu
and Spectate buttons, the music button and the place version out of the way,
and back in while the pointer is over one, so the screen is left to the tower.
A faded button still works: a tap on a phone presses it and shows it for a few
seconds. Switching the setting off puts everything back as authored. The timer,
health, keys, boosts and touch controls never fade. Tag an element of your own
`HideUI` in Studio and it fades with them.
[UI & HUD](https://kiels.dev/Ascent/guide/ui-and-hud#hide-ui)

**A checkpoint panel for All Jumps and Practice.** `AJMenuButton` beside the
menu button opens `AJSettings`, which shows how many checkpoints are placed,
teleports to any of them by number, sets how see-through the markers are, and
turns camera loading on or off: whether going to a checkpoint also turns the
camera back to where it faced when it was placed. Both choices are saved with
the player. The button shows only in All Jumps and Practice.
[The Checkpoint Panel](https://kiels.dev/Ascent/guide/practice-all-jumps#the-checkpoint-panel)

**Friends and personal servers in the hub.** Two buttons at Ring Select's top
right open a list of friends playing the game, each with their headshot and a
button naming the Area they are in, and a server list that makes a personal
server for the Area on screen, joins one by its code, or goes back to the one
the player owned and left, for as long as it stays open. Without the Personal
Servers pass the create button says so, draws darker, and opens the purchase
prompt. A friend in a locked Area is listed, and joining says what is missing.
Each list has a `Warning` for why it is empty or what just went wrong.
[Friends And Servers](https://kiels.dev/Ascent/guide/ring-select#friends-and-servers)

**The FPS counter shows the cap.** With FPS Display on, the topbar counter has
a second line, `CAP: 60` or `CAP: OFF`, following the FPS Cap setting and its
keys as they change it.
[FPS Cap](https://kiels.dev/Ascent/guide/settings#fps-cap)

**Guests hear when a personal server's owner comes back.** They were told the
server would close when the owner left; now they are told when the owner's
return calls that off, with `personalServers.ownerReturned`.

**Hovering a tower's bar in the hub outlines its frame.** A bar in Ring
Select's `DetailedProgress` outlines, in white, the Model or part named after
that tower's acronym in the Area's folder under `Workspace > Rings`. A ring
without frames shows nothing.
[Progress](https://kiels.dev/Ascent/guide/ring-select#progress)

**A loading screen for every teleport.** From the moment the server starts one,
the hub puts its loading screen back up with the tips going round, and a tower
place shows its own. A still copy of it is what the player sees between the
two places, rather than Roblox's screen. A teleport that fails takes it down
again and says why.
[Loading Screen](https://kiels.dev/Ascent/guide/ring-select#loading-screen)

**The spectate panel says how many are watching.**
`SpectateFrame > PlayerFrame > SpectatorCount` shows how many players are
spectating the one on the panel, you included, and hides when nobody is.
Spectate yourself and it says how many are watching you. The label is optional,
so copy it across from the new place to have it; a panel without it works as
before.

**Config is checked when the server starts.** A tower naming an Area that does
not exist, an unlock rule naming a tower or difficulty Config does not have, a
renamed difficulty that now pays no tickets, overlapping difficulty bands, a
game pass with no ID, the same key for live and Studio saves, and place IDs
that are not places in your experience are each reported, naming the line to
open. Place IDs come a moment later in a block of their own, since checking
them asks Roblox.

**The rest of what players read moved into `Config > Messages`,** so it can
be reworded or translated in one place. The shop, cosmetics, Completions,
spectating, the settings menu, lock reasons and the teleport menu had their
text written into the code.

**One version, checked.** `Shared > KitVersion` is the kit's version, the build
refuses to run when it and the package disagree, the hub reports it as well as
the tower places, and `kit-info` answers with it and the Config version.

**Output messages say where and how.** The warnings for a tower with no
checkpoints or minimum time, a missing spawn, an R15 character, a part in
`Portals` that is not a portal, a missing damage remote and a win message with
no channel each name the thing to open and the setting that silences them.

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
point at Ring 1 until their places exist. The suite now checks the shipped ones
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

**A shop Item shows its Tool's own icon.** An `Items` entry in
`Config > Economy.shop` now draws the `TextureId` of the Tool it hands out, so
the picture is set once, on the Tool. `icon` is optional for them and only used
for a Tool without one; Trails and Auras still need it. The shipped coils no
longer carry an `icon`.
[Ticket Shop](https://kiels.dev/Ascent/guide/ticket-shop#add-an-item)

**Progress percentages always have one decimal place**, rounded down so a list
one short never reads 100: `(0.0%)`, `(90.9%)`, `(100.0%)`, in the hub and in
Completions.

**An Area's requirements read as goals, with the player's progress on each.**
`Beat 12 Towers (3/12)`, `Beat 2 Extreme+ Towers (1/2)`, `Beat ToDNE (0/1)`,
`Reach 500 Elo (120/500)`. The Teleport menu and a refusal still show the first
one not met; the hub lists every rule at once, one line each, with the met
ones in green and each difficulty in its own colour. A difficulty still counts
every tower of it or harder. `{TowerWord}` in `Config > Messages.locks` is now
capitalised and plural where the count is more than one, following
`towerWord` and `towerWordPlural` in `Config > Project`.
[Locked Areas](https://kiels.dev/Ascent/guide/ring-select#locked-areas)

**Reset on Death is Restart on Death, and it covers every death.** It used to
restart the tower only for Roblox's Reset button; a killbrick still ended a
Normal run or sent All Jumps and Practice to their checkpoint. On, any death or
reset in a tower now starts it again from the bottom, in every mode, straight
away rather than after the respawn. Off, nothing changes. The saved setting,
the Config field and the menu row are renamed to match; each player's choice
carries across. [Dying And Resetting](https://kiels.dev/Ascent/guide/settings#dying-and-resetting)

**Scribe 2.5.0.** Server and client must be published together, and every
place at once; see **Updating**. A gift refused because the buyer already has
too many on the way now says so, instead of "couldn't send that gift".

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
[What comes across](https://kiels.dev/Ascent/guide/migrating#what-comes-across)

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
