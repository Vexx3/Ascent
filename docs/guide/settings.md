# Settings

Player settings are saved inside each player's account data. User-editable defaults live in `ReplicatedStorage > Shared > Config > Settings`; the saved shape lives in `ReplicatedStorage > Shared > Accounts > Template`.

The client settings menu sends updates to the server, and `ServerScriptService > Server > Settings > SettingsService` accepts only supported values before saving.

## Saved Settings

Every field, its type and its default are in the
[Configuration Reference](./configuration.md#settings). That table is the only
one, on purpose: a second copy on this page would drift
-- two real settings were missing from it.

## Dying And Resetting

What a death does depends on the mode and on the player's **Restart on Death**
setting (`restartOnDeath`):

- **Off**, the default: dying in Normal mode ends the run. In All Jumps and
  Practice it returns the player to their last checkpoint, or to the tower's
  spawn if they have not placed one.
- **On**: any death in a tower starts it again from the bottom, in every mode,
  and clears an All Jumps or Practice checkpoint. It happens at once, without
  waiting for the respawn.

Roblox's own Reset button is a death like any other and follows the same rule.
The kit binds it in `StarterPlayerScripts > Client > Towers > ResetButton` so
that the server does the killing: a reset done on the client cannot be revived,
so the player would sit through the respawn first. Removing that script leaves
the button doing nothing.

## FPS Cap

**Settings > Gameplay > FPS Cap** holds the client to a frame rate, and the
**FPS Cap Increase** and **FPS Cap Decrease** keys step through the same
options without opening the menu. Increase stops at the fastest option and
Decrease stops at Off -- neither wraps, so a press can never uncap somebody
who meant the opposite.

The options are yours. `fpsCaps` in `Config > Project` is the list, in the
order players cycle through it:

```luau
fpsCaps = { 60, 75, 90, 144, 165, 240 },
```

**Off is not in that list and cannot be removed** -- the kit puts it first so
a player is never left unable to turn the cap off, and so Decrease has an end
to stop at. A value that is not a whole positive frame rate is dropped with a
warning naming it, rather than becoming an option that caps nothing.

A player saved on a rate you later remove falls back to the Config default.

::: warning Capping costs CPU
Roblox gives experience code no framerate cap. The only way to hold a frame
back is to hold the render thread, and that has to spin rather than wait --
yielding lets the engine draw the frame anyway. Capping 240 down to 60 means
burning roughly twelve of every seventeen milliseconds in a busy loop.

So **Off is the default, and Off disconnects the loop entirely**: a player who
never turns the cap on pays nothing for the feature existing. Offer it, but do
not default a fangame to a cap.
:::

## Keybinds

Saved keybinds live under `settings.keybinds`.

| Key | Default | Purpose |
| :-- | :-- | :-- |
| `quickRestart` | `R` | Quick restart key. |
| `cornerFlipKeyboard` | `F` | Keyboard corner flip bind. |
| `cornerFlipController` | `ButtonX` | Controller corner flip bind. |
| `allJumpsPlace` | `E` | Place All Jumps checkpoint. |
| `allJumpsTeleport` | `Q` | Teleport to All Jumps checkpoint. |
| `allJumpsRemove` | `V` | Remove All Jumps checkpoint. |
| `fpsIncrease` | `Equals` | Step the FPS Cap up one option. |
| `fpsDecrease` | `Minus` | Step the FPS Cap down one option. |
| `emotes` | `dance2` = `T`, `laugh` = `Y`, `cheer` = `U` | One key per emote, each playing the emote it is named after. |

QuickRestart stays available in All Jumps and Practice. Its default overlaps the
All Jumps Teleport key; players can change either binding. Saved custom bindings are
preserved.

These eight are the kit's own and are fixed. **To add a keybind of your own**,
declare it in `Config > CustomSettings` — one line, and the row and the saving
come with it. See [Adding A Saved Setting](./custom-settings.md).

### Emote keys

`keybinds.emotes` holds one key per emote, named after the emote it plays, and
every name in it has to appear in `emotes` in `Config > Project`. Pressing a
key plays that emote and no other.

To let players rebind one, add a row to `SettingsMenu > ControlsFrame` named
after the emote with the first letter capitalised -- `Dance2` for `dance2` --
holding a `SettingsName` label and a `KeybindButton`, the same as any other
keybind row. An emote with no row keeps whatever key Config gave it; an emote
with no key in Config has none until a player sets one.

Each emote also needs an `InputAction` named `Emote_<name>` — `Emote_dance2` for
`dance2` — under `ReplicatedStorage > AscentInputs > Gameplay`, with its
`Keyboard` child kept. Copy an existing one. The kit looks the action up rather
than creating it, and an emote in Config with no action says so by name in the
Output.

Only the keys a player has actually changed are saved; the rest fall back to
Config.

The emote picker and the camera alignment arrows are two separate frames under
`MainMenu`, `EmoteFrame` and `AlignmentFrame`, each with its own toggle in
Settings — **Emote Buttons** and **Alignment Buttons**.

Alignment Buttons only appears on a touch device. The arrows turn the camera to
the next 45-degree heading, which a mouse can already do by dragging, so the row
is hidden where it has nothing to offer.

The Dance key works whether or not the emote picker is on screen: the toggle
shows the buttons, it does not switch emotes off.

## Spectating

`SpectateFrame.PlayerFrame.PlayerFPS` shows the selected other player's reported
FPS, never the local player's. The topbar and spectator reports share one render
counter. Reports continue once per second when rendering pauses; a missing report
is shown as `FPS: --` after five seconds. These are client-reported display values,
not trusted gameplay statistics.

`SpectateFrame.PlayerFrame.SpectatorCount` shows how many players are spectating
the one on the panel, whoever is reading included, and hides when nobody is.
Spectating yourself shows how many are watching you. Each client tells the server
whom it is watching, and the server keeps the count as a `SpectatorCount`
attribute on the watched player. The label is optional; its wording is
`spectator` and `spectators` in `Config > Messages > spectate`.

The supplied EToH music manager follows the spectated player's music zone and
reported track, with playback-position correction. Local volume and mute stay
unchanged. The server only accepts Sound references from the existing music
folders and rate-limits reports. Stopping spectating restores local zone selection.

## Adding A Setting

Follow [Adding A Saved Setting](./custom-settings.md). A setting of your own is
one declaration in `Config > CustomSettings`: the row is copied from the menu's
templates, and the saving and the server's check come with it, so it needs no
network message, datastore or remote event. The page's example adds a **Hide
Health Bar** toggle and the script that acts on it.

## See Also

- [Configuration Reference: Settings](./configuration.md#settings)
- [UI & HUD](./ui-and-hud.md)
