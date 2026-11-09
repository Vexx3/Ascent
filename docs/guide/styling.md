# Styling the Menu & HUD

The menu, the HUD and the hub's ring select are drawn by one stylesheet, using
Roblox's [styling system](https://create.roblox.com/docs/ui/styling). Change a
colour once and every button, panel and label that uses it changes too, even
while a playtest is running.

The stylesheet is in `ReplicatedStorage > Design`:

```text
ReplicatedStorage
└─ Design
   ├─ TokenSheet      -- the values: colours, fonts, sizes, corners and timings
   └─ AscentStyle     -- the rules: which part of the screen uses which value
```

`MainMenu`, `HUD` and `TowerGUI` each have a `StyleLink` that points at `AscentStyle`,
and so does the hub's `RingSelect`. Every place and the hub has its own copy of
`Design`, so after a change, copy `Design` into the others.

## Change a colour

1. In Studio, open **UI > Style Editor**.
2. Choose `TokenSheet`.
3. Change a token's value.

Most changes only need the tokens. Each one is listed below.

### Colours

| Token | What it colours |
| :-- | :-- |
| `Base` | The menu's main panel, dialogs and HUD panels. |
| `Shell` | The menu's tabs and run buttons, tooltips, toasts and the HUD's buttons. |
| `Surface` | Cards, boxes and leaderboard rows. |
| `Raised`, `RaisedHover` | Buttons, and a button under the pointer. |
| `Track` | Text boxes, slider and progress bar tracks, and the shade behind a dialog. |
| `Border` | Dividers, and the background of key hints. |
| `Shade` | The darkening over an Area's picture. |
| `HudBase` | The HUD's buttons, labels and timer. |
| `Text`, `TextMuted`, `TextDim` | Normal text, quieter text and the filled part of sliders, and placeholder text. |
| `TextOnAccent` | The ON badge on Practice and All Jumps, and a checkbox's tick. |
| `TextStroke` | The dark outline around text. |
| `Positive`, `Danger`, `Info` | Good news, failures, and the HUD's mode labels. |
| `PositiveText` | The words on go buttons, such as Play and Enter, and on a switch that's ON. |
| `DangerText` | The words on Restart Run, Exit Tower, Rejoin and Return to Hub. |
| `Practice`, `AllJumps` | The words Practice and All Jumps. |
| `On`, `Off`, `Thumb` | The edge of a switch that's ON, a switch that's off, and the slider's handle. |
| `Tickets` | Ticket amounts, and a price the player can afford. |
| `Gold`, `Silver`, `Bronze` | The top three places on a leaderboard. |
| `Locked` | A button the player can't use yet. |
| `NavTeleport`, `NavCompletions`, `NavLeaderboards`, `NavSavedRuns`, `NavModifiers`, `NavCosmetics`, `NavShop` | Each menu tab's colour. The Settings tab stays white. |

### Transparency

| Token | What it controls |
| :-- | :-- |
| `BaseTransparency`, `HudTransparency` | How see-through the panels and the HUD are. `0` is solid. |
| `RowTransparency` | The rows in Settings. |
| `SolidHoverTransparency`, `SolidPressTransparency` | A coloured button while it's hovered and pressed. |
| `ShadeTransparency` | The shade over a picture. |
| `TextStrokeTransparency` | The outline around menu text. `1` means no outline. |
| `OutlineTransparency` | The outline around the HUD buttons' text. |
| `TextOutlineThickness`, `TextOutlineTransparency` | The thicker outline on the tower's name and status lines. |

### Fonts, sizes and animation

| Token | What it controls |
| :-- | :-- |
| `Font`, `FontBold` | Body text: Montserrat Medium and Montserrat Bold. |
| `FontDisplay` | Tabs, titles, setting names and the HUD's buttons. |
| `FontMono` | The timer's numbers. |
| `TextTitle`, `TextHeading`, `TextBody`, `TextSmall`, `TextCaption`, `TextTimer` | Text sizes: 20, 15, 14, 13, 12 and 18. |
| `Radius`, `RadiusSmall`, `RadiusTiny`, `RadiusRound` | Rounded corners. `0, 0` makes them square. |
| `Outline`, `Frame`, `StrokeThickness`, `BorderThickness` | Borders on buttons and panels, and how thick they are. |
| `Shading` | The gradient on buttons and tabs. |
| `Shadow`, `ShadowTransparency` | The small shadow under the menu and buttons. |
| `Pad`, `PadSmall` | Space inside panels: 12 and 8. |
| `RowSize`, `ToggleSize`, `KeybindSize`, `TowerRowSize` | The size of rows and controls. Each has a `…Touch` version for phones and tablets. |
| `Quick`, `Smooth` | How long hover and selection animations take. |

The kit's scripts read `BaseTransparency`, `HudTransparency`, `Quick` and `Smooth`
by name, so don't rename or delete those four.

## Make your own UI match

To make something you've added look like part of the kit, give it the same
**tag** as the kit's version (Properties > Tags), on the same kind of object:

| Tag | Looks like |
| :-- | :-- |
| `NavButton` | A menu tab or run button. Add `Destructive` as well for red text. |
| `Tab` | A tab inside a menu. |
| `PrimaryButton`, `SecondaryButton` | A main button, and a less important one. |
| `Row`, with `RowLabel` on its name | A row in Settings. It lays itself out. |
| `PageSetting` | A setting at the top of a page: a `Caption` and its control. |
| `Toggle`, `Card`, `Tooltip` | A switch, a card, a tooltip. |
| `HudPanel`, `HudButton`, `HudText` | Parts of the HUD. |

