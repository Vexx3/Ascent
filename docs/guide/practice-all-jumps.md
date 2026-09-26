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

Checkpoints stack: Remove takes off the newest, and Go and dying both return to the newest. With no checkpoint, dying returns to the tower's spawn. Players can rebind the keys in Settings.

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

Enter in a box does the same as its button. The two choices are saved, starting from `checkpointCamera` and `checkpointTransparency` in `Config > Settings`. The panel is optional.
