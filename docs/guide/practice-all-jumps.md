# Practice & All Jumps

Every tower can be played in three modes. Players switch between them from the
menu's run buttons.

| Mode | What it's for | What it earns |
| :-- | :-- | :-- |
| **Normal** | A real attempt, from the bottom to the top in one go. | Everything: the win, tickets, badges, tools and [Elo](./elo.md). |
| **Practice** | Learning a tower, with practice tools and your own checkpoints. | Nothing. A Practice run can't win. |
| **All Jumps** | Beating a tower with your own checkpoints. | An All Jumps win, the tower's All Jumps badge and less Elo. No tickets or tools. |

- To turn a mode off for the whole game, set `allJumpsEnabled` or `practiceEnabled`
  to `false` in `Config > Project`.
- Switching mode while in a tower restarts it.
- [Tower rushes](./tower-rushes.md) have no Practice mode, so the button hides
  during one.

## Placing checkpoints

In Practice and All Jumps, players place their own checkpoints as they climb:

| Action | Default key |
| :-- | :-- |
| Place a checkpoint | `E` |
| Go back to it | `Q` |
| Delete it | `V` |

- Checkpoints stack up. Delete removes the newest one, and going back (or dying)
  takes you to the newest one.
- With no checkpoints placed, dying sends you back to the tower's spawn.
- Restarting, or dying with **Restart on Death** turned on, clears every
  checkpoint.
- Going back to a checkpoint puts you exactly where you were: the same spot, the
  same speed and the same pose.

Restarting in these modes is quick: the tower isn't rebuilt, you just go back to
its spawn.

**Reset Objects** (its button in the menu, or `G`) rebuilds the tower's buttons and
moving parts without restarting the run. Your checkpoints stay.

## Practice tools

In Practice mode, players get three [practice tools](./boost-items.md#practice-tools):
`Noclip`, `Heal` and `Godmode`.

### Godmode

Click Godmode to turn damage off, and click again to turn it back on. The tool's
name shows `Godmode [ON]` or `Godmode [OFF]`. It stays on when you die, and turns
off when you restart, leave the tower or leave Practice.

## The checkpoint panel

The **Checkpoints** button, or the `C` key, opens the checkpoint panel. Its
switches start the way `Config > Settings` says:

| Switch | Config > Settings |
| :-- | :-- |
| Marker see-through | `checkpointTransparency` |
| Turn the camera back | `checkpointCamera` |
| Put buttons back | `checkpointButtons` |
| Put lighting back | `checkpointLighting` |
| Put boosts back | `checkpointBoosts` |
| Put keys and objects back | `checkpointObjects` |

## What a checkpoint puts back

Going back to a checkpoint, or dying, puts the tower back the way it was when you
placed the checkpoint:

| What | How |
| :-- | :-- |
| **Buttons** | Pressed or not pressed, and a timed button with the time it had left. Works with v5 and v6 buttons. |
| **Lighting** | Whatever lighting changers had set. v5 and v6. |
| **Boosts** | Each one with the time it had left. A boost you picked up after the checkpoint ends. v5 and v6. |
| **Keys** | You're holding them again, and a timed key has its time back. v6 only. |
| **Morphers** | Back to the morph you had. v6 only. |
| **Pushboxes** | Back where they were. A box spawned after the checkpoint is removed. |

Before moving you, the game lets go of anything holding you: a v6 zipline,
balloon, swing, vine, seat or attacher, a Roblox seat, and any weld or rope
attached to something outside your character.

**What doesn't come back:**

- A key you used on a door, and the door it opened.
- A v6 morph without a timer, if you pressed it after the checkpoint.
- v5 keys, morphers and mounts, which keep track of themselves.
- A v5 pushbox spawned after the checkpoint.
- Objects that move or reset on their own, such as vanishing platforms, conveyors,
  elevators, beat blocks and spinners.
- Property changers, sequencers, music zones and dialogs.

## Saving a run

Players can save an All Jumps run to a slot and finish it later. See
[Saved Runs](./saved-runs.md).
