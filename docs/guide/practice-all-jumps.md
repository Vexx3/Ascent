# Practice & All Jumps

| Mode | For |
| :-- | :-- |
| `Normal` | Real attempts. Earns everything. |
| `Practice` | Learning a tower, with tools and your own checkpoints. Can't win. |
| `AllJumps` | Beating a tower with your own checkpoints. Earns an All Jumps win. |

Switching mode inside a tower restarts it (a rush restarts from its first tower). `allJumpsEnabled` and `practiceEnabled` in `Config > Project` turn a mode off entirely.

## Placing Checkpoints

In both modes, players place their own checkpoints:

| Action | Default key |
| :-- | :-- |
| Place checkpoint | `E` |
| Go to checkpoint | `Q` |
| Remove checkpoint | `V` |

Checkpoints stack: Remove takes off the newest, and Go and dying both return to the newest. With no checkpoint, dying returns to the tower's spawn. With **Restart on Death** on, dying restarts the tower instead and clears the checkpoints. Players can rebind the keys in Settings.

A restart in these modes is instant: only the player moves back to the spawn, and the tower isn't rebuilt. **ResetCOs** in `MainMenu > Main > ButtonsContainer` rebuilds the tower's moving parts without restarting the run.

## Practice Mode

- The player gets the [practice tools](./boost-items.md#practice-tools): noclip, heal and godmode.
- They can place checkpoints (if All Jumps is on).
- They can't win the tower.

### Godmode

`PracticeGodmode` switches damage off and on with a click; its name shows `Godmode [ON]` or `[OFF]`. It lasts through deaths and switches off on restart, leaving the tower, or leaving Practice. The server only allows it in Practice.

## All Jumps Mode

A win records an All Jumps completion and can give the tower's `AJBadgeID`. It's checked like a Normal win, but gives no tickets or completion tools, and counts for less [Elo](./elo.md).

## The Checkpoint Panel

In both modes, `ButtonsHolder > AJMenuButton` opens `MainMenu > AJSettings`:

| Part | Does |
| :-- | :-- |
| `CheckpointPlaced` | How many checkpoints are placed. |
| `CPLoadCam > ToggleButton` | Whether going to a checkpoint also turns the camera to where it faced. |
| `CPTransparency > InputBox`, `Button` | How see-through the markers are, 0 to 1. |
| `TPCheckpoint > InputBox`, `Button` | Go to a checkpoint by number. |
| `CPLoadButtons > ToggleButton` | Whether going to a checkpoint also puts the tower's buttons back as they were. Optional. |
| `CPLoadLighting > ToggleButton` | Whether going to a checkpoint also puts back the lighting its lighting changers had set. Optional. |

Enter in a box does the same as its button. The choices are saved, starting from `checkpointCamera`, `checkpointTransparency`, `checkpointButtons` and `checkpointLighting` in `Config > Settings`. The panel is optional.

### Buttons and lighting at a checkpoint

A checkpoint remembers the tower's buttons and lighting when it's placed, and puts them back when it's loaded, whether by teleporting to it or by dying:

- **Buttons**: every button goes back to pressed or not. A timed one comes back with the time it had left, so a button pressed 3 seconds into a 10-second timer lets go 7 seconds after the checkpoint loads, counting down on the button and in the timer list as if it had just been touched. This works for v5 and v6 buttons alike.
- **Lighting**: whatever the lighting changers had set, of either version: the time of day, fog, sky and effects.

Each is taken whether its switch is on or not, so turning one on later still works with checkpoints already placed.
