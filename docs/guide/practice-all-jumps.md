# Practice & All Jumps

The kit supports three player modes:

| Mode | Purpose |
| :-- | :-- |
| `Normal` | Standard tower attempts and normal completions. |
| `Practice` | Assisted tower practice with tools and checkpoint recovery. |
| `AllJumps` | Manual checkpoint challenge mode. |

Changing modes while inside a tower reloads the current tower, or a tower rush
from its first tower.

## Turning A Mode Off

`allJumpsEnabled` and `practiceEnabled` in `Config > Project` switch a whole
mode off. Its button, menu, keybinds and leaderboard stat go, and the server
never starts listening for it, so a crafted request cannot switch it back on.

## Restarting In Practice And All Jumps

A restart in either of these modes leaves the tower standing. Only the player
moves: back to the spawn, healed, with the timer and checkpoints reset. Nothing
is rebuilt, so it happens in a tenth of a second rather than the several it
takes to recreate every moving platform, button and killbrick in a tower.

Normal mode still rebuilds on every restart, so a timed run always begins from
the same state.

Because a practice session can leave a client object somewhere unhelpful — a
platform parked at the wrong end of its run, a pushbox in a corner — a
**ResetCOs** button in `MainMenu > Main > ButtonsContainer` rebuilds them by
hand and walks the player back to the spawn, the way entering the tower does.

It is not a restart. The timer keeps running, checkpoints stand, godmode stays
on, and it does not count as another attempt — it repairs the run in progress
rather than starting a new one. It appears only while the player is inside a
tower in Practice or All Jumps mode, since it has nothing to do anywhere else,
and deleting the button changes nothing else.

Entering a tower always builds its client objects, whatever the mode.

## Practice Mode

Practice mode is for learning and testing towers.

When Practice mode is enabled:

- The player receives the practice tools, which are described in [Boost & Practice Tools](./boost-items.md).
- The player can place checkpoints with the same keys as All Jumps, as long as All Jumps is enabled.
- Death is intercepted and the player is sent back to the checkpoint they placed, or to the tower's spawn if they have not placed one.
- The player cannot complete the tower from a winpad.
- Practice tools are removed when the player leaves Practice mode or exits the tower.

### Godmode

`PracticeGodmode` is a toggle: equip it and click to switch damage off, click
again to switch it back on. The tool's own name shows which, `Godmode [ON]` or
`Godmode [OFF]`. While it is on the player wears an invisible force field, and
Roblox will not let `Humanoid:TakeDamage` through one; the server also drops
killbrick damage outright rather than sending it at the force field. It survives
dying and respawning, since practice deaths are the thing it exists to make
cheap. Starting the tower again, leaving it, or leaving Practice switches it off.

The server checks the player is actually in Practice before switching it on. The
tool is handed out and taken away with the rest of the practice kit, so it should
never be reachable in a run that counts — but a run that counts is exactly the
wrong one to be invulnerable in, so the check does not rely on that.

## All Jumps Mode

All Jumps mode uses player-placed checkpoints.

Default keybinds:

| Action | Default Key |
| :-- | :-- |
| Place checkpoint | `E` |
| Remove checkpoint | `V` |
| Teleport to checkpoint | `Q` |

When All Jumps mode is enabled:

- The player can place and use manual checkpoints.
- Death is intercepted and the player returns to the saved checkpoint.
- A valid win records All Jumps stats.
- `AJBadgeID` can be awarded for the tower.
- Tickets and completion tools are not awarded.

Players can change these keybinds in the settings menu.

## See Also

- [Boost & Practice Tools](./boost-items.md)
- [Tower Setup](./tower-setup.md)
