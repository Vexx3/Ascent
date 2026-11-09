# Settings

Players change their settings in the menu, and their choices are saved.
`Config > Settings` decides what a **new** player starts with. Players who've
already changed a setting keep their own choice.

To add a setting of your own, see [Adding a Saved Setting](./custom-settings.md).

## Every setting

In these tables, **Default** is what new players start with, and you can change it
in `Config > Settings`.

### Gameplay

| Setting | Default | Options | What it does |
| :-- | :-- | :-- | :-- |
| `restartMode` | `"Hold"` | `"Hold"`, `"Double Tap"`, `"Off"` | **Restart Key:** how the restart key works. |
| `quickResetDelay` | `1` | `0` to `3` seconds | **Hold Time:** how long to hold the restart key. |
| `restartOnDeath` | `false` | | See [Dying and resetting](#dying-and-resetting). |
| `confirmActions` | `true` | | Asks "Are you sure?" before leaving or restarting a run. See [Confirmations](./ui-and-hud.md#confirmations). |
| `highFPSPhysicsFix` | `false` | | **Truss Fix:** steadier physics at very high frame rates. |
| `fpsCap` | `"Off"` | A rate from `fpsCaps` | See [FPS Cap](#fps-cap). |

### Visual

| Setting | Default | Options | What it does |
| :-- | :-- | :-- | :-- |
| `uiScale` | `1` | `0.5` to `1.5` | How big the menu and HUD are. |
| `reduceMotion` | `false` | | Menus and toasts appear without sliding in. |
| `hideUI` | `false` | | Fades the menu buttons while climbing. See [Hide UI](./ui-and-hud.md#hide-ui). |
| `hideTimer` | `false` | | Hides the timer. |
| `fpsDisplay`, `pingDisplay`, `statsLabels` | `false`, `false`, `true` | | See [Performance Stats](#performance-stats). |
| `keyOverlay` | `false` | | Shows the [Keyboard Overlay](./ui-and-hud.md#keyboard-overlay). |
| `showSpectatorCount` | `false` | | Shows how many people are spectating you. |
| `emoteButtons` | `false` | | Shows the emote buttons. |
| `invisiblePlayers` | `"Off"` | `"Not Friended"`, `"Everyone Else"`, `"Near"`, `"You"` | Hides other players. |
| `transparentAccessories` | `false` | | Fades your own hats and hair when the camera is close. |
| `towerLoadingBehavior` | `"Unload Towers"` | `"Load All"`, `"Unload All"` | Which towers stay loaded. See [Hiding other towers](./client-objects.md#hiding-other-towers). |
| `flipIndication` | `true` | | Shows the [Flip Indication](./ui-and-hud.md#flip-indication). |
| `hideDisabledItems` | `false` | | Hides switched-off backpack items instead of marking them red. |
| `keyDisplayLimit` | `5` | `0` to `10`, or All | How many tower keys float behind your character. The rest show on screen, in `EffectGUI > Keys`. |

### Audio

| Setting | Default | Options | What it does |
| :-- | :-- | :-- | :-- |
| `musicVolume` | `0.5` | `0` to `2` | Music volume. The slider's steps are `musicVolumeSteps`. |
| `audioVisualizer` | `"Off"` | `"Low"`, `"Medium"`, `"High"`, `"OMG Why"`, `"AAAAA"` | Shakes the camera to the music. |

### Controls (phones and tablets)

| Setting | Default | Options | What it does |
| :-- | :-- | :-- | :-- |
| `mobileDPad` | `"Off"` | `"Mode 1"`, `"Mode 2"` | Shows an on-screen D-pad. |
| `alignmentButtons` | `false` | | Shows camera alignment arrows. |
| `alignmentDot` | `false` | | Shows a dot in the middle of the screen (`HUD > dot`). |

### Chat

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `hideBubbleChat` | `false` | Hides chat bubbles. |
| `winMessages` | `true` | Shows tower and rush wins in chat. |
| `legitWinMessagesOnly` | `false` | Shows Normal wins only, and hides All Jumps wins. |
| `disableProgress` | `false` | Stops your [far messages](./announcements-webhooks.md#far-messages) being sent. |

### On other pages of the menu

| Setting | Page | Default | What it does |
| :-- | :-- | :-- | :-- |
| `extendedCompletions` | Completions | `false` | Shows [Extended Completions](./ui-and-hud.md#extended-completions). |
| `hideCosmetics` | Cosmetics | `"Off"` | Hides trails and auras: `"Everyone Else"`, `"Yours"` or `"All"`. |
| `autoSaveRuns`, `autoSaveSlot` | Saved Runs | `false`, `1` | [Auto save](./saved-runs.md#auto-save). |
| `checkpointCamera` | Checkpoint panel | `true` | Going to a checkpoint also turns the camera back. |
| `checkpointTransparency` | Checkpoint panel | `0.5` | How see-through checkpoint blocks are, from `0` to `1`. |
| `checkpointButtons`, `checkpointLighting`, `checkpointBoosts`, `checkpointObjects` | Checkpoint panel | `true` | See [What a checkpoint puts back](./practice-all-jumps.md#what-a-checkpoint-puts-back). |

The kit finds each settings row by name anywhere in the menu, so you can move rows
around. A heading hides when every row under it is hidden.

## Dying and resetting

**Restart on Death** (`restartOnDeath`) decides what happens when a player dies:

| | Normal | All Jumps and Practice |
| :-- | :-- | :-- |
| **Off** (the default) | The run ends. | Back to the last checkpoint, or to the spawn. |
| **On** | The tower restarts. | The tower restarts. |

Roblox's own Reset button counts as dying. The kit handles it in
`Client > Towers > ResetButton`, so don't delete that module.

## FPS Cap

**Settings > Gameplay > FPS Cap** limits the player's frame rate. The FPS keys
(`=` and `-` by default) change it without opening the menu, and
`TowerGUI > NoticeLabel` shows the new cap for a moment.

The options come from `fpsCaps` in `Config > Project`. **Off** is always first.

```luau
fpsCaps = { 60, 75, 90, 144, 165, 240 },
```

Players can make the keys skip a rate: pick it in the dropdown and tick **Skip**
next to the setting. The rate turns red. It's still in the dropdown, and **Off**
can't be skipped.

The tick box is `FPSCap > SkipButton`, and `SettingsMenu > FpsCapHover` explains it
when the player points at it. Without `SkipButton`, the keys don't skip anything.

::: warning Capping uses CPU
Roblox has no built-in frame cap, so the kit holds frames back by keeping the CPU
busy. Leave the default at Off.
:::

## Performance Stats

`PerformanceStats` is a dropdown with three tick boxes: **FPS**, **Ping** and
**Show Labels**. Whatever's ticked shows in Roblox's top bar:

```text
FPS: 58          58
Ping: 46MS       46
```

That's with labels on (left) and off (right). The text is `fps`, `fpsUnknown`,
`ping` and `performanceStats` in the `settingsMenu` group of `Config > Messages`.

## Keybinds

New players' keys are set in `keybinds` in `Config > Settings`. Players can change
them in Settings > Controls.

### Keyboard

| Key setting | Default | What it does |
| :-- | :-- | :-- |
| `quickRestart` | `R` | Restarts the tower. |
| `cornerFlipKeyboard` | `F` | Does a corner flip. |
| `allJumpsPlace` | `E` | Places an All Jumps checkpoint. |
| `allJumpsTeleport` | `Q` | Goes back to it. |
| `allJumpsRemove` | `V` | Deletes it. |
| `fpsIncrease`, `fpsDecrease` | `Equals`, `Minus` | Changes the FPS Cap. |
| `menu` | `M` | Opens or closes the menu. |
| `spectate` | `P` | Starts or stops spectating. |
| `checkpoints` | `C` | Opens or closes the checkpoint panel. |
| `resetObjects` | `G` | Resets the tower's objects, in All Jumps and Practice. |
| `spectatePrevious`, `spectateNext` | `Q`, `E` | Watches the previous or next player. |
| `emotes` | `dance2 = "T"`, `laugh = "Y"`, `cheer = "U"` | One key per emote. |

### Controller

| Key setting | Default | What it does |
| :-- | :-- | :-- |
| `quickRestartController` | `ButtonY` | Restarts, when held. |
| `cornerFlipController` | `ButtonX` | Does a corner flip. |
| `allJumpsPlaceController` | `DPadUp` | Places a checkpoint. |
| `allJumpsTeleportController` | `DPadRight` | Goes back to it. |
| `allJumpsRemoveController` | `DPadDown` | Deletes it. |
| `spectatePreviousController`, `spectateNextController` | `ButtonL1`, `ButtonR1` | Watches the previous or next player. |

Give each action its own default key. If two defaults share one, the Output warns
you. The spectate keys are the exception: they only work while spectating, so they
can share. If you leave a key out, that action starts with no key, and players can
still set one.

Players can give two actions the same key themselves. Both keep it, and a
notification says which other action the key does. Its text is `keybindShared` in
the `settingsMenu` group of `Config > Messages`.

### On a controller

The Controls tab only shows rows that have a controller button, and each device
keeps its own keys. The All Jumps buttons don't work while a menu is selected
with the controller, because the D-pad is moving around the menu.

### Adding an emote key

1. Add the emote to `emotes` in `Config > Project`, and to `keybinds.emotes` in
   `Config > Settings`.
2. In `ReplicatedStorage > AscentInputs > Gameplay`, add an `InputAction` named
   `Emote_<name>`. Copying an existing one is easiest.
3. To let players change the key, add a row to `ControlsFrame > EmoteGroup`, named
   after the emote with a capital first letter (`Dance2`), holding a `SettingsName`
   and a `KeybindButton`.

## Spectating

- The **Show Spectator Count** setting shows how many people are watching you.
- The spectate bar shows the watched player's frame rate, how many people are
  watching them, and their run's [modifiers](./modifiers.md).
- Its words are the `spectate` group in `Config > Messages`.

While spectating, the music follows the music zone of the player being watched.
