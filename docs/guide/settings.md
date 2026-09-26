# Settings

Players change their settings in the in-game Settings menu, and their choices are saved. `Config > Settings` sets what a **new** player starts with. The server checks every value before saving it.

## Saved Settings

| Setting | Tab | Values (default first) | What it does |
| :-- | :-- | :-- | :-- |
| `quickResetDelay` | Gameplay | `1` seconds, `0`–`3`, then Off | How long to hold the restart key. |
| `restartOnDeath` | Gameplay | `false` | See [Dying And Resetting](#dying-and-resetting). |
| `highFPSPhysicsFix` | Gameplay | `false` | Steadier physics at very high frame rates. |
| `fpsCap` | Gameplay | `"Off"`, or a rate from `fpsCaps` | See [FPS Cap](#fps-cap). |
| `towerLoadingBehavior` | Gameplay | `"Unload Towers"`, `"Load All"`, `"Unload All"` | Which towers stay loaded. Unloading makes the game lighter. |
| `invisiblePlayers` | Gameplay | `"Off"`, `"Not Friended"`, `"Everyone Else"`, `"Near"`, `"You"` | Hides other players. |
| `keyDisplayLimit` | Gameplay | `5`, `0`–`20` | How many recent key presses the key display shows. `0` hides it. |
| `alignmentButtons` | Gameplay | `false` | Camera alignment arrows. Touch devices only. |
| `emoteButtons` | Gameplay | `false` | The on-screen emote picker. The emote keys work either way. |
| `fpsDisplay` | Visual | `false` | The FPS counter in the topbar. |
| `hideTimer` | Visual | `false` | Hides the run timer. |
| `hideUI` | Visual | `false` | Fades the menu buttons while climbing. See [Hide UI](./ui-and-hud.md#hide-ui). |
| `hideDisabledItems` | Visual | `false` | Hides switched-off backpack items instead of greying them. |
| `hideCosmetics` | Visual | `"Off"`, `"Everyone Else"`, `"Yours"`, `"All"` | Hides trails and auras. |
| `hideBubbleChat` | Visual | `false` | Hides chat bubbles. |
| `transparentAccessories` | Visual | `false` | Fades your own hats and hair when the camera is close. |
| `musicVolume` | Audio | `0.5`, `0`–`2` | Music volume. |
| `audioVisualizer` | Audio | `"Off"`, `"Low"`, `"Medium"`, `"High"`, `"OMG Why"`, `"AAAAA"` | Camera shake with the music. |
| `alignmentDot` | Misc | `false` | Shows the alignment dot, the `dot` frame in the menu's ScreenGui. |
| `mobileDPad` | Controls | `"Off"`, `"Mode 1"`, `"Mode 2"` | An on-screen D-pad. |
| `checkpointCamera` | Checkpoint panel | `true` | Going to a checkpoint also turns the camera back. See [Practice & All Jumps](./practice-all-jumps.md#the-checkpoint-panel). |
| `checkpointTransparency` | Checkpoint panel | `0.5`, `0`–`1` | How see-through checkpoint markers are. |

To add a setting of your own, see [Adding A Saved Setting](./custom-settings.md). It takes one entry in `Config > CustomSettings`.

## Dying And Resetting

What a death does depends on **Restart on Death** (`restartOnDeath`):

- **Off** (default): dying in Normal mode ends the run. In All Jumps and Practice it returns the player to their last checkpoint, or the tower's spawn.
- **On**: any death in a tower restarts it from the bottom, in every mode, straight away.

Roblox's Reset button counts as a death. It is handled by `StarterPlayerScripts > Client > Towers > ResetButton`; don't remove it, or the button stops working.

## FPS Cap

**Settings > Gameplay > FPS Cap** limits the frame rate. The **FPS Cap Increase** and **Decrease** keys change it without opening the menu.

The options are `fpsCaps` in `Config > Project`:

```luau
fpsCaps = { 60, 75, 90, 144, 165, 240 },
```

**Off** is always the first option and can't be removed.

With **FPS Display** on, the topbar counter shows the cap under the frame rate:

```
FPS: 58
CAP: 60
```

It reads `CAP: OFF` when there is no cap.

::: warning Capping costs CPU
Roblox gives games no real frame cap, so the kit holds frames back by keeping the CPU busy. Leave the default at Off; Off costs nothing.
:::

## Keybinds

| Key | Default | Does |
| :-- | :-- | :-- |
| `quickRestart` | `R` | Restart the tower. |
| `cornerFlipKeyboard` | `F` | Corner flip. |
| `cornerFlipController` | `ButtonX` | Corner flip on a controller. |
| `allJumpsPlace` | `E` | Place an All Jumps checkpoint. |
| `allJumpsTeleport` | `Q` | Go to it. |
| `allJumpsRemove` | `V` | Remove it. |
| `fpsIncrease` | `Equals` | Raise the FPS Cap. |
| `fpsDecrease` | `Minus` | Lower the FPS Cap. |
| `emotes` | `dance2` = `T`, `laugh` = `Y`, `cheer` = `U` | One key per emote. |

Give every action its own key; the Output warns about two sharing one. To add a keybind of your own, see [Adding A Saved Setting](./custom-settings.md).

### Emote keys

Each emote in `keybinds.emotes` must also be in `emotes` in `Config > Project`, and needs an `InputAction` named `Emote_<name>` in `ReplicatedStorage > AscentInputs > Gameplay`. Copy an existing one.

To let players rebind it, add a row to `SettingsMenu > ControlsFrame` named after the emote with a capital first letter (`Dance2`), with a `SettingsName` label and a `KeybindButton`, like the other keybind rows.

## Spectating

The spectate panel's `PlayerFPS` shows the watched player's frame rate, or `FPS: --` if it hasn't arrived. `SpectatorCount` shows how many are watching that player, and hides when nobody is; it's optional. The music follows the watched player's music zone.
