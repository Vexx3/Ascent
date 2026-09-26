# The Tower Setup Window

Tower Setup is a Studio window that checks your towers, menus and Config against what the kit expects, explains anything wrong, and fixes most of it in one click.

## Installing it

It's a Studio plugin, not part of the place. Get it from the [Creator Store](https://create.roblox.com/store/asset/133971753175712/Ascent-Setup), or by hand from `Tower Setup.rbxm`:

1. In Studio, **Plugins** tab → **Plugins Folder**.
2. Copy `Tower Setup.rbxm` into it.
3. Restart Studio.

Open it from the **Ascent** toolbar → **Tower Setup**. Use the plugin that came with your version of the kit; the Setup tab says if they don't match.

## The six tabs

| Tab | For |
| :-- | :-- |
| **Setup** | Is the place wired up: menus, folders, rewards. |
| **Towers** | Every tower, worst first, with what's wrong. |
| **Selected** | The tower you have selected: fix and edit it. |
| **Cosmetics** | Your trails and auras, and how each is unlocked. |
| **Shop** | What the ticket shop sells. |
| **Config** | The settings you tune most, and the window's own preferences. |

Each card that needs attention is outlined and says how many errors or warnings it has. Changes to the place can be undone with Ctrl+Z. Changes to Config are edits to one line of a script, so the window tells you what it wrote.

## Setup

- **Menus**: every frame and button the kit looks for in `StarterGui`, and what breaks without it. Nothing here is fixed for you, since menus are yours to design.
- **Folders and services**: the folders, markers, teams and chat channels the kit needs, a `Config` package that is out of date, rushes naming unknown towers, and similar place-wide problems. Missing folders and teams have a fix button. Markers don't, since only you know where they go.
- **Rewards**: every shop item, cosmetic, game pass and completion tool whose Tool or model is missing from `ServerStorage`. The same checks print to the Output when the game starts.

## Towers

Every tower, worst first. It catches a missing spawn or winpad, a misspelled `WinPad`, gaps or repeats in checkpoint numbers, checkpoints in the wrong place, a missing minimum time or difficulty, signs pointing at nothing, and towers missing from `Config > Towers`.

Fixes: **Add Spawn**, **Add WinPad**, **Rename to WinPad**, **Create folder**, **Move to ServerStorage**, **Put back** and **Renumber by height** (numbers checkpoints from lowest to highest). **Open** takes you to the tower on the Selected tab.

## Selected

Select a tower, or anything in it:

- **Structure**: what it has and is missing. **Add checkpoint here** drops a checkpoint in front of the camera, numbered next. Also **Renumber by height**, **Select checkpoints**, **Show in Workspace** / **Put back**, and **Add ClientSidedObjects**.
- **How it plays**: minimum time, All Jumps badge, ticket multiplier, **Pay tickets on rebeats**, and **Ban boost items**.
- **What this tower is**: name, difficulty, area, badge and type.
- **Signs** and **Endings**, below.
- **In Config > Towers**: the tower's entry, and anything it disagrees with the tower about.

With nothing selected, **New tower here** makes a tower folder called `NEW` with a spawn, winpad and client objects folder. Rename it to its acronym before anyone beats it.

### Seeing checkpoints while you build

Checkpoints live in `ServerStorage > TowerCheckpoints`, where you can't see them. **Show in Workspace** moves a tower's checkpoints into it so you can place them; **Put back** returns them.

::: danger Put them back before you publish
While shown, the tower loads with **no checkpoints**, so anyone can win it, and players can see the route. The Setup tab shows a **Put all back** button whenever any tower is shown.
:::

### Checkpoints in the wrong place

- **Checkpoints are in Workspace**: a checkpoint folder in the tower and none in `ServerStorage`. The tower loads with none. **Move to ServerStorage** fixes it.
- **Two sets of checkpoints**: one in each. The game uses `ServerStorage`'s; delete the other.

### Adding a tower to the catalogue

A tower needs an entry in `Config > Towers` for other places to know it. When it has none, the tab shows the line it would add:

```luau
ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
```

**Add to catalogue** adds it and leaves the rest of the file alone. It appears once the tower has a difficulty and an area.

::: warning Using Rojo?
Copy the line into your own file instead; Rojo overwrites edits made in Studio.
:::

### Signs

A tower can turn its portal sign and its line on a lobby chart green when beaten (yellow in All Jumps). Each is an `ObjectValue` in the tower, `PortalSign` or `ChartLine`, pointing at the part. **Set portal sign to selection** and **Set chart line to selection** point it at the last part you selected. For a chart line, select the tower first, then Ctrl-click the line. Colours are `Config > Visuals.towerSigns`.

### Endings

Every winpad gets a card. The winpad whose ending ID is empty is the **main ending**: the only one that counts as beating the tower. See [Winpads & Endings](./winpads-endings.md).

| Field | Empty means |
| :-- | :-- |
| Ending ID | The main ending. |
| Ending name | The tower's name. |
| Difficulty | The tower's difficulty. |
| Badge ID | No badge. |
| Winroom marker | `WinroomSpawn`. |

**Do not award the tower's badge** stops this ending also giving the tower's badge. **Add another ending** copies the winpad as a side ending; **Remove ending** deletes it.

## Cosmetics

Every trail and aura in `ServerStorage > Cosmetics`, with its name, rarity, locked hint and unlock rules. **Any one** unlock rule unlocks it; with none, it only comes from the shop or a pass. A model with no rarity isn't a cosmetic yet, and the tab says so. See [Cosmetics](./cosmetics.md).

The model's name is saved with everyone who owns it, so don't rename it after release.

## Shop

Everything the ticket shop sells, one card each, editing `Config > Economy` one line at a time. **Not in the shop yet** lists Tools and cosmetics nothing sells, with a button to add each at 10 tickets. **On sale and unbuyable** lists items whose Tool or cosmetic is missing. See [Tickets & Shop](./ticket-shop.md).

**Take out of the shop** asks twice. Players keep what they bought.

## Config

The settings you tune most, written straight into `Shared > Config`, one value at a time. Comments and formatting are left alone. Values the game can't run with are refused.

### Which area this place is

The window matches the place's Place ID against `Config > Worlds` to know which Area it is. For an unpublished place, pick the Area under **This window** at the bottom of the tab.

### Checkpoint size

The size **Add checkpoint here** builds at. Checkpoints aren't touch triggers: the server checks whether a player's path passed through one, so size them to cover the whole route. A player who skips one is kicked on reaching the winpad.
