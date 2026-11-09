# The Hub (Ring Select)

The hub is the place players join first. Its Ring Select screen shows your Worlds
and Areas, how far each player has got, and what's still locked. Players pick an
Area and press **Play** to go there.

Everything it shows comes from `Config > Worlds` and `Config > Towers`, so there's
nothing to fill in twice.

## Setting up the hub

1. Open `Ascent Hub.rbxlx`. Don't start the hub from a tower place: the two use
   different code.
2. Publish it into the same experience as your tower places, and make it the
   experience's **start place** in the Creator Dashboard.
3. Put its Place ID in `hubPlaceId` in `Config > Worlds`.
4. Check these settings:
   - `StarterGui > RingSelect`: `ResetOnSpawn` is off.
   - `Players`: `CharacterAutoLoads` is off.
   - In the Creator Dashboard, the hub's **server size** is `1`.

## Config > RingSelect

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `keys` | See [Controls](#controls) | The keys for each action, spelled the way `Enum.KeyCode` spells them. |
| `detailedProgress` | `true` | Whether new players start on the detailed progress view. |
| `progressMeter` | `"Choice"` | `"Choice"` lets players switch views. `"Simple"` or `"Detailed"` locks the view and hides the switch. |
| `saveSettings` | `true` | Whether the hub's settings are saved. |
| `beatenColor` | green | The colour of a beaten tower in the detailed progress view. |
| `notBeatenColor` | red | The colour of a tower the player hasn't beaten. |
| `hoverColor` | white | The outline on a tower while the player points at its bar. |
| `cameraFolder` | `"Rings"` | The Workspace folder that holds each Area's scenery. |
| `cameraPartName` | `"Camera"` | The name of the part the camera moves to. |
| `cameraTween` | 0.7 seconds | How the camera and lighting move between Areas. |
| `worldFade`, `worldHold` | `0.25`, `0.15` | The fade when switching Worlds. Set both to `0` for an instant cut. |
| `scrollTween` | 0.35 seconds | How the Area list scrolls. |
| `loadingScreen.minimumTime` | `1.5` | The shortest time, in seconds, the loading screen stays up. |
| `loadingScreen.tipInterval` | `5` | Seconds between loading tips. `0` keeps one tip. |

The hub's text is in the `ringSelect` and `loading` groups of `Config > Messages`.

### Controls

| Action | Default keys | Key setting |
| :-- | :-- | :-- |
| Previous or next World | `Q` and `E`, or `LeftButton` and `RightButton` | `worldBack`, `worldForward` |
| Previous or next Area | `←` and `→`, or `A` and `D` | `areaBack`, `areaForward` |
| Pick the Area or its subrealm | `↑` and `↓`, `W` and `S`, or `MainButton` and `SubButton` | `selectMain`, `selectSub` |
| Go to the Area, if it's unlocked | `Enter`, or `PlayButton` | `play` |

## The camera

Each Area gets a folder in the Workspace, named after its `id`, with a part the
camera moves to:

```text
Workspace
└─ Rings                  -- cameraFolder
   ├─ Ring1               -- the Area's id
   │  ├─ Camera           -- cameraPartName, any part
   │  ├─ Lighting         -- optional, see below
   │  ├─ ToNI             -- optional: a tower's frame, named after its acronym
   │  └─ ...your scenery
   └─ Ring1Sub
      └─ Camera
```

The camera copies the part's position and faces the way the part's front faces.
The Output names any Area that has no camera part.

### Aiming a camera

The [Ascent Setup plugin](./tower-setup-plugin.md) makes this easy:

1. Select a camera part and press **Look Through** to see what it sees. With
   nothing selected, it starts at the first Area's camera. Press it again to move
   to the next one.
2. Fly the Studio camera until the shot looks right.
3. Press **Aim Here** to move the camera part to your view.

**Cameras** shows or hides an arrow on each camera part. The frame drawn in front
of each camera is what a 16:9 screen shows.

## Lighting for each Area

Put a folder named `Lighting` in an Area's folder, and give it **attributes named
after Lighting properties**:

```text
Rings > Ring3 > Lighting
  ClockTime    2.5
  Ambient      Color3 30, 30, 50
  FogEnd       400
```

When the camera moves to that Area, the lighting changes to match. Anything you
leave out goes back to the place's own lighting.

## The screen

`StarterGui > RingSelect` is drawn by `ReplicatedStorage > Design`, the same
stylesheet as your tower places' menus. To change its colours or fonts, follow
[Styling](./styling.md) in any place, then copy `Design` into the others so they
match.

Each Area in the list is a card showing:

- the Area's `image`, or its place's thumbnail if it has none;
- its `emblem`;
- a padlock while it's locked.

A subrealm's card sits under its Area's, a little shorter. The arrows beside the
World's name go round: left from the first World goes to the last.

To show your game's logo above the list, set the `Image` of `LeftColumn > Logo`.
Without one, the list moves up to fill the space.

You can move, resize or restyle anything on the screen, but keep each part's
name. If the screen can't find a part it needs, the Output names it.

### Progress

There are two views. `progressMeter` in `Config > RingSelect` decides which one
players see, or lets them choose.

| View | Shows |
| :-- | :-- |
| **Simple** | One bar, such as `7/12`. Point at it to see the percentage. |
| **Detailed** | One strip with an outlined block per tower, easiest first, in its difficulty's colour. The thin bar under each block is red until the tower is beaten, green once it is, and yellow when it's beaten only in All Jumps. Pointing at a block shows its acronym above it and outlines the tower's frame in the scenery. |

- Only Normal wins count.
- Rushes and [extended](./ui-and-hud.md#extended-completions) towers don't count.
- When every tower in an Area is beaten, the bars under the blocks run through
  the rainbow, at `rainbowSpeed` in `Config > Visuals.completions`.

### Settings

The hub's settings button opens two settings:

- **Detailed Progress Meter** switches between the two progress views.
- **Music Volume** is the same setting as in your tower places.

### Sounds

The hub's sounds are Sounds in `SoundService > RingSelect`. Change a Sound's
`SoundId` or `Volume` to change it, or delete it for silence.

| Sound | Plays |
| :-- | :-- |
| `Button` | When a button is pressed. |
| `Hover` | When the pointer moves onto a button. The shipped hub doesn't have one. |
| `Switch` | When the camera moves to another Area, or the World changes. |
| `Music` | On a loop. Turn on `Looped` and `Playing` on it in Studio. |

### Loading screen

A loading screen covers the hub until the player's data loads, and again whenever
they teleport out. It shows a random tip from `ringSelect.tips`.

Its text is `loading.playerData`, `loading.teleportingTo` and `loading.teleporting`.
Don't put dots at the end of them, because the screen adds its own.

### Locked Areas

When the picked Area is locked, **Play** shows a padlock, and the screen lists what
the player still needs, one line per requirement:

```text
Beat ToDNE (1/1)
Beat 12 Towers (3/12)
Beat 2 Extreme+ Towers (1/2)
```

Lines the player has already met turn green. The wording is in the `locks` group
of `Config > Messages`.

### Friends and servers

**Friends** lists every friend who's playing, with a button showing their Area.
A friend in an Area the player hasn't unlocked is still listed, and pressing their
button says what's missing. The refresh button checks again, at most once every
five seconds. The text is the `friends` group in `Config > Messages`.

**Servers** has the [personal servers](./worlds-personal-servers.md#personal-servers)
for the Area on screen:

| Button | What it does |
| :-- | :-- |
| **Make Personal Server** | Makes one. Without the game pass, it opens the purchase prompt. Hidden while the pass has `id = 0`, unless personal servers are free. |
| **Enter Server Code** | Joins a personal server by its code. |
| **Join Last Server** | Takes an owner back to the personal server they left, if it's still open. |

## Troubleshooting

| Problem | Fix |
| :-- | :-- |
| The Output says there's no `StarterGui > RingSelect`. | The hub needs its own `RingSelect` ScreenGui. |
| The screen has no colours and the wrong font. | Copy `ReplicatedStorage > Design` in from one of your tower places. |
| The screen is empty. | Every Area in `Config > Worlds` is disabled or has `placeId = 0`. |
| The tower menus show up in the hub, or Ring Select shows up in a tower place. | The place was started from the wrong file. |
| Areas at the bottom of the list are cut off. | Set `AreaList`'s `AutomaticCanvasSize` to `Y`. |
| The screen never finishes loading. | `ServerScriptService > Server > HubServer` is missing. |