A plain `TextButton` you add already gets the kit's font and colours.

### Long text

Text tagged `FitText` is never cut off. Text that fits keeps its normal size.
Text that doesn't fit wraps onto another line if its box is tall enough, and
shrinks if it isn't, down to 9 pixels.

1. Select a `TextLabel` or `TextButton`.
2. Add the tag `FitText`.
3. Make the box one line tall for something that should stay on one line, such
   as a time. Make it taller to let the text wrap.

Every label in the kit that shows a name, a number or a word from
`Config > Messages` already has it. Leave it off a label with `AutomaticSize`,
which grows to fit its text instead.

### Icons

Use white outline images, and the stylesheet colours them for you:

| Tag | For |
| :-- | :-- |
| `NavIcon` | A menu tab's icon. |
| `ButtonIcon` | An icon inside a button. |
| `TicketIcon` | The ticket icon, coloured with `Tickets`. |
| `LockIcon` | The padlock, which only shows while its button is `Locked`. |
| `ToastIcon` | A toast's icon. The `.Toast` rules pick which picture it shows. |

## State tags

While the game runs, the kit adds these tags to show what state something is in,
and the stylesheet's rules draw each state:

| Tag | On | Means |
| :-- | :-- | :-- |
| `Selected` | Menu tabs and page tabs | It's the one that's open. |
| `Active` | The Practice, All Jumps, Spectate and Checkpoints buttons | It's on, or open. |
| `On` | Switches, and a `Tab` that works as a switch | It's switched on. |
| `Locked` | Area buttons, cosmetic cards, saved run slots and modifiers | The player hasn't unlocked it. |
| `Equipped` | Cosmetic cards | The player is wearing it. |
| `Affordable` | Buy buttons | The player has enough tickets. |
| `Current` | Area cards | The player is in this place. |
| `Error`, `Success`, `Award`, `Purchase` | Toasts | What the message is about. |
| `Mine` | Leaderboard rows | The player's own row. |
| `Gold`, `Silver`, `Bronze` | Leaderboard rows | The top three. |
| `Equipped`, `Disabled` | Backpack slots | In the player's hand, or switched off. |
| `Practice`, `AllJumps` | The spectate bar's mode line, and Practice tool slots | Which mode it belongs to. |

## The rules

`AscentStyle` has one group of rules for each part of the screen, named after the
tag it styles. For example, everything about a switch is under `.Toggle`:

```text
.Toggle            -- the switch itself
├─ ::UICorner      -- its rounded corners
├─ :Hover          -- under the pointer
├─ .On             -- switched on
└─ :NonInteractable
```

To change one part, edit the rule in its group. What matters is the rule's
`Selector` and `Priority`. Its name is just a label.

::: warning Priority only works inside a group
A rule's `Priority` only beats other rules in the same group. Between two groups,
the groups' own priorities decide, and two groups with the same priority can win
in any order. Keep all the rules for one part in its own group, or give the group
that should win a higher `Priority`.
:::

Common changes:

- **A flatter look:** delete a `::UIStroke`, `::UIGradient` or `::UIShadow` rule,
  or change the tokens it uses.
- **Different corners:** set either `CornerRadius` or the four separate corner
  radii in a rule, never both.
- **A border or shadow on the HUD:** put a real `UIStroke` or `UIShadow` inside the
  element, and style it with a `> UIStroke` or `> UIShadow` rule. Hide UI can only
  fade real objects.
- **The checkpoint panel's height** is set in `#AJSettings` twice, once for mouse
  and once inside `@PreferredInputTouch`. Change both if you add or remove a row.
- **The music button** uses the same tokens, through a `StyleLink` in
  `LegacyMusicGui`.

## The backpack

The backpack is [Purse](https://github.com/ryanlua/purse), which builds its slots
with code. The kit tags each part so you can style it. Edit these rules, not Purse:

| Tag | Part |
| :-- | :-- |
| `BackpackSlot` | A slot. `Equipped` and `Disabled` are its states. |
| `BackpackSlotName`, `BackpackSlotNumber` | The item's name, and its hotbar number. |
| `BackpackTooltip` | The tooltip on a hotbar item. |
| `BackpackPanel` | The full inventory. |
| `BackpackSearch` | The search box. |
| `BackpackFilter` | The All, Heals and Boosts buttons. |
| `BackpackHint` | The text next to a controller's button icons. |

## When a change doesn't show up

A property set directly on an object beats the stylesheet. Studio marks a property
the stylesheet sets with ⚠. To let the stylesheet control it again, right-click the
property and choose **Reset to Default**.

## Players' own settings

| Setting | What it does to the style |
| :-- | :-- |
| Roblox's Background Transparency | Is multiplied into `BaseTransparency` and `HudTransparency`. |
| Reduce Motion, in Roblox's settings or the kit's | Makes `Quick` and `Smooth` instant, and stops menus and toasts sliding. |
| UI Scale, in Settings > Visual | Scales each screen through its `UIScale` named `PlayerScale`, from 0.5x to 1.5x. |
| Screen size | On screens bigger than 1080p, `PlayerScale` also grows the screens, up to twice the size on 4K. Turn this off with `screenScaling` in `Config > Visuals`. |

## Colours that aren't in the stylesheet

These colours mean something in the game, so they're set in Config instead:

| Colours | Where |
| :-- | :-- |
| Difficulties | [`Config > Towers`](./difficulties.md) |
| Rarities | `Config > Economy` |
| The Completions chart | `Config > Visuals.completions` |
| A rush's tower list | `Config > Visuals.towerRush` |
| Edit UI Layout's backdrop and guides | `Config > Visuals.layoutEditor` |
