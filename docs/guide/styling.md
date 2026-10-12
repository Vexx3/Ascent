# Styling the Menu & HUD

One stylesheet draws the main menu and the tower HUD, using Roblox's [universal styling](https://create.roblox.com/docs/ui/styling). Change a colour once and both screens follow it. Edit during a Studio playtest and you see the change live.

## Where the Look Lives

```text
ReplicatedStorage
└─ Design
   ├─ TokenSheet      -- fonts, text sizes, corners, spacing, control sizes, animation timings
   ├─ Themes
   │  └─ Default      -- every colour, and how see-through things are
   └─ AscentStyle     -- the rules: which part of a screen gets which token
```

`StarterGui > MainMenu` and `StarterGui > TowerGUI` each hold a `StyleLink` pointing at `AscentStyle`. `AscentStyle` derives from `Themes > Default`, and the theme derives from `TokenSheet`. That is the layout Roblox's Style Editor builds, so the editor works on it as it is.

Updating the kit means copying the whole `Design` folder along with the two screens. Without it they draw unstyled, and the Output says so when the server starts.

## Changing Colours

Open **UI → Style Editor**, choose `Themes > Default`, and edit a token. Everything that names it changes at once.

| Token | Paints |
| :-- | :-- |
| `Base` | The menu window, dialogs, panels and toasts. |
| `Surface` | Cards and boxes. |
| `Raised` | Completions tower rows, tooltips, and a card under the pointer. |
| `Track` | Text boxes, and the shade behind a dialog. |
| `Shade` | The darkening over an Area's picture. |
| `HudBase` | The HUD's pills and on-screen buttons. |
| `Overlay` | The light layer on rows, hovered and pressed buttons, fills and borders. |
| `Text`, `TextMuted`, `TextDim` | Text, quieter text, and the quietest: captions and section headings. |
| `TextStroke` | The outline drawn round HUD text. |
| `Accent` | The primary button, slider fills, and the Practice and All Jumps badges. |
| `Positive`, `Danger`, `Info` | Done and go, failure, and the Practice and All Jumps labels on the HUD. |
| `On`, `Off`, `Thumb` | Toggles, and the slider's knob. |
| `Tickets` | Ticket counts and prices. |
| `Locked` | A button for something the player cannot do yet. |

How see-through things are is a ladder of tokens, so hover and press stay in step everywhere:

| Token | Is |
| :-- | :-- |
| `BaseTransparency`, `HudTransparency` | The window's and the HUD's backgrounds. `0` is solid. |
| `RowTransparency` | The `Overlay` layer behind a settings row or a stat box. |
| `HoverTransparency` | A plain button or tab under the pointer. |
| `FillTransparency` | A resting button, a toggle's track, the open menu's button. |
| `FillHoverTransparency`, `PressTransparency` | That button under the pointer, and pressed. |
| `SolidHoverTransparency`, `SolidPressTransparency` | A solid button, like Enter or Buy, under the pointer and pressed. |
| `BorderTransparency` | Hairlines and dividers. |
| `ShadeTransparency`, `TextStrokeTransparency` | The shade over a picture, and text outlines. |

A few rules keep a theme readable, and the shipped one follows them:

- **No pure black base.** Use a dark grey. White text on pure black smears, and black leaves no darker shade for depth.
- **Lighter means closer.** Each surface sits a step lighter than the one under it, which is how a dark theme shows what is on top.
- **Colour only for what matters.** The accent marks what is chosen and what to press, and green and red mean done and failed. Everything else is grey.
- **Keep contrast high.** Make text easy to read on every surface it sits on.
- **Don't rely on colour alone.** Toggles also say `ON` and `OFF`, and locked buttons say `Locked`. Colour-blind players read the words.

## A Second Theme

Duplicate `Default` inside `Themes`, rename it, and change its colours. Every theme needs the same tokens, so edit values rather than deleting any.

To switch, select `AscentStyle` and change what it derives from in the Style Editor, or from a script:

```luau
local Design = game:GetService("ReplicatedStorage").Design
Design.AscentStyle:SetDerives({ Design.Themes.Night })
```

## Sizes, Fonts and Motion

These are in `TokenSheet` and are shared by every theme.

