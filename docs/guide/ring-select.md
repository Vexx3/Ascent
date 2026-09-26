# Ring Select

Ring Select is the hub: the place players join first. It shows your Worlds and Areas, how far through each the player is and what is locked, and sends them in with Play. It has no towers, HUD or timer. Return to Hub brings players back here.

Everything it shows comes from `Config > Worlds` and `Config > Towers`.

## Setting Up The Hub

1. **Make the hub a place in the same experience** as your tower places, and make it the **start place** in the Creator Hub. A place in another experience cannot read the player's save.
2. **Put its Place ID in `hubPlaceId`** in `Config > Worlds`.
3. **Start it from `Ascent Hub.rbxlx`.** It holds only the code the hub needs, plus the whole of `Config`.
4. **Set three things:**
   - `StarterGui > RingSelect > ResetOnSpawn` to **false**.
   - `Players > CharacterAutoLoads` to **false**.
   - The place's **server size to 1**, on the Creator Dashboard.

   The Output says so on startup if either of the last two is wrong.

::: warning Hub and tower places are different files
Start the hub from `Ascent Hub.rbxlx` and every tower place from `Ascent Area.rbxlx`. Their scripts are not interchangeable, and copying one into the other breaks both.
:::

## Config > RingSelect

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `keys` | `Q E`, arrows, `WASD` | Key names per action, as `Enum.KeyCode` spells them. An empty list unbinds the action. |
| `detailedProgress` | `false` | Whether a new player starts on the Detailed Progress Meter. |
| `beatenColor` | green | A beaten tower's strip, and a met requirement. |
| `notBeatenColor` | red | An unbeaten tower's strip. |
| `cameraFolder` | `"Rings"` | The Workspace folder holding each Area's set. |
| `cameraPartName` | `"Camera"` | The part in an Area's folder the camera flies to. |
| `cameraTween` | 0.7s Quint Out | How the camera and lighting move between rings. |
| `worldFade`, `worldHold` | `0.25`, `0.15` | The fade a World change hides behind. Both `0` for a hard cut. |
| `scrollTween` | 0.35s Quad Out | How the Area list scrolls. |
| `loadingScreen.minimumTime` | `1.5` | Least seconds the loading screen stays up. |
| `loadingScreen.tipInterval` | `5` | Seconds between tips. `0` keeps one. |
| `loadingScreen.dotInterval` | `0.4` | Seconds between loading dots. `0` stops them. |

The screen's words are under `ringSelect` in `Config > Messages`.

### Controls

| Input | Effect |
| :-- | :-- |
| `Q` / `E`, `LeftButton` / `RightButton` | Previous / next World |
| `←` / `→`, `A` / `D` | Previous / next Area |
| `↑` / `↓`, `W` / `S` | The Area / its subrealm |
| Clicking `MainButton` or `SubButton` | Picks it |
| `Enter`, `PlayButton` | Teleports, if unlocked |

## The Camera

Each Area gets a folder in Workspace, named after its `id`, with a part the camera flies to:

```
Workspace
  Rings                     <- cameraFolder
    Ring1                   <- the Area id
      Camera                <- cameraPartName, any BasePart
      Lighting              <- optional, see below
      ToNI                  <- optional: a tower's frame, named after its acronym
      ...your scenery
    Ring1Sub
      Camera
```

To call the folder something else, rename it and set `cameraFolder` to match. Without the folder, the camera stays where it is and the screen still works. The Output names any Area missing its camera part.

## Lighting Per Ring

Put a folder called `Lighting` in an Area's folder and give it **attributes named after Lighting properties**:

```
Rings > Ring3 > Lighting
  ClockTime    2.5
  Ambient      Color3 30, 30, 50
  FogEnd       400
```

Anything an Area leaves out goes back to the place's own lighting. The change moves with the camera. The Output names an attribute that is not a Lighting property.

## The Screen

`StarterGui > RingSelect` is yours to lay out. The kit only looks for these names:

```
RingSelect                       ScreenGui
  LeftBar                        Frame
    AreaList                     ScrollingFrame
      AreaFrame                  Frame       <- the row template
        MainButton               ImageButton <- its Image is the place picture
          AreaName               TextLabel
          AreaEmblem             ImageLabel
        SubButton                ImageButton
          AreaName               TextLabel
          AreaEmblem             ImageLabel
    WorldLabel                   TextLabel
    LeftButton                   GuiButton   <- previous World
    RightButton                  GuiButton   <- next World
    PlayButton                   GuiButton
  TopRightBar                    Frame
    AreaProgress                 Frame
      Fill                       Frame
      CurrentProgress            TextLabel
    DetailedProgress             Frame       <- horizontal UIListLayout
      DifficultyBar              Frame       <- the bar template
        Status                   Frame
        HoverTower               TextLabel
    FriendButton                 GuiButton   <- optional, with the two below
    ServerButton                 GuiButton
    Lists                        GuiObject
      FriendList                 ScrollingFrame
        FriendFrame              GuiObject   <- the row template
          PlayerImage            ImageLabel
          PlayerDisplayName      TextLabel
          JoinButton             GuiButton
        Warning                  TextLabel
      RefreshButton              GuiButton
      ServerList                 Frame
        CreateServer             TextButton
        EnterServerCode          GuiButton
        JoinLast                 GuiButton
      JoinServerFrame            Frame
        CodeBox                  TextBox
          Join                   GuiButton
          Cancel                 GuiButton
        Warning                  TextLabel
  Requirements                   Frame
    RequirementsList             GuiObject   <- a UIListLayout inside
      AreaReqLabel               TextLabel   <- the line template
  TotalBeaten                    TextLabel
  SettingsButton                 GuiButton
  Settings                       Frame
    DetailedProgress             Frame
      ToggleButton               TextButton
        Circle                   Frame
  LoadingScreen                  Frame       <- optional
    LoadingLabel                 TextLabel
    TipLabel                     TextLabel
```

