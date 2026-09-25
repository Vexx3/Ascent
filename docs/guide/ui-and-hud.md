# UI & HUD

The screens themselves live in `StarterGui` and are yours to lay out — see
[The Menus](./studio-structure.md#the-menus) for the names the code looks for.
This page is about the code behind them.

| What you see | The code |
| :-- | :-- |
| The whole menu, and which screen is open | `Client > Menu > MenuController` |
| The timer, tower name, loading screen | `Client > Towers > Hud` |
| Win messages and announcements | `Client > Towers > TowerDisplay` |
| Chat tags | `Client > Chat` |

## HUD

The HUD shows:

- Current tower acronym.
- Tower timer.
- Restart hold progress.
- Boost-used indicator.
- Tower rush progress.
- Practice mode and All Jumps mode labels.
- Loading screen.

When `hideTimer` is enabled, `TimerPanel` and its `UIStroke` become transparent and the `Timer` label is hidden. Other tower status elements remain available.

The server sends timer corrections through `UpdateTowerTimer`; the client advances the displayed timer locally between syncs.

## Hide UI

**Hide UI**, in the Visual settings, is a focus mode for climbing. The parts
of the HUD a climb does not need fade out, and fade back in while the pointer
is over them:

- `MainMenu > ButtonsHolder`: the Menu and Spectate buttons.
- `MainMenu > PlaceVersionLabel`.
- The music system's `LegacyMusicGui > Button`.

A faded button still works where it always was. A phone has no pointer, so a
tap on a faded button presses it and shows it for three seconds, and a
controller shows whatever it has selected. Everything shows while the player
is arranging controls in Edit UI Layout. Switching the setting off fades it
all back in exactly as authored.

The timer, health bar, keys, boost timers, backpack and touch controls never
fade. The player needs them while climbing.

**To fade a HUD element of your own**, give it the CollectionService tag
`HideUI` in Studio (**Properties → Tags**). Tag the frame that holds it rather
than each part: everything inside a tagged element fades with it.

The settings row is `SettingsMenu > VisualFrame > HideUI`, a copy of the
other toggles there. A menu without it simply does not offer the setting.

## Main Menu

The main menu handles:

- Restart current tower.
- Reset the tower's client objects without restarting the run.
- Exit current tower.
- Toggle Practice mode.
- Toggle All Jumps mode.
- Open settings.
- Open completions.
- Show ticket balance.
- Open spectate.
- Show notifications.
- Show `HighFPSFixHint` exactly when the High FPS Physics Fix setting is enabled.
- Rejoin the current place, or Return to Hub, which sends the player to
  `hubPlaceId` in `Config > Worlds`.

Tower-only buttons are hidden when the player is not inside a tower.

### Why the caption boxes are short

The `TextLabel` inside each sidebar button is much shorter than the button, and
so is `PlayerInfo` inside a Join Friend row. That is deliberate, and resizing one
back to fill its parent brings back a bug.

`Main` carries a `UIAspectRatioConstraint`, so the menu is the same shape at
every resolution and everything inside is positioned by scale. `TextScaled`
already holds its proportions from a phone to a 4K display.

What it does not do is agree between one caption and the next:

- a short word like `Hub` grows until it hits the **height** of its box;
- a long one like `Completions` stops earlier, having run out of **width**.

Left alone, a column of identical buttons renders at five different sizes.

**Shortening the box fixes it, with no code.** Once the box is short enough that
even the longest caption is stopped by height rather than width, every caption
lands on exactly that height — at every resolution, because it is a proportion.

The sidebar boxes are `0.476` of their button; the friend row's is `0.302` of the
row. Both stay centred where the taller box was.

So if you rename a button to something longer than `Completions`, or widen the
Area names shown in a friend row, shorten the box a little further until the
captions agree again. There is nothing at run time that will do it for you.

One trap while you are in there: `TextScaled` and `TextWrapped` are coupled, and
assigning `TextWrapped = false` silently switches `TextScaled` off. Leave
wrapping on. It costs nothing here, because a box barely taller than one line
has no size at which two lines would fit.

## Completions Menu

The completions menu reads player data and shows:

- Completed towers.
- Completed All Jumps towers.
- Completed tower rushes.
- Attempts and wins.
- Best Normal and All Jumps times.
- Total time spent.
- Hardest completion.

It can show the local player or request another player's data.

## Spectate

The spectate UI lets players watch other players in the server.

It displays:

- Display name and username.
- Current tower.
- Current tower timer.
- Tower rush progress.
- `Practicing` or `All-jumping` mode while the target is inside a tower.
- Boost-used state.
- Health bar.

## Tickets Display

The ticket display shows the player's current ticket count. When tickets increase, the menu can show a notification explaining the reward and cooldown.

Ticket rules are documented in [Tickets](/guide/tickets).

## The Backpack Icon

The backpack's topbar icon is shown only to players who have no key for it:
phones, tablets and controllers. On a keyboard the backquote key opens the
backpack, so the icon would be one more thing on a topbar that already has
several, and it is hidden -- the key keeps working.

The rule is in `Client > BackpackIcon` and follows `PreferredInput`, so a
laptop with a touchscreen keeps the shortcut and a player who picks a
controller up gets the icon back without rejoining. To show it everywhere,
delete the `BackpackIcon.follow` call from `Client > Backpack > TopbarIcon`.

## Scrolling Lists And Sliders

Long completion, teleport, shop, cosmetics, and settings lists use their existing `UIListLayout` or `UIGridLayout` content size for `CanvasSize`, including bottom padding. Sliders use the full track as the input area and support continuous mouse, touch, and controller dragging.

## Chat Tags And Win Messages

`Client > Chat` applies chat tags configured in `ReplicatedStorage > Shared > Config > Chat`.

`Client > Towers > TowerDisplay` renders game announcements and win messages.

Client message templates are documented in [Chat](/guide/chat).

## See Also

- [Settings](./settings.md)
- [Extending the Kit](./extending-gameplay.md)
