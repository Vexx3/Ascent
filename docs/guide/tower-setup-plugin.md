# The Tower Setup Plugin

Tower Setup adds an **Ascent** toolbar to Studio. Each button does one job, and the one-click tools act on whatever you have selected, with no window to open. It only shows the buttons the open place can use: tower tools in a tower place, camera tools in the hub.

## Installing it

It's a Studio plugin, not part of the place. Get it from the [Creator Store](https://create.roblox.com/store/asset/133971753175712/Ascent-Setup), or by hand from `Tower Setup.rbxm`:

1. In Studio, **Plugins** tab → **Plugins Folder**.
2. Copy `Tower Setup.rbxm` into it.
3. Restart Studio.

Use the plugin that came with your version of the kit; **Check** says if they don't match.

## The toolbar

| Button | Where | Does |
| :-- | :-- | :-- |
| **Towers** | Tower places | Opens the Towers window: every tower, or the one you have selected. |
| **Add Checkpoint** | Tower places | Adds the selected tower's next checkpoint where you're looking. |
| **Checkpoints** | Tower places | Shows the selected tower's checkpoints in Workspace, or puts them back. Lit while they're out. |
| **Test Tower** | Tower places | Playtests straight into the selected tower. |
| **Cameras** | Hub | Shows which way each ring camera points. |
| **Look Through** | Hub | Shows the selected ring camera's shot. Press again for the next Area's. |
| **Aim Here** | Hub | Moves the selected ring camera to where you're looking from. |
| **Check** | Both | Opens the Check window: is this place ready to publish? |
| **Config** | Both | Lists every Config module. Pick one to open it. |

**Add Checkpoint**, **Checkpoints**, **Test Tower**, **Look Through** and **Aim Here** can each be bound to a key in Studio's **Customize Shortcuts** window: search for *Ascent*.

Everything the plugin changes in the place can be undone with Ctrl+Z. If a button can't act, for example with nothing selected, the Output says why.

## Test Tower

Select a tower and press **Test Tower**. A playtest starts and puts you straight into that tower with a fresh timer, with no walk to its portal.

Select a part inside the tower instead, such as a checkpoint, and you start on top of that part, which saves climbing a long tower to test its top. That run counts like one with a Studio test tool: the win checks are skipped and it earns nothing.

## The Towers window

With nothing selected, it lists every tower, worst first. It catches a missing spawn or winpad, a misspelled `WinPad`, gaps or repeats in checkpoint numbers, checkpoints in the wrong place, a missing minimum time or difficulty, signs pointing at nothing, and towers missing from `Config > Towers`.

Fixes: **Add Spawn**, **Add WinPad**, **Rename to WinPad**, **Create folder**, **Move to ServerStorage**, **Put back** and **Renumber by height** (numbers checkpoints from lowest to highest). **Open** selects the tower. **New tower here** makes a tower folder called `NEW` with a spawn, winpad and client objects folder where you're looking; rename it to its acronym before anyone beats it.

Select a tower, or anything in it, and the window becomes that tower's editor:

- **The top card**: what's wrong with it, and **Test tower**, **Select tower**, and **All towers** to go back to the list.
- **Structure**: what it has and is missing. **Add checkpoint here** (the same as the toolbar button), **Renumber by height**, **Select checkpoints**, **Show in Workspace** / **Put back**, **Add ClientSidedObjects**, and the **Checkpoint size** new checkpoints are built at.
- **How it plays**: minimum time, All Jumps badge, ticket multiplier, **Pay tickets on rebeats**, and **Ban boost items**.
- **What this tower is**: name, difficulty, area, badge and type.
- **Signs** and **Endings**, below.
- **In Config > Towers**: the tower's entry, and anything it disagrees with the tower about.

### Seeing checkpoints while you build

Checkpoints live in `ServerStorage > TowerCheckpoints`, where you can't see them. The **Checkpoints** button (or **Show in Workspace**) moves a tower's checkpoints into it so you can place them; press it again, or **Put back**, to return them.

::: danger Put them back before you publish
While shown, the tower loads with **no checkpoints**, so anyone can win it, and players can see the route. The Check window shows a **Put all back** button whenever any tower is shown.
:::

### Checkpoint size

The size **Add Checkpoint** builds at, kept with the plugin rather than the place. Checkpoints aren't touch triggers: the server checks whether a player's path passed through one, so size them to cover the whole route. A player who skips one is kicked on reaching the winpad.

### Checkpoints in the wrong place

- **Checkpoints are in Workspace**: a checkpoint folder in the tower and none in `ServerStorage`. The tower loads with none. **Move to ServerStorage** fixes it.
- **Two sets of checkpoints**: one in each. The game uses `ServerStorage`'s; delete the other.

### Adding a tower to the catalogue

A tower needs an entry in `Config > Towers` for other places to know it. When it has none, the editor shows the line it would add:

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

## The Check window

In a tower place:

- **This place**: which Area this is, whether `Config` is a package, and whether the plugin matches the kit's version.
- **Menus**: every frame and button the kit looks for in `StarterGui`, and what breaks without it. Nothing here is fixed for you, since menus are yours to design.
- **Folders and services**: the folders, markers, teams and chat channels the kit needs, a `Config` package that is out of date, rushes naming unknown towers, and similar place-wide problems. Missing folders and teams have a fix button. Markers don't, since only you know where they go.
- **Rewards**: every shop item, cosmetic, game pass and completion tool whose Tool or model is missing from `ServerStorage`. The same checks print to the Output when the game starts.

**Check the towers** opens the Towers window.

### Which Area this place is

The plugin matches the place's Place ID against `Config > Worlds` to know which Area it is. For an unpublished place, pick the Area under **This place**. A new tower takes it as its Area.

### In the hub

The Check window checks what the ring select needs instead:

- `StarterGui > RingSelect`, the screen itself.
- A camera part for every Area in `Config > Worlds`, anchored so it doesn't fall when the hub starts. **Anchor it** fixes one that isn't.
- Folders in `Workspace > Rings` named after no Area, which the ring select never shows.
- Ring lighting attributes that aren't a Lighting property taking that kind of value.
- `hubPlaceId` in `Config > Worlds`: set, and this place's.

## Hub cameras

Every ring camera shows an arrow, the edges of its shot and its Area's id, in edit mode only. **Cameras** turns them off and on. **Look Through** puts Studio's camera where the selected camera is; with none selected it starts at the first, and pressing it again steps through every Area's shot. Fly until the shot is right, then **Aim Here** moves the camera to your view. See [Aiming a camera](./ring-select.md#aiming-a-camera).

## Config

**Config** lists every module in `Shared > Config`. Pick one to open it in the script editor, or **Select the Config folder** to find it in the Explorer. Each setting has a comment saying what it does; see the [Configuration Reference](./configuration.md).
