# Troubleshooting

Common problems, what causes them, and where to fix them. Open the **Output**
window in Studio first — the kit prints a warning naming the tower or setting
involved in most of these.

The server also checks itself once on startup and warns about everything
`Config` names that the place does not have — a shop item whose Tool is
missing, a cosmetic with no model, a completion tool folder matching no tower.
If the Output window is quiet on those, they are set up.

## Saved Data

### Progress does not save in Studio

Turn on **Game Settings → Security → Enable Studio Access to API Services**.
Without it Roblox blocks data stores entirely.

Then check `Config > Project`:

- `dataStoreStudioMode = "Mock"` fakes saving and forgets everything when you
  stop the test. That is the safe default, but it is not a real save.
- `"Live"` really writes to `dataStoreKeyStudio`.
- `"NoSave"` never saves.

### Progress does not save in the published game

`dataStoreKey` in `Config > Project` must be set, and the place must be
published. Data stores do not work in an unpublished place.

### Everyone lost their progress

A save key changed. `dataStoreKey` points at a whole storage bucket, so a new
key means a new, empty one. Change it back and the old saves are still there.

### The loading screen never goes away

The client waits for saved data before hiding it. If data never arrives, the
Output window shows why. The usual causes are Studio API access being off, or a
`Config > Project` save key that is empty.

