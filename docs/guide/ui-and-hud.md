# UI & HUD

The kit's screens are ScreenGuis in `StarterGui`: `MainMenu` (the menu),
`HUD` (the buttons while playing) and `TowerGUI` (the timer and loading screen).
Open them in Studio to see what each part is.

You can move, resize and restyle anything, as long as you **keep the names**. The
kit finds every part by its name. The plugin's
[Check window](./tower-setup-plugin.md#the-check-window) lists any name that's
missing.

| To change | Go to |
| :-- | :-- |
| Colours, fonts and sizes | [Styling the Menu & HUD](./styling.md) |
| Any words players see | `Config > Messages` |
| Sounds | [Menu sounds](#menu-sounds) below |

## When you redesign a menu

- Give every scrolling list a `UIListLayout` or `UIGridLayout`, and set its
  `AutomaticCanvasSize`, or the bottom of the list gets cut off.
- Parts named `Template`, `Place`, `World1Button` and so on are copied to build
  lists. Style the template and every copy follows.
- To put something on a button's corner, like the ON label on Practice, put it in a
  Folder. Otherwise the button's `UIListLayout` moves it.
- Tab icons should be white outline images, so the stylesheet can colour them.
- `TowerGUI > TimerPanel` must be an ImageButton, or players can't click the
  timer to hide it.
- Messages use rich text, so write a plain `&` as `&amp;`.
- Don't end loading-screen text with dots. The screen adds its own.

## Menu sounds

The menu's sounds are in `SoundService > Menu`, in every place, including the hub.
To change one, change the Sound's `SoundId` or `Volume`. Every sound is optional.

| Sound | Plays | If it's missing, plays |
| :-- | :-- | :-- |
| `Click` | When a button is pressed. | Nothing |
| `Tab` | When a menu opens or a tab changes. | `Click` |
| `Hover` | When the pointer moves onto a button. The kit doesn't ship one. | Nothing |
| `Notification` | With a message. | Nothing |
| `Award` | With a reward: tickets, a gift or a new best time. | `Notification` |
| `Purchase` | When something is bought. | `Notification` |
| `Error` | When something is refused or fails. | `Notification` |
| `Victory` | For the player who beat a tower. | Nothing |
| `Death` | When a death in All Jumps sends the player back. | Nothing |

## Hide UI

The **Hide UI** setting fades the menu buttons while a player climbs. They come
back when the pointer moves over them.

To fade something of your own too, give it the `HideUI` tag. The fade timings are
in `Config > Visuals.timing`.

## Keyboard Overlay

The **Keyboard Overlay** setting shows the keys a player is pressing, for
recording runs. It only shows on a keyboard and mouse.

## Flip Indication

The **Flip Indication** setting shows where a corner flip would put the player. It
only shows on a part tagged `CanFlip` (or with a `CanFlip` inside it) that isn't
switched off with `Activated = false` or tagged `DoNotFlipPlayer`, and it needs an
R6 avatar. Its colours are in `Config > Visuals.flipIndication`.

## Confirmations

Restart Run, Exit Tower, Rejoin, Return to Hub, switching mode and Reset UI
Layout ask "Are you sure?" first.

- The questions are the `confirmations` group of `Config > Messages`. Remove the
  group and the buttons act straight away.
- Players can turn the questions off with the **Confirmations** setting.

## Credits

The ⓘ button next to the menu's X opens the Credits page. Fill it in
`Config > Credits`:

```luau
groups = {
	{ title = "Created by", people = { 123456789 } },
	{ title = "Builders", people = { 123456789, "A builder's name" } },
},
```

- A person is a name in quotes, or a Roblox user ID without quotes. A user ID shows
  their avatar and display name.
- While `groups` is empty and `showAscent` is off, the ⓘ button is hidden.

With `showAscent = true`, the list ends with **Made with Ascent** and the kit's
creator. It ships on, as a way to support Ascent. Set it to `false` to leave it out.

## Extended Completions

Some towers can't be beaten by new players any more, such as event towers and
places that have closed. Mark them with `extended = true`:

- on an Area in [`Config > Worlds`](./worlds-personal-servers.md), for every tower in it
- or on a tower in [`Config > Towers`](./configuration.md).

The Completions menu then leaves them, and every rush, out of the normal count.
Players can switch to the **Extended** view to count everything.

Only the count changes. An extended tower still counts for Area unlocks, tower
points, Elo and cosmetics, and still gives its badge and tickets.

## Leaderboards menu

| Tab | Ranks players by | Updates |
| :-- | :-- | :-- |
| Towers | Tower points | Every minute |
| All Jumps | All Jumps points. Hidden while All Jumps is off. | Every minute |
| Elo | [Elo](./elo.md). Hidden while Elo is off. | Every minute |
| Fastest | Best times on one tower or rush | When opened |

Only times the server measured count, and a run that used a boost never sets one.
To go without the menu, set `leaderboardsEnabled = false` in `Config > Project`.
No fastest times are saved while it's off.

## The backpack button

The backpack's button in the top bar only shows for players without a keyboard.
To show it for everyone, delete the `BackpackIcon.follow(icon)` line in
`Client > Backpack > TopbarIcon`.
