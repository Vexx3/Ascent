# The Tower Setup Window

Tower Setup is a window inside Studio that checks every tower in your place,
and everything those towers reward you with, against what the kit actually
expects — and fixes what it can in one click.

## Installing it

The window is a Studio plugin, not part of the place. Install it from the
[Creator Store](https://create.roblox.com/store/asset/133971753175712/Ascent-Setup),
or by hand from `Tower Setup.rbxm`, which comes with the kit beside the place
files:

1. In Studio, open the **Plugins** tab and click **Plugins Folder**. That opens
   the folder Studio loads plugins from — `%LOCALAPPDATA%\Roblox\Plugins` on
   Windows, `~/Documents/Roblox/Plugins` on a Mac.
2. Copy `Tower Setup.rbxm` into it.
3. Restart Studio. It only reads that folder on startup, so a newly copied
   plugin does not appear until you do.

Find it afterwards under the **Ascent** toolbar, button **Tower Setup**.

::: tip Why it is not in the place
Because a plugin can do things a script in the place cannot: put a button on the
toolbar, open a dockable window, write to your config file, and join Studio’s own
undo history. It also means the window survives you rebuilding the place, and
opens against any place at all — point it at one that is not a fangame and it
simply finds nothing.
:::

## Why it exists

Most of the ways a tower breaks are invisible in Explorer. A part named `Winpad`
instead of `WinPad` looks right and never registers. A checkpoint folder that
goes 1, 2, 4 stops the tower loading for everyone. A tower with no `Spawn` is
skipped with a single line in the Output. The window exists to tell you before
your players do.

## The six tabs

The window is ordered the way a game is actually built.

| Tab | Answers |
| :-- | :-- |
| **Setup** | Is this place wired up at all? |
| **Towers** | Which of my towers are broken? |
| **Selected** | Fix the tower I have selected. |
| **Cosmetics** | What do my trails and auras cost to earn? |
| **Shop** | What does the ticket shop sell, and for how much? |
| **Config** | Tune how the whole game plays. |

The window reopens on whichever tab you left it on. Every card that needs
attention says so in its corner — **2 errors**, **1 warning** — and is outlined
in the matching colour, so a long tab can be scanned without reading it. On the
Towers tab, **Open** on any tower selects it and jumps to the Selected tab.

Setup and Towers only read the place, apart from their one-click fixes.
Selected and Cosmetics write to it, and everything they write goes through
ChangeHistoryService, so any of it is one Ctrl+Z away. Shop and Config write to
`Shared > Config` instead, one line at a time. Those are script edits rather
than changes to instances, so the window says what it wrote after each one, and
asks twice before it takes an item out of the shop.

::: tip Number boxes refuse rather than guess
A number box only writes a number. Type `5.3x`, `nan` or a badge ID with a
decimal point and the box puts back what it held and says why underneath, rather
than writing nothing — which on an attribute would have cleared it. Where empty
means "not set", as on a badge ID, clearing the box clears the value.
:::

## Setup

One question asked of three places, ordered by how far the failure reaches.

Above them, the summary says which release of Ascent the place runs and whether
this window came from the same one. A window from another release checks the
place against rules that are not its own, so install the plugin that came with
your kit. See [Updating Ascent](./updating.md#the-tower-setup-window).

### Menus

The menus are the one part of the kit that is yours to lay out. `StarterGui` is
built in Studio rather than by code, and until this tab nothing had ever read it
back — while the client is exact about the names it reaches for inside it.

The order things start in is what makes this worth a tab of its own. The client
sets the menus up **before** it connects the player's saved data, and the data
is what lifts the loading screen. So a frame the menu cannot do without is not a
broken menu: it is every player stuck behind a loading screen that never lifts.

It reports the consequence, because they are genuinely different things to be
handed:

| | What the client does | What you see |
| :-- | :-- | :-- |
| **stops the client** | The first thing it asks for, and it errors without it | Nothing on the client runs. Only `TowerGUI` is this. |
| **errors the menu** | `error` while setting the menu up | The loading screen never lifts, with one line in **Output** saying why. |
| **switches a menu off** | Each menu is set up inside a guard | That one menu does nothing for the session, with a warning in **Output**. |
| **menu incomplete** | Looks for it and carries on | This part does nothing; the rest of the game is fine. |

`SpectateFrame` is worth knowing about: every name inside it is waited for, for
ten seconds each, while the menu is being set up. One missing label there holds
the menu up for those ten seconds and then switches spectating off, saying which
name it could not find.

::: tip Names, and when the class matters
The window asks for a class only where the client checks one. In the
Completions chart the client reads its parts through a Luau type, which is not
checked when the game runs — so there the name is the whole contract. The
shipped menu makes the point: `PlacesContainer` and `List` are
`ScrollingFrame`s and a progress bar's `Fill` is an `ImageLabel`, all three
declared as `Frame` and all three working perfectly.
:::

Nothing here has a fix. A missing `ShopMenu` is a menu to design, and a window
that made an empty frame of that name would only turn a plain error into a shop
that opens onto nothing.

### Folders and services

The second section is about the place rather than any one tower in it: the
folders and markers the kit reaches for by name, whether they are there, and
anything that only shows up when every tower is looked at together.

This is the half that fails in silence.

Most are read while the server script is still loading. Deleting one is not a
feature that stops working — it is **the server never starting**, with one line
in Output ten seconds after you pressed Play.

They all ship with the place file, so a missing one was deleted. Usually while
tidying `ServerStorage`, usually because it looked empty.

| It finds | Severity | Because |
| :-- | :-- | :-- |
| `Config` is missing a module | Error | Every Config module is required by name, so whatever requires the missing one errors when the server or client starts. |
| A newer `Config` package is published | Warning | This place plays by older settings than your other places until it is updated and published. |
| `Config` does not update itself here | Warning | `Config` is a package with AutoUpdate off in this place, so a change published from another place never arrives. |
| No `Workspace > Towers` | Error | `TowerRegistry` waits ten seconds for it and errors, and the client's tower display does the same, so nothing on the client starts either. |
| No `Workspace > Markers` | Error | Two modules wait ten seconds for it and error, both required before the server starts anything. Nobody can join. |
| No `ServerStorage > TowerCheckpoints` | Error | Named with a plain dot in `TowerRegistry`, so requiring that module fails outright. |
| No `ServerStorage > TowerClientObjects` | Error | The same, even in a game whose towers keep their client objects in `Workspace`. |
| No `ServerStorage > WinpadParticles` | Error | `Winpads` waits ten seconds for it and errors. Fixable in one click — the window rebuilds the emitter the kit ships. |
| No `Workspace > Portals` | Warning | Nothing is registered as a portal, so no tower can be entered by walking into one. |
| No `Workspace > Rig` | Warning | The shop's cosmetic preview copies it. Without one the Preview button does nothing. Only asked when cosmetics are switched on. |
| No `SpawnLocation` marker | Error or Warning | On its own, leaving a tower drops the player at a Roblox spawn rather than your lobby. Beside a `LobbyTP` marker it is fatal: `Navigation` errors, taking teleports, personal servers, winpads and the startup asset checks with it. |
| No `WinroomSpawn` marker | Warning | A win with no winroom of its own counts, then leaves the player standing on the winpad. |
| Chat is set to the legacy service | Error | No `TextChannels` are made, so announcing a win errors every time. |
| No chat channel called *X* | Error | `Config > Chat` names a channel this place will not have when it runs. |
| Practice mode is missing its tools | Warning | Practice still works and hands the player nothing to practise with. |
| No Team called Start or Winners | Error | The server calls `error()` on startup rather than running without them, so nobody can join. Fixable in one click with **Create Team**. |
| Checkpoints with no tower | Warning | A folder in `TowerCheckpoints` no tower goes by. Usually a tower renamed without its checkpoint folder, which then loads with none. |
| Listed in this area, but not here | Warning | Config puts the tower in the Ring this place is, and no folder goes by that name, so the chart shows a tower nobody can enter. |
| Rush names an unknown tower | Error | A rush walks its list in order and stops at the first name `Config > Towers` does not describe. |
| Rush spread across areas | Error | A rush never leaves the server it started in, so it stops at the first tower this place does not have. |
| Tower in an area that does not exist | Warning | The chart groups by Area, and an Area nobody has described has no group. |
| This window does not know which area this place is | Warning | Until it does, it cannot tell a missing tower from one that lives in another Ring. See [Which area this place is](#which-area-this-place-is). |

Markers are found recursively, the way the game finds them, so one inside the
model you built the lobby as counts.

::: tip Why the chat check is a prediction
`TextChatService.TextChannels` does not exist in Studio at all; Roblox builds
it when the game starts. So the window cannot look for your channel, and asks
instead whether it *will* be there — which is `CreateDefaultTextChannels` for
one of Roblox's own names, and whether you authored a `TextChannel` for any
other.
:::

Neither marker is created for you. A marker is a position in your lobby and the
window has no way to guess where; the folders it will make, because there is
only one right answer for those.

### Rewards

The third section checks everything a tower rewards you with — the half nobody
could see from Studio.

Before it, these were found by players:

- a shop entry naming a missing Tool, by clicking **Buy** and being refused;
- a cosmetic with no model, by equipping it and staying bare;
- a misspelled `CompletionTools` folder, never at all.

Every one of these is a name in `Config` having to match a name in
`ServerStorage`, which is exactly what a window can check while you build.

| It finds | Severity | Because |
| :-- | :-- | :-- |
| No Tools folder | Error | Nothing that hands out a Tool works without `ServerStorage > TicketShopItems > Tools`. |
| No tool for an item | Error | The item is on sale and cannot be bought. |
| No cosmetic for an item | Error | A `Trails` or `Auras` entry finds its cosmetic by **key**, so the two spellings have to match. |
| No model for a cosmetic | Error | Players unlock it, equip it, and nothing appears on them. |
| No `Trails` or `Auras` folder | Error | `Config > Economy` lists cosmetics of that kind and `ServerStorage > Cosmetics` has nowhere to keep them. Fixable in one click. |
| No tool for a pass | Error | Owning the game pass does nothing. |
| No trail for a pass | Error | The VIP pass unlocks a trail `Config > Economy` does not list. |
| Completion tools with no tower | Error | The folder name has to be the tower's acronym, so a typo means the reward is never handed out. |
| No chat tag for a pass | Warning | The rest of the pass works; owners get no tag. |
| Empty completion tool folder | Warning | Only `Tool` instances are cloned, so beating that tower awards nothing. |
| Tools outside the Tools folder | Warning | The kit only looks one level further in. Fixable in one click. |

A tower with no folder under `CompletionTools` is the normal case — most towers
award nothing — so it is never reported.

The same checks run on the server when the place starts and print to the
**Output** window, for anyone who is not looking at this window.

## Towers

The Towers tab lists every tower, worst first, with what is wrong and why it
matters. Anything it can safely repair has a button next to it, and **Open**
takes you to the tower on the Selected tab. Towers with nothing wrong are one
line each at the bottom.

| It finds | Severity | Because |
| :-- | :-- | :-- |
| No spawn | Error | The game skips the tower, so nobody can enter it. |
| Winpad spelled wrong | Error | Only a part named `WinPad` exactly becomes a winpad. |
| No winpad | Error | There is nothing to touch to finish the tower. |
| Checkpoint gap | Error | The game skips the whole tower at startup, for everyone, and the order is also what players must touch. |
| Not a numbered part | Error | Only numbered BaseParts belong in a checkpoint folder; anything else makes the game skip the tower. |
| Checkpoint number used twice | Error | The game counts the folder rather than reading the names, so a repeat sends it looking for a number that is not there, and it skips the tower. |
| Checkpoints are in Workspace | Error | A checkpoint folder in the tower and nothing in `ServerStorage`, so the tower loads with none. See [Checkpoints in the wrong place](#checkpoints-in-the-wrong-place). |
| Two sets of checkpoints | Warning | One in the tower and one in `ServerStorage`; the game uses the second and the first leaks the route. |
| Checkpoints are shown for editing | Warning | Moved into the tower by **Show in Workspace**. Put them back before you publish. |
| No checkpoints | Warning | Nothing checks the route, so anyone reaching the winpad wins. |
| No minimum time | Warning | A run of any speed is accepted, so the too-fast check is off. |
| Nothing describes this tower | Warning | No attributes and no config entry, so it loads unnamed at the default difficulty. |
| Not in an area | Warning | The Completions chart has nowhere to put it. |
| No difficulty | Warning | It sorts as rating zero and shows as Unknown. |
| Sign points at nothing | Warning | A `PortalSign` or `ChartLine` with no part in it is never coloured, so the tower reads as wired up and is not. |
| Sign is the wrong class | Warning | Only an `ObjectValue` is read, so a sign that is anything else is skipped in silence. |
| Not in the catalogue | Warning | Only this place knows the tower exists. See [Adding a tower to the catalogue](#adding-a-tower-to-the-catalogue). |

Anything wrong with the place rather than with one tower — teams, rushes,
Areas, checkpoint folders that belong to no tower, ending IDs shared between
towers — is not on this tab. It is on the [Setup](#folders-and-services) tab,
with the whole skeleton around it.

The one-click fixes here are **Add Spawn**, **Add WinPad**, **Rename to
WinPad**, **Create folder**, **Move to ServerStorage**, **Put back** and
**Renumber by height**. Every one is a single undo step, so try them freely.

::: tip Renumber by height
This is the fix for a checkpoint gap. It sorts the parts from lowest to highest
and numbers them 1 upwards, which is the order a player reaches them and the
order the game reads them in.
:::

## Selected

Select a tower, or anything inside one, and the Selected tab shows it.

- **The first card** is the tower itself: its acronym and name, everything the
  Towers tab would say is wrong with it, and the same one-click fixes.
- **Structure** tells you what it has and what it is missing, and gives you
  **Add checkpoint here** (drops one 24 studs in front of the camera, numbered
  next in sequence, built at your [checkpoint size](#checkpoint-size)), **Renumber by
  height**, **Select checkpoints**, **Show in Workspace** / **Put back** (see
  [Seeing checkpoints while you build](#seeing-checkpoints-while-you-build)),
  and **Add ClientSidedObjects**.
- **How it plays** edits the values that live on the tower itself: minimum time,
  the All Jumps badge, the ticket multiplier, **Pay tickets on rebeats** (every
  win pays, ignoring the cooldown), and **Ban boost items** (the `NoBoosts`
  tag).
- **What this tower is** sets the name, difficulty, area, badge and type. These
  are attributes on the tower folder, so you set them where you can see the
  tower, and they win over its `Config > Towers` entry — apart from the area,
  which the game always takes from the entry. The area here is what the window
  writes into that entry.
- **Signs** points a tower at the two parts it recolours when somebody beats
  it. See [Signs](#signs).
- **In Config > Towers** shows what the catalogue says about it, and lists
  anything the two disagree about. Neither side is wrong on its own — the
  attribute is what this place uses and the entry is what every other place
  uses — so there is no fix button, only the difference.

A tower from an older kit carries its difficulty as a **name** rather than a
number, and the tab says so instead of showing an empty box. That still works,
but a name has no decimal to carry, so `"Extreme"` plays as `9.00` and the
comparison reads *"the name Extreme here, which plays as 9 rather than the 9.26
listed"*. Type a rating into **What this tower is** to give it one. A name
`Config > Towers` does not have resolves to nothing, and that is reported as a
fault rather than a note.

With nothing selected the tab offers **New tower here**, which creates a folder
named `NEW` (or `NEW2`, and so on, if that is taken) with a spawn, a winpad and a
client objects folder where you are looking, with its `Area` already set to the
Ring this place is. Rename it to your acronym before anyone beats it — the
acronym is what completions are saved under — and carry on.

### Seeing checkpoints while you build

Checkpoints live in `ServerStorage > TowerCheckpoints`, which is the only
place the game reads them from. It is also somewhere you cannot see them, and
placing a checkpoint you cannot see is miserable across a whole game's worth
of towers.

**Show in Workspace** moves that tower's checkpoint folder into the tower so
you can see and drag them. **Put back** returns it. While a tower is shown,
**Add checkpoint here** drops the new one beside the others rather than into
ServerStorage, so what you add is what you see, and **Renumber by height**
works on the shown set.

::: danger Put them back before you publish
A shown tower loads with **no checkpoints at all** — the game reads
ServerStorage and nothing else, so anyone who reaches the winpad by any means
wins it. They also replicate from Workspace, handing every client the route.

The Setup tab shows a **Checkpoints are in Workspace** banner with a **Put all
back** button whenever any tower is shown, and the Selected tab says so on the
tower itself. The folder is marked, so closing Studio part-way through an edit
does not lose track of where it belongs.
:::

### Checkpoints in the wrong place

The window also notices checkpoints you put in Workspace yourself, which is a
natural thing to do and does not work:

- **Checkpoints are in Workspace** — a checkpoint folder in the tower and
  nothing in ServerStorage. An error, because the tower loads with none.
  **Move to ServerStorage** fixes it.
- **Two sets of checkpoints** — one in each place. A warning: the game uses the
  ServerStorage set and ignores the other, which still leaks the route. There
  is no fix button, because which set you meant to keep is not something a
  button can know.

A folder counts as checkpoints if it is named `Checkpoints`, `TowerCheckpoints`
or the tower's acronym, **or** if it holds a part numbered `1`, `2`, `3` —
since the name is the thing people get wrong. `ClientSidedObjects` is never
mistaken for one.

### Adding a tower to the catalogue

An acronym holding a symbol -- `ToH:AC`, say -- is written as
`["ToH:AC"] = { ... }`, because Luau will not take it as a bare key and a
file written that way stops parsing altogether. You can write it either way
by hand; the window finds an existing entry in both spellings.

A tower is described by attributes on its folder *and* by an entry in
`Config > Towers`, and it needs both — attributes live in one `Workspace`, and
the entry is what travels to your other places. See [what goes in code and what
goes on the tower](./tower-setup.md#what-goes-in-code-and-what-goes-on-the-tower).

When a selected tower has no entry, the Selected tab says so and shows the exact
line it would add:

```luau
ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

**Add to catalogue** puts that line at the top of the `towers` table and touches
nothing else — your comments, ordering and formatting all survive.

It refuses rather than guessing. If the file has no `towers = {` line, or more
than one, or already mentions the acronym, it writes nothing and says why, at
the top of the tab.

Either way you can select the line and press <kbd>Ctrl</kbd>+<kbd>C</kbd>.

The line only appears once the tower has a difficulty and an area — its own
`Area`, or failing that the Area this place is — because without those there is
no entry worth writing.

::: warning Using Rojo?
Copy the line into your own file instead. Rojo syncs one way, from your files
into Studio, so anything this window writes into the place is overwritten the
next time it syncs.
:::

::: tip The window reads Config as it is now
Studio caches a ModuleScript once it has run, so the window reads a fresh copy
of `Config` whenever any of its scripts has changed — whether this window wrote
the change or you did. An Area you add to `Config > Worlds` by hand shows up
without reopening the place.
:::

### Signs

A tower can turn two parts green when somebody beats it, and yellow when they
beat it in All Jumps: the sign at its portal, and its line on a lobby chart.
Both are optional and most towers have neither.

Each is an `ObjectValue` inside the tower, named `PortalSign` or `ChartLine`,
holding the part to recolour. Making one by hand means creating the value and
then finding the part in the Properties picker, so the tab does it from your
selection instead: **Set portal sign to selection** and **Set chart line to
selection** point it at the last part you selected. A value the tower already
has is reused wherever it sits, so you never end up with two.

A portal sign is usually part of the tower, so selecting it is enough.

A chart line usually is not — it lives on a lobby board, and selecting it alone
would take this tab off the tower. Select part of the tower first, then
<kbd>Ctrl</kbd>-click the line: **the tower comes from the first selection, the
target from the last.**

The colours are `Config > Visuals.towerSigns`.

::: warning A sign that points at nothing
The game colours whatever the value holds and says nothing at all when it holds
nothing, so a sign that was never finished looks wired up in Explorer and stays
grey for every player who beats the tower. The Towers tab calls that out; not having a
sign at all is not a problem and is never mentioned.
:::

### Endings

An ending is a winpad. The Selected tab lists every winpad the tower has,
one card each, and **a tower with one winpad gets a card too** — the server reads
a badge, a winroom and **Do not award the tower's badge** off a lone winpad as
it does off five, so a single ending can still carry those without the tower's
catalogue entry saying so.

The winpad whose ending ID is the tower's acronym — an empty one — is the
**main ending**, and only it records the tower as beaten. Any other ID makes a
side ending, which announces the win and awards badges but does not count as a
completion. See [Winpads & Endings](./winpads-endings.md#custom-ending).

Every field may be left empty, and the placeholder says what happens if you do.

| Field | Leave it empty to |
| :-- | :-- |
| Ending ID | Use the tower's acronym, which makes this the main ending. |
| Ending name | Use the tower's name. The main ending always does. |
| Difficulty | Use the tower's own difficulty. The main ending always does. |
| Badge ID | Award no badge for this ending. |
| Winroom marker | Send the player to `WinroomSpawn`. |

There is also a **Do not award the tower's badge** tick. A tower's own badge is
normally awarded whichever ending a player reaches; tick this on an ending that
should award only its own badge and not the tower's — a secret ending meant to
be found instead of, not as well as, the normal one.

**Add another ending** copies the first winpad beside itself and gives it a free
ending ID — `ToH2`, `ToH3` and so on — so a second exit is a button rather than
a hunt through attribute names. That makes it a side ending. The copy lands next to the original, carrying its shape and material but
none of its settings; drag it where the ending actually is. A tower with no
winpad at all gets **Add a winpad** instead, which is the same button doing the
same thing from nothing.

**Remove ending** deletes that winpad, which is all an ending is. Both
buttons go through Studio's own undo history, so an ending added or removed by
mistake is one <kbd>Ctrl</kbd>-<kbd>Z</kbd> away.

::: warning
Leave the main winpad's ending ID empty or equal to the acronym. Give it any
other ID and reaching it stops counting as beating the tower — no win, no
tickets, no points — while it still announces and awards badges.
:::

## Cosmetics

Every trail and aura in `ServerStorage > Cosmetics`, one card each, and what a
player has to do to earn it.

These are attributes on the model rather than lines in a file, which is why this
tab exists at all: a cosmetic can describe itself completely and needs no entry
in `Config > Economy`.

| Field | Empty means |
| :-- | :-- |
| Shown as | Use the model's name. |
| Rarity | **Not a cosmetic.** See below. |
| Locked hint | No explanation while it is locked. |
| Beat tower | No tower requirement. Picked from `Config > Towers`, so it cannot be misspelled. |
| Beat difficulty | No difficulty requirement. |
| Beat this many | No count requirement. |
| Group ID, Lowest rank | No group requirement. Lowest rank appears once there is a group, and takes 1 to 255. |
| Roblox Premium | Premium does not unlock it. |

**Any one of the five unlocks it**, so they are alternatives rather than a
checklist. Leaving all five empty is a perfectly good cosmetic: it becomes one
that only the shop or a game pass hands out.

The rarity picker offers the names in `Config > Economy.rarityColors` and
nothing else, because a rarity with no colour draws a card with no colour. Only
the five the kit ships — `Uncommon`, `Rare`, `Epic`, `Legendary` and `Mythic` —
work in game: a name you add to `rarityColors` shows up in the picker, and the
server ignores it with a warning in the Output.

::: tip Two things this tab tells you that nothing else does
**"Not a cosmetic yet"** — the model has neither a rarity nor a Config entry, so
the game cannot see it. A finished model sitting in the folder doing nothing,
whose only symptom until now was never appearing in the menu.

**"…with no model"** — the reverse, and the worse half: `Config > Economy` sells
something `ServerStorage` has not got. A player can unlock and equip it and
nothing appears on them.
:::

A cosmetic that is also in `Config > Economy` says so. Where both describe the
same field the attribute wins, so the two can disagree — the entry is still the
better place when you want every cosmetic and its rules in one list.

The model's **name is the id saved against everyone who owns it**, so settle it
before release. Renaming one afterwards loses what players earned under it.

## Shop

Everything the ticket shop sells, one card each, and one button for everything
it could sell and does not.

This is the odd tab out. A shop item has nothing in the place to carry
attributes — it is a table in `Config > Economy` and nothing else — so this tab
reads and writes the file's own text. It changes the one line it means to and
leaves your comments, ordering and formatting alone, exactly as the Config tab
does.

| Field | Empty means |
| :-- | :-- |
| Shown as | The key is what players see. |
| Description | No line under the name. |
| Price | Cannot be emptied — an entry with no price is not one the shop can sell. `0` is free. |
| Category | **Left out of the shop.** The shop does not know what it is selling. |
| Rarity | **Left out of the shop.** It only sells items rated one of the five rarities. |
| Icon | No picture. |
| Listed only on the Featured page | Listed in All as well. It is always on sale either way. |
| Tool | Find the Tool by the display name instead. Only for `Items`. |

**"Not in the shop yet"** lists every Tool in `ServerStorage > TicketShopItems >
Tools` and every trail and aura in `ServerStorage > Cosmetics` that no entry
sells. One button adds the entry, priced at 10 tickets with a placeholder icon,
and you set the rest on the card. The button exists because composing the entry
by hand is the part people get wrong: a cosmetic is found by **key**, so
`cosmetics.Auras.Fallen` is sold by an item keyed `Fallen` and by nothing else.

A Tool's key is made from its name — `Gravity Coil` becomes `GravityCoil` — and
numbered past any key already taken, so two Tools whose names differ only by a
symbol are still two items. A trail or aura whose name is not a valid key, such
as `Rainbow Trail`, is listed with the reason instead of a button: its key has
to be its name, so rename the model first.

**"On sale and unbuyable"** is the failure worth catching here — an entry whose
Tool or cosmetic the place has not got. It is on sale, the player spends the
tickets, and the purchase is refused.

::: warning The key on the left is saved with every purchase
Nothing in this tab renames one, and there is no control that could. Renaming an
item key takes the item away from everybody who bought it. Take it out of the
shop instead: what players already own stays owned, and it simply stops selling.
**Take out of the shop** asks you to press it a second time before it edits the
file.
:::

## Config

The settings a fangame actually tunes, written straight back into `Shared >
Config` one line at a time. Your comments, ordering and formatting are left
alone — the window only ever changes the part after the `=`.

A setting appears here when its key occurs exactly once in its file, which is
what lets the window find the line without guessing. A per-tower `name`, a shop
item `price` and an Area `id` all repeat, so those stay in the file or in the
Selected tab, which edits one tower at a time.

A number setting only takes what the game can run with. An interval the server
divides by has to be at least 0.05 seconds, Elo growth cannot drop below 1 —
the server refuses to start below it — and the featured discount stops at the
90% the server caps it to anyway. The window refuses to write anything outside
those.

The window's own preferences — which Area this place is, and the size of a
checkpoint it adds — are the last section, because they are settings too and one
place to look beats two.

### Window preferences

The last section of the Config tab, **This window**, is how you like the window
to build things, rather than anything about the game. Those are saved against
the plugin, not the place, so they follow you between games and two people
working on the same place can each have their own.

### Which area this place is

The window needs to know which Ring it is looking at. Without it, "this tower is
missing" and "this tower lives in another place" are the same sentence, so it
stops comparing `Config > Towers` against `Workspace` and says so on the
Setup tab.

It works this out from the place's **Place ID**, matched against the Areas in
`Config > Worlds`.

Nothing is stored in the place: a place made with **Save As** inherits every
attribute of its original, so an answer kept there would leave Ring 2 insisting
it was Ring 1. The Place ID changes as soon as the copy is published.

When no Area has this Place ID — an unpublished place, or one whose ID is not in
`Config > Worlds` yet — pick the Area in **This window**. The answer is kept
against the plugin, keyed by Place ID, so every unpublished place shares one
answer. A Place ID that matches an Area always wins over it. Clear the picker to
go back to matching the Place ID.

### Checkpoint size

The size **Add checkpoint here** builds at, as an X, Y and Z box. **Checkpoint
size back to default** puts back what the window shipped with.

Size is the only property worth setting. Checkpoints live in
`ServerStorage > TowerCheckpoints` and stay there, so no player ever sees one —
and Studio only draws what is in Workspace, so you will not see one either.
Colour and material would be settings nobody could look at.

::: warning Checkpoints are not touch triggers
The server does not use a `Touched` event for them, the way it does for winpads.
It samples where each player is every `checkpointInterval` — 0.25s by default,
in `Config > Project` — and asks whether the straight line from the last sample
to this one passes through the next checkpoint part. So a player moving fast,
or falling, is still caught crossing one between samples, and a thin slab works
as well as a cube.

The line is only drawn along a path actually walked. After a respawn, a tower
reload, or a jump of more than 200 studs between samples — a teleport, in
other words — only the point where the player now stands is checked. Size
checkpoints to the path they guard: nobody should get past one without going
through it.

Missing a checkpoint does not fail quietly. When the player touches the winpad
the server treats the run as cheating and kicks them, with
"Completed the tower out of order" as the reason.
:::

## What it will not do

It writes one line at a time and never rewrites a file. `Config > Towers` is
yours, comments and ordering included.

See [What goes in code and what goes on the
tower](./tower-setup.md#what-goes-in-code-and-what-goes-on-the-tower).

It creates a folder the kit needs and never a menu. A missing `Towers` folder
has one right answer; a missing `ShopMenu` is a thing to design.

It does not decide between you and your config. Where a tower's attributes and
its catalogue entry disagree, it shows you both and neither wins, because the
attribute is what this place uses and the entry is what every other place uses.

## See Also

- [Tower Setup](./tower-setup.md)
- [Configuration Reference](./configuration.md)