The other cause is the menu. The client sets the menu up before it connects the
player's data, so if `MainMenu` is missing `ButtonsHolder`, `Main`,
`Main > ButtonsContainer` or `Main > MenusContainer`, setting it up errors and
the loading screen never lifts. The Output names the missing frame, and the
Setup tab of the [Tower Setup window](./tower-setup-plugin.md#menus) lists it
before you press Play.

## Towers

### "\<Tower\> has no checkpoints!"

The tower has no folder in `ServerStorage > TowerCheckpoints`, or that folder
has no parts in it. The [Tower Setup window](./tower-setup-plugin.md) creates
one for you.

This is worth fixing rather than silencing. Checkpoints are what proves a player
climbed the tower instead of flying to the top, so a tower without them accepts
any win at all. See
[Checkpoints Are The Anti-Cheat](./tower-setup.md#checkpoints-are-the-anti-cheat).

You can silence the warning with `checkpointsMissingWarning` in
`Config > Project` once you are done building.

### A player says their win was not counted

The server refuses a win for one of three reasons, all of them anti-cheat, and
kicks the player with the reason below:

- **"Completed the tower out of order"** — they reached the winpad without
  passing every checkpoint in sequence. Usually a checkpoint that is too small
  or too high to walk through, so a normal player can miss it. Make them wide
  and thin, spanning the whole path.
- **"Completed the tower too early"** — the run was faster than the tower's
  `MinimumTime`. If honest players hit this, the value is set too high.
- **"Touched the winpad of a tower you're not in"** — the winpad is in a
  different tower's folder from the one the player is playing. A winpad
  belongs to the tower it is parented under; move it, rather than looking
  for an attribute to correct.

All Jumps wins go through the same checks. A few runs are not counted without
anybody being kicked:

- **Practice mode** never completes a tower; touching the winpad does nothing.
- **A boost item** in a tower or rush that bans boosts: the winpad ignores the
  touch.
- **A winpad with its own `EndingID`** is a side ending. It announces the win
  and awards its badge, but only the tower's main ending records the tower as
  beaten. See [Winpads & Endings](./winpads-endings.md#custom-ending).

### A tower does not appear in the Completions menu

The chart is drawn from `Config > Towers` alone, so the tower needs an entry
there whose `area` is an Area `id` from `Config > Worlds`. An `Area` attribute
on the folder does not put it on the chart by itself; the
[Tower Setup window](./tower-setup-plugin.md#adding-a-tower-to-the-catalogue)
turns the tower's attributes into the entry and adds it. The model name in
`Workspace > Towers` must match that acronym exactly, including capitals.

### A tower shows the wrong difficulty

Check the tower folder for a `Difficulty` **child** — a `StringValue` or
`NumberValue` — left over from an older kit. A `NumberValue` child wins over
both the attribute and `Config > Towers`, and a `StringValue` holding a name
like `"Extreme"` wins over `Config > Towers` and resolves to that rating with no
decimal, so `9.26` becomes a Baseline `9.00`. Delete it or replace it with the
number. Tower Setup flags it on the tower's card.

### A portal to a tower does nothing

Look for **`Skipping <Tower>`** in the Output. A tower with no spawn, or whose
checkpoints are not numbered `1`, `2`, `3` with no gaps and nothing else in the
folder, is left out at startup and the rest of the game carries on. The line
says which one is wrong.

A tower portal also does nothing while the player is inside a different tower,
or partway through a tower rush.

### The timer does not show in a tower

Check the player's **Hide Timer** setting first. Otherwise `TowerGUI` is
missing its `Timer` label: the client looks for it by name anywhere inside
`TowerGUI` and carries on without it. The Setup tab of the Tower Setup window
lists it.

### Beating the tower does nothing

The winpad must be a `BasePart` named exactly `WinPad`. The name is case
sensitive, so `Winpad` or `winpad` looks right in Explorer and never
registers. The Tower Setup window finds this one and renames it in a click.

If the winpad is named correctly, the run is being refused or ignored. See
[A player says their win was not counted](#a-player-says-their-win-was-not-counted).

### Wins are rejected as too fast while testing

Lower the tower's `MinimumTime`, or set it to `0` until you are done. Put it
back before you release: it is what stops a run that is too fast to be real.

## Tickets And The Shop

### Beating a tower awards no tickets

Tickets are only awarded when all of these are true:

- tickets are switched on (`enabled.tickets` in `Config > Economy`);
- the run was in Normal mode, not Practice or All Jumps;
- the player reached the tower's main winpad, not a side ending;
- no boost item was used;
- the difficulty has a reward above `0` in `Config > Economy`; and
- the tower is off cooldown, unless `allowRebeats` is set for it.

### A shop item does not grant its tool

`template` on the item — or its `name`, when it has no `template` — must name a
Tool inside `ServerStorage > TicketShopItems > Tools`. The startup report names
the item and the tool it could not find, so you do not have to buy it to notice.

### A shop item cannot be bought and says the cosmetic is missing

A `Trails` or `Auras` item is matched to its cosmetic by its **key**, not by its
`name`. `Fallen` in `shop > items` sells `cosmetics > Auras > Fallen`, and the
two spellings have to agree exactly. The startup report names both.

### A cosmetic unlocks but nothing appears on the player

Every cosmetic needs a model named after it in
`ServerStorage > Cosmetics > Trails` or `> Auras`, or after its `template` when
it has one. The startup report names the cosmetic and the model it wanted.

### Beating a tower awards no completion tool

The folder under `ServerStorage > CompletionTools` must be named exactly like
the tower's acronym, and hold at least one `Tool`. A tower with no folder is
normal and says nothing — most towers award nothing — but a folder matching no
tower is reported at startup, because that is always a typo.

### An item never appears in the shop

`featuredOnly = true` means it only shows while it is featured. Featured items
rotate on `featured.refreshMinutes` and are picked from
`featured.categories`.

An item is also left out when its `category` is not `Items`, `Trails` or
`Auras`, when its `rarity` is not one of the five the kit has, or when its
cosmetic category is switched off. The startup report names the first two.

## Game Passes

### Owning the pass does nothing

Check that `id` in `Config > GamePasses` is the **pass** ID, not the place or
model ID, and that `disabled` is not set.

Ownership is checked when a player joins and when they buy in-game. Rejoin
after granting yourself a pass, or run `gamepass-refresh` in the admin console.

## Teleports And Personal Servers

### Teleporting does nothing in Studio

Roblox does not run teleports or reserved servers in a Studio playtest. Publish
every place and test in the Roblox app.

### An Area is missing from the Teleport menu

An Area is hidden when its `placeId` is `0` or `disabled` is set. A whole World
is hidden when it has `disabled` set, or when none of its Areas have a usable
Place ID.

### An Area is locked when it should not be

`requirements` in `Config > Worlds` counts towers from `Config > Towers`. Each
tower's `area` must be an Area `id` from `Config > Worlds`, or the kit cannot
tell which World the tower belongs to. `scope = "All"` counts every tower
instead.

### Personal server codes do not work

Codes live in a MemoryStore shared by every place in your experience. All the
places must be in the same experience, and all of them must be published with
the kit.

## Settings

### A setting I added does not appear

A setting you declared in `Config > CustomSettings` builds its row from the
templates under `SettingsMenu > CustomTemplates`. The Output names the setting
and what was missing. [Adding A Saved Setting](./custom-settings.md#if-it-does-not-work)
has the full table of symptoms.

## Admin Console

### F4 does nothing

Check `Config > Admin`: `enabled` must be `true`, and your Roblox user ID must
be in `userIds`. The experience owner is always allowed. In Studio,
`allowStudio` grants access to every tester.

### A command exists but does nothing

Commands are two ModuleScripts side by side in
`ServerScriptService > Server > Commands > Catalog`: the definition, and a
`<Name>Server` that does the work. If the server module is missing, the console
autocompletes the command but nothing happens, and the Output window says so.

## Still Stuck

Check the Output window while reproducing the problem. Nearly every failure in
the kit prints a line naming the tower, item, or setting involved. If you are
extending the kit, [Extending the Kit](./extending-gameplay.md) covers the
supported places to hook in.
