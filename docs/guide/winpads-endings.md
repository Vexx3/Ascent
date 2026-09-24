# Winpads & Endings

A `WinPad` is the part players touch to complete a tower. The server validates
the run, awards badges and stats, sends announcements, and teleports the player
to the winroom.

## What happens on a touch

Every step below runs on the server. Nothing is awarded until all three checks
pass, and a run that fails any of them is refused rather than partly credited.

A touch is ignored outright in Practice mode, and when the player has used a
boost item in a tower or rush that bans boosts. Otherwise it is checked, in
order:

1. **This winpad belongs to the tower you are in.**
2. **The run lasted at least the tower's minimum time.**
3. **Every checkpoint was reached, in order.**

Pass all three and the win is announced, the completion is granted — badge,
stats, tickets and tools — and you are sent to the winroom. During a tower rush,
any winpad moves the player on to the rush's next tower instead; see
[Tower Rushes](./tower-rushes.md).

::: warning A failed check is treated as cheating
Fail any one of them and the player is **kicked** with nothing awarded, and a
line from `antiCheatKickMessages` in `Config > Chat` is announced to the server.
With `webhooks.antiCheat` turned on in `Config > Chat` (it ships off), the
attempt is also reported to `ANTICHEAT_WEBHOOK`. These are not soft refusals.
:::

The minimum time and checkpoint checks are skipped for a player who has used a
debug item — a Tool with a `DebugItem` attribute, which is what the tools in
`ServerStorage > StarterPackStudio` get in a Studio playtest. A test run with
one of those equipped proves nothing about the anti-cheat, so it earns nothing
either: it goes to the winroom, and the player is told it did not count.

## Standard Ending

For a normal tower ending:

1. Add a `BasePart` at the end of the tower.
2. Name it `WinPad`, exactly. The name is case sensitive, so `Winpad` never registers.
3. Make sure the tower is registered in `ReplicatedStorage > Shared > Config > Towers`.

When the player touches the `WinPad` in Normal mode, the kit can:

- Award the tower badge from the tower entry in `ReplicatedStorage > Shared > Config > Towers`.
- Record the tower win and best time.
- Award tower points.
- Give completion tools.
- Award tickets if the run was not boosted and the tower is off cooldown, or allows rebeats.
- Teleport the player to the winroom.

Practice mode cannot complete a tower. All Jumps mode records an All Jumps win and can award `AJBadgeID`, but it does not give tickets, completion tools, or the tower's or an ending's `BadgeID`.

## Custom Ending

Use custom winpad attributes for secret endings, alternate exits, or special badges.

A tower has one **main ending**: the winpad whose `EndingID` is the tower's
acronym, which is what an unset `EndingID` means. Only the main ending counts
as beating the tower — the win and best time, points, tickets, completion tools,
Elo and the All Jumps badge. A winpad with any other `EndingID` is a side
ending: it announces the win under its own name and difficulty, awards its own
`BadgeID` and the tower's badge (unless `PreventTowerBadge` is set), and sends
the player to its winroom, but the tower is not recorded as beaten.

Example:

1. Create another `BasePart` named `WinPad`.
2. Add `EndingID = "SecretVault"`.
3. Add `EndingName = "The Secret Vault"`.
4. Add `BadgeID = 1234567890`.
5. Add `PreventTowerBadge = true` if this ending should not award the main tower badge.

The Tower Setup window edits every one of these on its Selected tab, one card per
winpad, and its **Add another ending** button makes the second winpad for you
with a free ending ID already set.

## Winpad Attributes

| Attribute | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `EndingID` | `string` | Tower acronym | Identifies this ending. The acronym makes it the main ending; anything else makes it a side ending. |
| `EndingName` | `string` | Tower display name | Name used in announcements and webhooks. Side endings only: the main ending always uses the tower's name. |
| `Difficulty` | `string` | Tower difficulty | Overrides announcement difficulty for this ending. Side endings only. |
| `BadgeID` | `number` | `0` | Badge awarded for this ending. |
| `PreventTowerBadge` | `boolean` | `false` | Prevents the normal tower badge from being awarded. |
| `WinroomMarker` | `string` | Empty | Teleports to a named marker after winning. |
| `Winroom` | `string` | Empty | Legacy alias for `WinroomMarker`. |

::: warning `Difficulty` means two different things
On the **tower folder** it is a number — `9.26`. On a **winpad** it is a
difficulty *name* — `"Extreme"` — because all it does is change the word in the
announcement for this one ending. A number here is ignored.
:::

Every attribute on this page can also be a **Value object child** of the matching
class, which is how towers from the legacy framework carry them, and the child
wins where a winpad has both.

## Winpad Visuals

Every winpad gets the kit's particles when the server starts, and flashes through
random colours and materials while somebody is inside that tower. Three settings
in `Config > Project` control it:

| Setting | Default | Purpose |
| :-- | :-- | :-- |
| `winpadInterval` | `0.25` | Seconds between changes. |
| `winpadsChangeColor` | `true` | Flash the colour. |
| `winpadsChangeMaterial` | `true` | Flash the material. |

The flashing only runs for towers that have somebody in them — an empty tower's
winpad is a property change nobody can see. Turning both off stops the loop
doing any work at all.

## See Also

- [Configuration Reference: Towers](./configuration.md#towers)
- [Tower Setup](./tower-setup.md)
- [Markers & Portals](./markers-portals.md)