Templates (`AreaFrame`, `DifficultyBar`, `FriendFrame`, `AreaReqLabel`) stay visible in Studio so you can style them. The screen hides them and clones one per entry.

A button's `Image` is the Area's `image` from `Config > Worlds`, or the place's own thumbnail. `AreaEmblem` is the Area's `emblem`, hidden when it has none. `SubButton` hides on an Area with no subrealm after it.

### Progress

One of the two shows, by the player's **Detailed Progress Meter** setting:

- **`AreaProgress`**: one bar reading `7/12`. Hover it for the percentage, to one decimal place: `7/12 (58.3%)`.
- **`DetailedProgress`**: one bar per tower, easiest first, in its difficulty colour, with `Status` green when beaten. Hovering a bar shows `HoverTower` and outlines the tower's frame in white: the Model or part named after its acronym in the Area's folder under `Rings`.

A crowded ring narrows its bars to fit. A tower beaten in either mode counts. Tower rushes don't count. `TotalBeaten` counts every Area.

`SettingsButton` opens `Settings`, which holds the Detailed Progress Meter switch. The choice is saved.

### Loading Screen

`LoadingScreen` covers the screen until the player's data has loaded, for at least `minimumTime`. `LoadingLabel` reads `ringSelect.loading` with animated dots (leave the dots off your own wording). `TipLabel` shows a random tip from `ringSelect.tips` every `tipInterval` seconds.

It comes back for every teleport out of the hub, reading `ringSelect.teleporting`. A copy of it stays on screen during the teleport itself. If the teleport fails, it goes away and the reason is shown.

Without a `LoadingScreen`, the hub shows the screen straight away. Tower places do the same with the loading screen in `TowerGUI`.

### Locked Areas

When the picked Area is locked, `Requirements` lists each of its rules as a line cloned from `AreaReqLabel`:

```
Beat ToDNE (1/1)
Beat 12 Towers (3/12)
Beat 2 Extreme+ Towers (1/2)
```

Met rules are drawn in `beatenColor`, and a difficulty in its own colour. A difficulty rule counts that difficulty **or harder**. The wording is `locks` in `Config > Messages`.

If `AreaReqLabel` is `TextScaled`, short lines come out bigger than long ones. A `UITextSizeConstraint` inside it evens them out.

Messages from the server, such as a refusal or a cooldown, replace the lines for a few seconds. While a [list](#friends-and-servers) is open, they go to that list's `Warning` instead.

### Friends And Servers

`FriendButton` and `ServerButton` open `Lists` on one list or the other. Pressing the same button again closes it. All of it is optional.

**Friend list.** One row per friend playing your game, cloned from `FriendFrame`: headshot, display name, and a `JoinButton` named after their Area. Clicking it joins their server. A friend in a locked Area is listed, and joining says what is missing. `RefreshButton` reads the list again, at most every five seconds.

`Warning` shows when there are no friends playing (`friends.nonePlaying`), the list could not load, or a join went wrong. Its `LayoutOrder` places it among the rows; `0` puts it on top.

**Server list.** [Personal servers](./worlds-personal-servers.md#personal-servers) for the Area on screen:

- **`CreateServer`** makes one and sends the player there. Without the Personal Servers pass it reads `(Requires Gamepass)`, draws darker, and opens the purchase prompt. It is hidden while the pass has `id = 0`.
- **`EnterServerCode`** opens `JoinServerFrame`. Type a code into `CodeBox` and press `Join` or Enter. `Cancel` goes back.
- **`JoinLast`** returns an owner to the personal server they left, while it is still open (`ownerLeaveGracePeriod`, ten minutes by default).

`Warning` under the code box says why a code did not work.

The server checks every requirement again before any teleport, codes included.

## Troubleshooting

**The Output says there is no `StarterGui > RingSelect`.** The hub needs its own `RingSelect` ScreenGui.

**The screen is empty and the Output says there is no playable World.** Every Area in `Config > Worlds` is disabled or has `placeId = 0`.

**Tower menus appear in the hub, or the ring screen in a tower place.** The place was started from the wrong file. See [Setting Up The Hub](#setting-up-the-hub).

**Rings past the bottom of the list are missing.** Set `AreaList`'s `AutomaticCanvasSize` to `Y`.

**The client never finishes starting.** `Server > HubServer` is missing from the hub.
