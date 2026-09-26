# Troubleshooting

Check the **Output** window first. The kit names the tower, item or setting behind nearly every problem, and when a server starts it lists anything in `Config` that the place is missing.

## Saved Data

### Progress does not save in Studio

Turn on **Game Settings → Security → Enable Studio Access to API Services**. Then check `dataStoreStudioMode` in `Config > Project`: `Mock` (the default) forgets everything when you stop, `Live` really saves, `NoSave` never saves.

### Progress does not save in the published game

The place must be published, and `dataStoreKey` in `Config > Project` set.

### Everyone lost their progress

A save key changed, which points at a new, empty save. Change it back and the old saves are still there.

### The loading screen never goes away

The Output says why. Usually Studio API access is off, or `MainMenu` is missing `ButtonsHolder`, `Main`, `Main > ButtonsContainer` or `Main > MenusContainer`. The [Tower Setup window](./tower-setup-plugin.md#setup)'s Setup tab lists missing menu parts.

## Towers

### "\<Tower\> has no checkpoints"

It has no folder in `ServerStorage > TowerCheckpoints`, or the folder is empty. Fix it rather than silencing it: without checkpoints anyone can win the tower. See [Checkpoints Are The Anti-Cheat](./tower-setup.md#checkpoints-are-the-anti-cheat).

### A player says their win was not counted

The server kicks a player for one of three reasons:

- **"Completed the tower out of order"**: they missed a checkpoint. Usually a checkpoint too small to walk through; make it wide and thin across the whole path.
- **"Completed the tower too early"**: faster than `MinimumTime`. If honest players hit it, lower it.
- **"Touched the winpad of a tower you're not in"**: the winpad is in another tower's folder.

Some wins don't count without a kick:

- **Practice mode** never completes a tower.
- **A boost item** in a tower or rush that bans them.
- **A side ending** (a winpad with its own `EndingID`) announces the win but doesn't count as beating the tower. See [Winpads & Endings](./winpads-endings.md).

### A tower does not appear in the Completions menu

It needs an entry in `Config > Towers` with an `area`, and its model name must match the acronym exactly. [Tower Setup](./tower-setup-plugin.md#adding-a-tower-to-the-catalogue) adds the entry.

### A tower shows the wrong difficulty

Look for a `Difficulty` StringValue or NumberValue inside the tower folder, left from an older kit. It overrides Config. Delete it.

### A portal to a tower does nothing

Look for **`Skipping <Tower>`** in the Output: the tower has no spawn, or its checkpoints aren't numbered `1`, `2`, `3` without gaps. A portal also does nothing while the player is in another tower or a rush.

### The timer does not show

Check the player's **Hide Timer** setting, then that `TowerGUI` has a `Timer` label.

### Beating the tower does nothing

The winpad must be a `BasePart` named exactly `WinPad`. `Winpad` doesn't work. Tower Setup renames it for you.

### Wins are rejected as too fast while testing

Set the tower's `MinimumTime` to `0` while testing, and put it back before release.

## Tickets And The Shop

### Beating a tower awards no tickets

A win pays only in Normal mode, on the main winpad, with no boost used, when the difficulty has a reward, and when the tower is off cooldown. See [Tickets & Shop](./ticket-shop.md#when-a-win-pays).

### A shop item does not grant its tool

Its `template` (or `name`) must match a Tool in `ServerStorage > TicketShopItems > Tools`.

### A shop item says the cosmetic is missing

A Trail or Aura item is matched to its cosmetic by **key**: shop item `Fallen` sells `cosmetics.Auras.Fallen`.

### A cosmetic unlocks but nothing appears

It needs a model with its name in `ServerStorage > Cosmetics > Trails` or `> Auras`.

### Beating a tower awards no completion tool

The folder in `ServerStorage > CompletionTools` must be named exactly like the acronym and hold a `Tool`.

### An item never appears in the shop

`featuredOnly` items only show on the Featured page. An item with a misspelled `category` or `rarity`, or whose cosmetic kind is turned off, is left out, and the Output names it.

## Game Passes

### Owning the pass does nothing

Check that `id` is the **pass** ID and `disabled` isn't set. Rejoin after buying, or run `gamepass-refresh`.

## Teleports And Personal Servers

### Teleporting does nothing in Studio

Teleports and personal servers don't work in Studio. Test in the published game.

### An Area is missing from the Teleport menu

Its `placeId` is `0` or it's `disabled`.

### An Area is locked when it should not be

Each tower's `area` in `Config > Towers` must be an Area `id`, or it counts for no World. A World with no towers of its own needs `scope = "All"`.

### A player was sent back to the hub on arrival

They reached a locked Area without the menu, usually by following a friend. The Output says who and why.

### "The shop just rotated and that price changed"

The featured row changed as they bought. Buying again at the new price works.

### Personal server codes do not work

Every place must be in the same experience and published.

## Settings

### A setting I added does not appear

See [Adding A Saved Setting](./custom-settings.md#if-it-does-not-work). The Output names what's missing.

## Admin Console

### F4 does nothing

In `Config > Admin`, `enabled` must be `true` and your user ID in `userIds`. The experience's owner is always allowed.

### "Ascent Config: ... need a look"

The server found mistakes in Config. Each line names what to fix. None stop the game.

### A command exists but does nothing

Its `<Name>Server` module is missing from `ServerScriptService > Server > Commands > Catalog`. The Output says so.
