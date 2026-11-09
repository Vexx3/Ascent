# Updating Ascent

Updating swaps the kit's code for the new version's and keeps everything that's
yours: your Config, towers, menus and assets. Player saves aren't touched.

The kit's code comes as Roblox packages, so most updates reach you by themselves.

## Before you start

1. Press **Play** and find the line in the Output that says which version you're
   on, such as `Ascent 1.2.0 (stable)`. Older versions don't print it, so run
   `kit-info` in the admin console (`F4`) instead.
2. Read the [steps for each release](#steps-for-each-release) between your
   version and the new one. Some releases need a few changes by hand.
3. Back up every place with **File > Save to File As**.

## Update the code

The code is five packages in a tower place: `Server` and `ServerPackages` in
`ServerScriptService`, `Client` in `StarterPlayer > StarterPlayerScripts`, and
`Shared` and `Packages` in `ReplicatedStorage`. The hub has the same, without
`ServerPackages`.

- **Most updates arrive by themselves.** With **AutoUpdate** on for each
  package's `PackageLink`, the new version comes in the next time you open the
  place in Studio. Publish the place afterwards.
- **A release marked Breaking comes as new packages**, so it doesn't arrive by
  itself. Delete the old code packages, then
  [install the code](./getting-started.md#install-the-code) again from the new
  ones.

::: danger Updating from 1.2.0 or older?
Your code isn't a package yet, and your `Config` is still inside `Shared`. Before
you delete `Shared`, drag your `Config` out of it and drop it straight into
`ReplicatedStorage`. Then delete the five code folders and
[install the code](./getting-started.md#install-the-code). This works the same way
when `Config` is a [package](./configuration.md#sharing-config-between-your-places).
:::

## Update the tower framework

Some releases also change the tower framework. When a release's steps say so:

1. In the Ascent Discord, run `/retrieve` and pick **Ascent** to get the new
   `Ascent Area.rbxlx`.
2. Open it in a second Studio window, next to your place.
3. **Replace** each of these with the new file's copy. Delete yours, then copy the
   new one into the same spot:

| Replace | What it is |
| :-- | :-- |
| `ReplicatedStorage > Framework`, `AscentInputs`, `ChangeLighting`, `DamageEvent` and `ResetEffectGui` | The tower framework |

**Keep** everything else, including:

| Keep | What's in it |
| :-- | :-- |
| `ReplicatedStorage > Config` | Your settings |
| `Workspace` | Your towers, portals, markers and lobby |
| `StarterGui` | Your menus |
| `ServerStorage` | Your checkpoints, tools, cosmetics and client objects |
| `Teams` | Your teams |
| `ServerScriptService > CustomCommands`, and your own scripts | [Your code](./hooks.md) |

## Update the plugin

In Studio, open **Plugins > Manage Plugins**. If the Ascent Setup plugin shows
**Update**, press it. Turn on its auto-update to skip this next time.

## Check it worked

1. Press **Play** and read the Output. Its `Ascent` line should show the new
   version. If anything is left to fix, it's listed under **Ascent Config** or
   **Ascent setup**.
2. Publish every place.

::: warning Your edits to the kit's scripts are replaced
Anything you changed inside `Server`, `Client` or `Shared` is overwritten by an
update, and a package you've edited stops updating by itself. Move those changes
into your own scripts using [Hooking Into the Kit](./hooks.md).
:::

## Steps for each release

Do the steps for every release newer than yours, oldest first.

### Next release (from 1.2.0)

**Required.** Skip one of these and something will break:

1. **Before you replace `Shared`**, drag `ReplicatedStorage > Shared > Config`
   out into `ReplicatedStorage`, in every place and the hub, so it sits at
   `ReplicatedStorage > Config`.
2. Replace `StarterGui > MainMenu` and `StarterGui > TowerGUI`, and copy in
   `StarterGui > HUD` and `ReplicatedStorage > Design` from the new place. The old
   screens don't work with this version, so move any buttons or rows you added
   across to the new ones first.
3. In the hub, replace `StarterGui > RingSelect` and copy in
   `ReplicatedStorage > Design` from the new hub place.
4. Copy `Config > Modifiers` and `Config > Credits` in from the new place. The game
   won't start without them.
5. Replace `Config > Messages` with the new one, then copy your own wording back
   in. If you'd rather keep yours, set `locked = ""` in its `teleportMenu` group,
   and copy in each group the Output says is missing.
6. Delete these from `Config > Visuals`: `menu`, `shopBuyButton`,
   `layoutEditor.panel`, `layoutEditor.text` and `timing.settingsToggle`. Delete
   `selectedTransparency`, `unselectedTransparency` and `unavailableDarken` from
   `Config > RingSelect`.
7. Rename the tools in `ServerStorage > PracticeTools` to `Noclip`, `Heal` and
   `Godmode`.
8. Replace `ServerScriptService > MainModule > MusicSystemManager` with the new
   one, so spectators hear the music of the player they're watching.
9. If you turned quick restart off by setting `quickResetDelay` higher than
   `maximumQuickResetDelay`, set `restartMode = "Off"` in `Config > Settings`
   instead.
10. Set `configVersion = 2` in `Config > Project`.

**Optional.** Add these for the new features you want. Anything you don't add
stays off or uses its default.

| Feature | What to add |
| :-- | :-- |
| Saved runs | Copy `savedRuns` into `Config > Project`. If a slot uses the `SaveSlots` pass, add that pass to `Config > GamePasses`. |
| Far messages | Copy `farMessages` into `Config > Chat`. To post them to Discord, add a `FAR_WEBHOOK` secret and set `discord = true`. |
| Lag free or free personal servers | Set `lagFree = true` or `free = true` in `personalServers` in `Config > Worlds`. |
| Bigger UI on big screens | Set `screenScaling = true` in `Config > Visuals`. |
| Modifiers in win messages | Add `modifiersMessage` to `Config > Chat.messages` and `Config > Chat.webhooks`. |
| New keys | Add to `Config > Settings.keybinds`: `menu`, `spectate`, `checkpoints`, `resetObjects`, `spectatePrevious`, `spectateNext`, and the `...Controller` keys. |
| New settings' defaults | Add to `Config > Settings`: `restartMode`, `keyOverlay`, `reduceMotion`, `uiScale`, `confirmActions`, `checkpointBoosts`, `checkpointObjects`, `showSpectatorCount`, `winMessages`, `legitWinMessagesOnly`, `disableProgress`, `pingDisplay`, `statsLabels`, `autoSaveRuns` and `autoSaveSlot`. |
| New timings | Add `doubleTapRestartWindow` to `Config > Project.timings`, and `fpsCapNotice` to `Config > Visuals.timing`. |

### 1.2.0 (from 1.1.1)

1. Copy `SoundService > Menu` into every place, including the hub. Then delete
   `menuSounds` from `Config > Visuals`, and delete `StarterGui > MainMenu > DeathSound`.
   Without `SoundService > Menu`, the menus make no sound.
2. Optional: mark event places and towers with `extended = true` in
   `Config > Worlds` or `Config > Towers`, for Extended Completions.

### 1.1.1 (from 1.1.0)

Update the hub's `Shared` and `StarterPlayerScripts > Client`. Nothing else
changes.

### 1.1.0 (from 1.0.0)

Nothing is required. To use what's new:

1. **Weighted Elo:** add `falloff = 0.95` to `Config > Elo.points`. This lowers the
   Elo of players with lots of towers far below their hardest one, so check any
   Area locked behind `elo`.
2. **A difficulty chart that starts below Easy:** add `firstRating` to
   `Config > Towers`, then update every tower's difficulty, and every category's
   `from` and `to`, to the new numbers.

### 1.0.0 (from 1.0.0-rc.3)

1. Add `configVersion = 1` to `Config > Project`.
2. Replace `Config > Messages` with the new one and copy your wording back in.
3. In `Config > Chat`, delete the loop at the top and the
   `byGamePass = gamePassTags` line.
4. Replace `Config > Admin` and put your old `userIds` into a role. Check
   `Config > Chat.tags.byUser` too: earlier versions shipped with the kit author's
   account in both.
5. In `Config > Settings`, rename `resetOnDeath` to `restartOnDeath`, and set
   `keybinds.allJumpsPlace = "E"` and `keybinds.allJumpsTeleport = "Q"`.
6. Rename the `ResetonDeath` settings row to `RestartonDeath`, and delete
   `TowerGUI > LoadingScreen > Attention`.
7. In the hub, copy `RingSelect > Requirements` in from the new hub place. The hub
   won't start without it.
8. Install the new plugin.
9. **Publish every place at the same time, then shut down old servers.** Saves
   changed shape in this version, and an old server turns away a player whose
   save a new server has written.
