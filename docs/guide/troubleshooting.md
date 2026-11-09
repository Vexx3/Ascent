# Troubleshooting

Start with the **Output** window (**View > Output** in Studio). The kit names the
tower, item or setting behind almost every problem, and when a server starts it
lists anything in Config that the place is missing.

In the published game, press `F9` to open the Developer Console. When something
fails during play, such as a save, a teleport or a purchase, it names the player
and the reason. Click the line to see more, including the player's user ID.

## Asking for help

1. In Studio, press **Play** and do whatever goes wrong. Then stop the playtest.
2. Open the [Ascent Setup plugin](./tower-setup-plugin.md)'s **Check** window and
   press **Print a report for support**.
3. In the Output, copy everything from `Ascent report` to `end of the Ascent
   report`.
4. Send it with a sentence on what you expected and what happened instead.

The report says which version you run, any kit scripts you've edited, what the
plugin found, and the errors from that playtest. If it lists edited scripts, say
what you changed, or move it into your own script with
[Hooking Into the Kit](./hooks.md) first.

## Setup

### The Output says "Ascent Config: ... need a look"

The server found mistakes in Config when it started. Each line underneath says
what to fix. None of them stop the game from running.

### The loading screen never goes away

The Output says why. It's usually one of these:

- Studio API access is off. Turn on **Game Settings > Security > Enable Studio
  Access to API Services**.
- `StarterGui > HUD` is missing `ButtonsHolder`.
- `StarterGui > MainMenu` is missing `Main`, `Main > ButtonsContainer` or
  `Main > MenusContainer`.

The [Ascent Setup plugin](./tower-setup-plugin.md#the-check-window)'s Check window
lists every missing menu part.

## Saved data

### Progress doesn't save in Studio

1. Turn on **Game Settings > Security > Enable Studio Access to API Services**.
2. Check `dataStoreStudioMode` in `Config > Project`. The default, `"Mock"`,
   forgets everything when you stop, on purpose. Set it to `"Live"` to really save.

### Progress doesn't save in the published game

Check that the place is published and `dataStoreKey` in `Config > Project` is
set. Then open the Developer Console (`F9`) and look for a save warning.

### Everyone lost their progress

A save key was changed, so the game is reading a new, empty save. Change the key
back and the old saves are still there.

## Towers

### "\<Tower\> has no checkpoints"

The tower has no folder in `ServerStorage > TowerCheckpoints`, or its folder is
empty. Fix it rather than turning the warning off: without checkpoints, anyone
can win the tower. See
[Checkpoints are the anti-cheat](./tower-setup.md#checkpoints-are-the-anti-cheat).

### A player says their win didn't count

If the player was kicked, the kick message says why:

| Kick message | What happened | Fix |
| :-- | :-- | :-- |
| "Completed the tower out of order" | They missed a checkpoint. | Make the checkpoint wide and thin, across the whole path. If it happens to everyone, a checkpoint may be far from the tower. The Output and the plugin's Towers window name it. |
| "Completed the tower too early" | They were faster than the tower's [minimum time](./tower-setup.md#minimum-time). | If honest players hit it, lower the minimum time. |
| "Touched the winpad of a tower you're not in" | The winpad is inside another tower's folder. | Move the winpad into the right tower. |

Some wins don't count, but don't kick either:

- **Practice mode** never wins a tower.
- **A boost item** was used in a tower or rush that bans them.
- **A side ending** (a winpad with its own `EndingID`) is announced but doesn't
  count as beating the tower. See [Winpads & Endings](./winpads-endings.md).

### A tower isn't in the Completions menu

It needs an entry in `Config > Towers` with an `area`, and its name in
`Workspace > Towers` must match the acronym exactly. The
[Ascent Setup plugin](./tower-setup-plugin.md#making-a-tower) can
add the entry.

### A tower shows the wrong difficulty

Look inside the tower for a `Difficulty` StringValue or NumberValue left over from
an older kit. It overrides Config. Delete it.

### A portal doesn't do anything

Look for **`Skipping <Tower>`** in the Output. It means the tower has no spawn, or
its checkpoints aren't numbered `1`, `2`, `3` without gaps.

A portal also does nothing while the player is in a different tower or a rush.

### The timer doesn't show

Check the player's **Hide Timer** setting, then check that `TowerGUI` has a
`Timer` label.

### Touching the winpad does nothing

The winpad must be a part named exactly `WinPad`, with a capital P. `Winpad`
doesn't work. The Ascent Setup plugin can rename it for you.

### Wins are refused as too fast while testing

Set the tower's [minimum time](./tower-setup.md#minimum-time) to `0` while you
test, and put it back before release.

## Tickets and the shop

### Beating a tower gives no tickets

A win only pays tickets if it's in Normal mode, on the tower's main winpad, with
no boost used, the tower's difficulty has a reward, and the player hasn't been
paid for that tower recently. See
[When a win pays](./ticket-shop.md#when-a-win-pays).

### A shop item doesn't give its tool

Its `template` (or `name`, if there's no `template`) must match a Tool in
`ServerStorage > TicketShopItems > Tools` exactly.

### A shop item says the cosmetic is missing

A trail or aura in the shop is matched to its cosmetic by **ID**. A shop item
called `Fallen` unlocks the cosmetic called `Fallen`.

### A cosmetic unlocks but nothing shows on the player

There must be a model with the same name in `ServerStorage > Cosmetics > Trails`
or `ServerStorage > Cosmetics > Auras`.

### Beating a tower gives no completion tool

The folder in `ServerStorage > CompletionTools` must be named exactly like the
tower's acronym and hold a Tool.

### An item never shows up in the shop

Items with `featuredOnly` only appear on the Featured page. An item with a
misspelled `category` or `rarity`, or one whose cosmetic kind is turned off, is
left out, and the Output names it.

## Game passes

### Owning the pass does nothing

Check that `id` is the **game pass** ID (not a badge or product ID) and that
`disabled` isn't set. Then rejoin, or run the `gamepass-refresh` command.

## Teleports and personal servers

### Teleporting does nothing while testing

A teleport needs the place it goes to published in the same experience, and
personal servers only work in the published game. Test them there.

### An Area is missing from the Teleport menu

Its `placeId` is `0`, or it has `disabled = true`.

### An Area is locked when it shouldn't be

Check that each tower's `area` in `Config > Towers` is a real Area `id`. A tower
with a wrong `area` counts for no World.

A World with no towers of its own needs `scope = "All"` in its requirements. See
[Access requirements](./worlds-personal-servers.md#access-requirements).

### A player was sent back to the hub as they arrived

They reached a locked Area without using the menu, usually by joining a friend.
The Output says who and why.

### A player saw "The shop just rotated and that price changed"

The featured items changed while they were buying. Buying again at the new price
works.

### Personal server codes don't work

Every place must be published, and in the same experience.

## Settings

### A setting I added doesn't show up

See [If it doesn't work](./custom-settings.md#if-it-does-not-work). The Output
names what's missing.

## Admin console

### F4 doesn't open the console

In `Config > Admin`, `enabled` must be `true` and your user ID must be in a
role's `userIds`. The experience's owner can always open it.

### A command exists but does nothing

Its `<Name>Server` module is missing from
`ServerScriptService > Server > Commands > Catalog`. The Output says which one.
