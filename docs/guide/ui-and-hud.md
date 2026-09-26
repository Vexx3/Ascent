# UI & HUD

The screens are in `StarterGui` and are yours to lay out. See [The Menus](./studio-structure.md#the-menus) for the names the kit looks for.

## HUD

`TowerGUI` shows the tower's acronym, the timer, the restart hold, boost use, rush progress, the Practice and All Jumps labels, and the loading screen (while data loads and during a teleport). The **Hide Timer** setting hides the timer.

`LoadingScreen` can be a Frame or a CanvasGroup. Either fades in and out; a CanvasGroup fades as one image, a Frame fades each part inside it. It covers the screen at once when a player joins.

## Notifications

The toasts in `MainMenu > NotificationHolder` draw rich text. A locked Area's requirement shows its difficulty in colour, as the hub does. In your own `Config > Messages`, `<b>` works, and a plain `&` has to be written `&amp;`.

## Hide UI

**Hide UI**, in the Visual settings, fades what a climb doesn't need, and brings it back while the pointer is over it:

- `MainMenu > ButtonsHolder`: the Menu and Spectate buttons.
- `MainMenu > PlaceVersionLabel`.
- The music system's `LegacyMusicGui > Button`.

Faded buttons still work. On a phone, a tap presses the button and shows it for three seconds. The timer, health, keys, backpack and touch controls never fade.

**To fade an element of your own**, give it the tag `HideUI` (**Properties → Tags**). Everything inside a tagged frame fades with it.

The settings row is `SettingsMenu > VisualFrame > HideUI`. Without it the setting isn't offered.

## Main Menu

The menu restarts or exits the current tower, resets its client objects, switches Practice and All Jumps, opens Settings, Completions and Spectate, shows tickets and notifications, and offers Rejoin and Return to Hub. Tower buttons hide outside a tower.

::: tip Keep the caption boxes short
The text inside each sidebar button is deliberately shorter than the button, so that every caption scales to the same height. If you rename a button to something longer than `Completions`, shorten its text box a little until the captions match again. Leave `TextWrapped` on; turning it off also turns off `TextScaled`.
:::

## Completions Menu

Shows the player's (or any looked-up player's) completed towers, All Jumps towers and rushes, attempts and wins, best times, time spent, hardest completion, and Elo with global rank. Percentages show one decimal place, rounded down.

## Spectate

Watches another player: their name, tower, timer, rush progress, mode, boost use, health, frame rate, and how many are spectating them. See [Settings](./settings.md#spectating).

## The Backpack Icon

The backpack's topbar icon only shows for players without a keyboard (phones, tablets, controllers); on a keyboard, the backquote key opens it. To show it everywhere, delete the `BackpackIcon.follow` call in `Client > Backpack > TopbarIcon`.

## Scrolling Lists

Give each scrolling list a `UIListLayout` or `UIGridLayout` and set its `AutomaticCanvasSize`, and the kit sizes it so the last item can be reached.