| Token | Is |
| :-- | :-- |
| `Font`, `FontBold` | Builder Sans, Roblox's UI font, at Medium and Bold. |
| `FontMono` | The timer's digits, Roboto Mono, so they don't shift as they tick. |
| `TextTitle`, `TextHeading`, `TextBody`, `TextSmall`, `TextCaption`, `TextTimer` | Text sizes. |
| `Radius`, `RadiusSmall`, `RadiusTiny`, `RadiusRound` | Corner rounding: windows and cards, small controls, badges, and pills. |
| `Pad`, `PadSmall` | Inner spacing. |
| `StrokeThickness` | Every hairline. |
| `NavButtonSize`, `RowSize`, `ToggleSize`, `ArrowSize`, `KeybindSize`, `TowerRowSize` | Control sizes. Each has a `…Touch` twin, used on phones and tablets. |
| `Quick`, `Smooth` | How long hover and selection changes take to animate. |

Fonts are set through `FontFace`, never the old `Font` property, and none of them is a removed font (Arial, Gotham).

## The Rules

`AscentStyle` holds one group per part of the screens, named for the tag it styles. That part's own pieces and states sit inside its group, so everything about a toggle is under `.Toggle`:

```text
.Toggle            -- the switch itself: OFF, grey
├─ ::UICorner      -- its rounding
├─ :Hover          -- under the pointer
├─ .On             -- switched on: ON, in the On colour
└─ :NonInteractable
```

Top to bottom, the groups are:

1. class defaults (`Frame`, `TextLabel` and the rest);
2. text roles (`.Title`, `.Caption` and the rest);
3. the window, its side buttons and its tabs;
4. buttons;
5. settings rows and their controls;
6. cards, bars and stat boxes;
7. what floats over the menu: tooltips, dialogs and toasts;
8. Completions;
9. the HUD;
10. last, `@PreferredInputTouch` for phones and tablets, and `@ViewportDisplaySizeSmall` for small screens.

A rule's name is only a label. What matters is its `Selector` and its `Priority`.

::: warning Priority works per group
A rule inside a group outranks only the rules in that same group. Against any other group, the two groups' own priorities decide. Two groups at the same priority have no reliable order: it can differ between Studio and a player's game.

So keep everything that styles one part inside that part's group. If two groups must style the same thing, give the one that should win a higher `Priority`.
:::

Settings rows lay themselves out. The name takes whatever room the control beside it leaves, so a short control never costs a long name its words. A row of your own needs only the `Row` tag on the frame and `RowLabel` on its name.

## Tags

Every part of the two screens carries a **role** tag (Properties → Tags), such as `NavButton`, `Tab`, `Row`, `Toggle`, `Card`, `PrimaryButton`, `Tooltip` or `HudPanel`. The rules select by these tags. To make something of your own look like the kit's, give it the same tag.

While the game runs, the kit adds **state** tags, and the rules draw them:

| Tag | On | Means |
| :-- | :-- | :-- |
| `Selected` | Side buttons and tabs | The open menu or tab. |
| `Active` | Practice and All Jumps; the Spectate and checkpoint buttons | The mode is on, or the panel is open. |
| `On` | Toggles | Switched on. |
| `Locked` | An Area's buttons; cosmetic cards | Not open to this player yet. |
| `Equipped` | Cosmetic cards | Being worn. |
| `Affordable` | Buy buttons | The player has the tickets. |
| `Current` | Area cards | The place the player is in. |
| `Error`, `Success` | Notifications | Something failed or worked. |

## When a Change Doesn't Show

A property set on the element itself beats the stylesheet. Studio marks a styled property with ⚠ in the Properties window. To hand a property back to the stylesheet, right-click it and choose **Reset to Default**.

## The Player's Own Settings

The screens follow the player, as Roblox's [accessibility guide](https://create.roblox.com/docs/production/publishing/accessibility) asks:

- **Background Transparency**, Roblox's setting: `BaseTransparency` and `HudTransparency` are multiplied by it, so a player who wants solid menus gets them.
- **Reduce Motion**, Roblox's setting or the kit's own in Settings > Visual: `Quick` and `Smooth` become instant, menus appear without sliding or growing, toasts arrive without sliding, and sliders land without gliding.
- **UI Scale**, in Settings > Visual, from 0.5x to 1.5x: each screen holds a `UIScale` named `PlayerScale` that the setting turns. It sits on the ScreenGui itself, so the window keeps its share of the screen while text and controls grow or shrink.

The kit looks up `BaseTransparency`, `HudTransparency`, `Quick` and `Smooth` by name, so keep those four in every theme.

## What Isn't Here

Colours that mean something in the game stay in Config:

- difficulty colours, in [`Config > Towers`](./difficulties.md);
- rarity colours, in `Config > Economy`. A shop or cosmetic card takes its rarity on its outline and name;
- the Completions chart's beaten colours, in `Config > Visuals.completions`;
- a rush's tower list, in `Config > Visuals.towerRush`;
- the hub's sliding toggles, in `Config > Visuals.menu`.
