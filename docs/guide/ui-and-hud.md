# UI & HUD

The screens are in `StarterGui` and are yours to lay out. See [The Menus](./studio-structure.md#the-menus) for the names the kit looks for.

## HUD

`TowerGUI` shows the tower's acronym, the timer, the restart hold, boost use, rush progress, the Practice and All Jumps labels, and the loading screen (while data loads and during a teleport). The **Hide Timer** setting hides the timer. The kit raises its `DisplayOrder` to at least 12, above the topbar icons, so on a narrow screen those icons never cover the timer.

`LoadingScreen` can be a Frame or a CanvasGroup. Either fades in and out; a CanvasGroup fades as one image, a Frame fades each part inside it. It covers the screen at once when a player joins.

Its `LoadingLabel` says what is loading, with dots that count up: "Loading data" as a player joins, and "Teleporting to Ring 2" during a teleport, naming the Area (or the hub) whenever the server knows it. The words are the `loading` group of `Config > Messages`; leave the dots off them. `Config > Visuals.timing.loadingDots` sets how fast the dots move, and `0` shows all three, still. Nothing else in `LoadingScreen` is read, so an `Attention` label from an older kit can go.

## Notifications

The toasts in `MainMenu > NotificationHolder` draw rich text. A locked Area's requirement shows its difficulty in colour, as the hub does. In your own `Config > Messages`, `<b>` works, and a plain `&` has to be written `&amp;`.

## Menu Sounds

The menus' sounds are Sound instances in `SoundService > Menu`, in every place, the hub too. Change the `SoundId`, `Volume` or anything else on the Sound itself:

| Sound | Plays |
| :-- | :-- |
| `Click` | When a button is pressed. |
| `Tab` | When a menu opens or a tab switches. Without it, `Click` plays. |
| `Hover` | When the pointer moves onto a button. The shipped place has none, so hovering is silent. |
| `Notification` | With a notification. |
| `Award` | With a notification that gives the player something: tickets, or a gift. Without it, `Notification` plays. |
| `Purchase` | When a purchase goes through: a shop item, a gift sent, or a game pass. Without it, `Notification` plays, and a game pass plays nothing. |
| `Error` | For a refusal or a failure: a locked Area, a teleport that failed, not enough tickets, or equipping a switched-off backpack item. Without it, `Notification` plays. |
| `Victory` | To the player who beat a tower. |
| `Death` | When an All Jumps death puts the player back on their checkpoint. |

Every one is optional. The Check window of the [Tower Setup plugin](./tower-setup-plugin.md) warns when the folder is missing.

## Hide UI

**Hide UI**, in the Visual settings, fades what a climb doesn't need, and brings it back while the pointer is over it:

- `MainMenu > ButtonsHolder`: the Menu and Spectate buttons.
- `MainMenu > PlaceVersionLabel`.
- The music system's `LegacyMusicGui > Button`.

Faded buttons still work. On a phone, a tap presses the button and shows it for three seconds. The fades and both waits are in `Config > Visuals.timing`. The timer, health, keys, backpack and touch controls never fade.

**To fade an element of your own**, give it the tag `HideUI` (**Properties → Tags**). Everything inside a tagged frame fades with it.

The settings row is `SettingsMenu > VisualFrame > HideUI`. Without it the setting isn't offered.

## Flip Indication

**Flip Indication**, in the Visual settings, shows where a corner flip would put you while you stand in a flip part: a black copy of your body with white edges, moving as you do, and a white cone on its head pointing where you'll face. It lands exactly where pressing flip would, `TeleToObject` included, and faces the way you'll really end up: towards the camera with shift lock on or in first person, the way you're walking if you're moving, and turned round if you're standing still.

It follows the flip's own rules, so it shows only on a part the flip would move you off: one tagged `CanFlip` or holding a `CanFlip`, not switched off (`Activated = false`) and not tagged `DoNotFlipPlayer`. Like the flip, it needs an R6 body.

It's on to start (`flipIndication` in `Config > Settings`), and its colours are `Config > Visuals.flipIndication`. The settings row is `SettingsMenu > VisualFrame > FlipIndication`. Without it the setting isn't offered, and players get the default.

## Main Menu

The menu restarts or exits the current tower, resets its client objects, switches Practice and All Jumps, opens Settings, Completions and Spectate, shows tickets and notifications, and offers Rejoin and Return to Hub. Tower buttons hide outside a tower.

::: tip Keep the caption boxes short
The text inside each sidebar button is deliberately shorter than the button, so that every caption scales to the same height. If you rename a button to something longer than `Completions`, shorten its text box a little until the captions match again. Leave `TextWrapped` on; turning it off also turns off `TextScaled`.
:::

## Completions Menu

Shows the player's (or any looked-up player's) completed towers, All Jumps towers and rushes, attempts and wins, best times, time spent, hardest completion, and Elo with global rank. Percentages show one decimal place, rounded down.

### Extended Completions

Some towers stop counting once they're gone. An event tower (Halloween, Christmas, April Fools) or a place that has closed can't be beaten by anyone new, so normal completions leave it out. So do tower rushes, which aren't towers.

- **Normal view**, the default: those towers, their places and every rush are hidden and not counted. Each Area's bar reads `Normal`.
- **Extended Completions**, in the Visual settings: they're all shown, by Area and by difficulty, and every bar counts everything shown. Each Area's bar reads `Extended`.

Mark what's extended in Config:

- `extended = true` on an Area in `Config > Worlds`: every tower in it. See [Worlds](./worlds-personal-servers.md).
- `extended = true` on a tower in `Config > Towers`: an event tower in a normal place. See [Configuration](./configuration.md).
- Every rush is extended already.

Only the count changes. An extended tower still counts for Area unlocks, tower points and the leaderboard, Elo, and cosmetic unlocks, and still pays its badge and tickets. The hardest tower is never a rush. When you look someone up, *your* setting decides which view you see.

It's off to start (`extendedCompletions` in `Config > Settings`). The bar words are `normal` and `extended` in `Config > Messages.completions`. The settings row is `SettingsMenu > VisualFrame > ExtendedCompletions`. Without it the setting isn't offered, and players get the normal view.

## Spectate

Watches another player: their name, tower, timer, rush progress, mode, boost use, health, frame rate, and how many are spectating them. See [Settings](./settings.md#spectating).

## The Backpack Icon

The backpack's topbar icon only shows for players without a keyboard (phones, tablets, controllers); on a keyboard, the backquote key opens it. To show it everywhere, delete the `BackpackIcon.follow` call in `Client > Backpack > TopbarIcon`.

## Scrolling Lists

Give each scrolling list a `UIListLayout` or `UIGridLayout` and set its `AutomaticCanvasSize`, and the kit sizes it so the last item can be reached.
