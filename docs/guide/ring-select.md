# Ring Select

Ring Select is the hub: the place players join first, whose whole job is to show the map of your game and send them into it. They browse Worlds and Areas, see how far through each one they are and what is still locked, and hit Play.

It is a menu and nothing else — no towers, no HUD, no run timer. Every tower lives in a tower place, one per Area, and Return to Hub brings a player back here.

Everything it draws comes from `Config > Worlds` and `Config > Towers`. There is no second list to keep in step.

## Setting Up The Hub

1. **Make the hub its own place** in the same Roblox experience as your tower places, and make it the experience's **start place** in the Creator Hub. It has to be the same experience, or it cannot read the player's saved data.
2. **Put its Place ID in `hubPlaceId`** in `Config > Worlds`. That is where Return to Hub sends players.
3. **Start it from `Ascent Hub.rbxlx`**, which comes with the kit. It carries **only what the hub loads** — a small fraction of the kit's modules, so the Explorer holds the ring screen and nothing else — plus the whole of `Config`, so a `Config` you [share between places as a package](./configuration.md#sharing-config-between-your-places) is the same in the hub as everywhere else.
4. **Set three things in the hub:**

   - `StarterGui > RingSelect > ResetOnSpawn` to **false**. Left `true`, Roblox destroys and re-clones the screen on every respawn and the script loses track of it.
   - `Players > CharacterAutoLoads` to **false**. The screen binds WASD, so a character would walk about underneath it.
   - The place's **server size to 1**, on the Creator Dashboard. The hub is one player's own, and server size is the one setting Luau cannot make for you.

   The kit checks the last two on startup and says so in the Output window if either is wrong.

**What a place runs is decided by which file it was started from.** The hub's two entry scripts, `Server > HubServer` and `Client > HubClient`, exist only in `Ascent Hub.rbxlx`; the kit's towers, HUD and menus exist only in `Ascent Area.rbxlx`. There is no setting that switches one into the other, so there is no setting that can do it by mistake.

## Config > RingSelect

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `keys` | `table` | `Q E`, arrows, `WASD` | A **list** of key names per action, spelled as `Enum.KeyCode` spells them. An empty list unbinds the action; an unknown name is reported rather than ignored. |
| `detailedProgress` | `boolean` | `false` | Where a new player starts on the **Detailed Progress Meter** setting. Each player's own choice is saved once they flip it. |
| `beatenColor` | `Color3` | green | The status strip on a tower the player has beaten. |
| `notBeatenColor` | `Color3` | red | And on one they have not. |
| `cameraFolder` | `string` | `"Rings"` | The Workspace folder holding each Area's set. |
| `cameraPartName` | `string` | `"Camera"` | The part inside an Area's folder the camera flies to. |
| `cameraTween` | `TweenInfo` | 0.7s Quint Out | How the camera and the lighting move between rings. |
| `worldFade`, `worldHold` | `number` | `0.25`, `0.15` | Each half of the fade a World change happens behind, and how long the screen stays black between them. Both `0` for a hard cut. |
| `scrollTween` | `TweenInfo` | 0.35s Quad Out | How the Area list scrolls the picked ring to the top. |
| `loadingScreen.minimumTime` | `number` | `1.5` | Seconds the loading screen stays up at the least, so a fast load is not a flash. |
| `loadingScreen.tipInterval` | `number` | `5` | Seconds between tips. `0` shows one and keeps it. |
| `loadingScreen.dotInterval` | `number` | `0.4` | Seconds between steps of the loading dots. `0` stops them. |

The words the screen shows — the loading line, the tips, the Play button, `Total Beaten` — are in `Config > Messages` under `ringSelect`, with every other line a player reads.

### Controls

| Input | Effect |
| :-- | :-- |
| `Q` / `E`, and the `LeftButton` / `RightButton` arrows | Previous / next World |
| `←` / `→`, or `A` / `D` | Previous / next Area in this World |
| `↑` / `↓`, or `W` / `S` | The Area itself / its subrealm |
| Clicking a `MainButton` or `SubButton` | Picks that one directly |
| `Enter`, and the `PlayButton` | Teleports, if the Area is unlocked |

The two arrows sit either side of `WorldLabel`, so they move the World. Moving between Areas is the list itself — click a card, or use the left and right keys.

Both lists stop at their ends rather than wrapping round, and the Area list scrolls the picked ring to the top as you move.

Changing World happens behind a short black screen: two Worlds are two different sets, so the camera cuts rather than flying through whatever is between them, and the cut is covered. The lighting changes behind it too.

These keys are read straight from `Config > RingSelect` rather than through the kit's keybind system, because the hub runs neither the input context the actions live in nor the settings menu that would rebind one.

The screen also puts Roblox's own interface away — backpack, player list, chat, topbar — since all of it belongs to a game this place is not running. It comes back if the screen is ever torn down.

## The Camera

Each ring gets a folder in Workspace holding its build, plus one part the camera flies to. Picking an Area tweens there.

```
Workspace
  Rings                     <- cameraFolder
    Ring1                   <- the Area id from Config > Worlds
      Camera                <- cameraPartName, any BasePart
      Lighting              <- optional, see below
      ToNI                  <- optional: a tower's frame, named after its acronym
      ...scenery — the kit never touches it
    Ring1Sub
      Camera
```

`Rings` is `cameraFolder` in `Config > RingSelect`, named after EToH's rings. Call the folder something else — `Areas`, say — and set `cameraFolder` to match.

Folders are matched by Area `id`, so building a new ring is a folder named after the id you already wrote in `Config > Worlds`. A subrealm can have its own shot. One with no folder of its own leaves the camera where it was — its Area's shot, when the player stepped down from the Area above it — and the Output window says so once.

A place with no `Rings` folder keeps its ordinary camera and the screen still works. An Area with no camera part leaves the camera where it is and says so in the Output window.

## Lighting Per Ring

A ring can be lit differently from the rest. Put a folder called `Lighting` inside that Area's folder and give it **attributes named after Lighting properties**:

```
Rings > Ring3 > Lighting
  ClockTime    2.5
  Ambient      Color3 30, 30, 50
  FogColor     Color3 12, 10, 28
  FogEnd       400
```

It sits beside the camera part because a ring's look is part of the set you built, and this way you can see it while you build it — change an attribute and the screen picks it up next time that ring is selected.

Anything an Area does **not** mention goes back to what the place itself is lit with, captured once at startup. Otherwise leaving a dark ring would leave the next one dark with it.

The change tweens with the camera, using the same `cameraTween`, so the two move together — except across a World change, where the screen is black and the whole thing snaps.

An attribute that is not a Lighting property is named in the Output window and skipped, rather than costing the ring its other lighting.

## The Screen

The `RingSelect` ScreenGui is authored in Studio, like `MainMenu` and `TowerGUI`. The kit attaches to the names below and leaves everything else — layout, colours, fonts, corners — to you.

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
  SettingsButton                 GuiButton   <- opens and closes Settings
  Settings                       Frame
    DetailedProgress             Frame
      ToggleButton               TextButton
        Circle                   Frame       <- the part that slides
  LoadingScreen                  Frame       <- optional
    LoadingLabel                 TextLabel
    TipLabel                     TextLabel
```

`AreaFrame` and `DifficultyBar` are templates. They stay visible in Studio so you can style them, and the screen hides the originals and clones one per Area and per tower at run time. Every clone carries an `AscentGenerated` attribute and is swept before a redraw, so your authored instances are never destroyed.

Each button **is** the Area, so its own `Image` is the place picture: `image` from `Config > Worlds`, or the destination place's live Roblox thumbnail when you have not set one. `AreaEmblem` inside it is that Area's `emblem` — the same small icon its towers carry on the Completions chart — and hides itself on an Area that has none.

`SubButton` is hidden on a row whose Area has no subrealm after it. A row has one `SubButton`, so a second subrealm listed under the same Area is not drawn, and the Output window names it.

### Progress

`AreaProgress` and `DetailedProgress` are two readings of the same numbers, and one shows at a time:

- **`AreaProgress`** is a single bar. `Fill` stretches to the fraction beaten, and `CurrentProgress` reads `7/12`. Hover it and it adds the percentage to one place, rounded down so a ring one short never reads 100 — `7/12 (58.3%)`, `0/15 (0.0%)`. The Completions menu writes its percentages the same way.
- **`DetailedProgress`** is one `DifficultyBar` per tower in the Area, easiest first, coloured by difficulty with a darkened stroke. Each bar's `Status` strip is green or red depending on whether that tower is beaten. Hover a bar and its `HoverTower` label names the tower, in the same colour, and the tower's frame in the ring behind the screen is outlined in white: the Model or part named after its acronym anywhere in that Area's folder under `Rings`. A tower with no frame is simply not outlined.

Which one shows is each player's own choice, the **Detailed Progress Meter** in the screen's Settings, and it is saved. Whichever way you left the two frames in Studio does not matter — the screen sets both.

A ring with more towers than the template has room for narrows every bar so the row still fits, rather than running off the edge of the screen. A ring with fewer keeps the bars the width you drew them. The `HoverTower` label is widened back up on a narrowed bar, so the acronym is the same size whatever the ring.

A tower counts as beaten if it has been cleared in **either** mode. Tower rushes are left out of both the count and the bars: a rush is listed beside the towers it strings together, so counting it would count the same climbs twice.

`TotalBeaten` is the same count across every Area of every World.

### Settings

`SettingsButton` opens and closes `Settings`, with the same slide the kit's other menus use. Its one row, the **Detailed Progress Meter**, is a switch built the same way as the settings menu's: a `TextButton` with a `Circle` inside that slides across.

The choice is saved like any other setting — it goes to `Server > Settings`, which checks it before writing it — so it follows the player to every server of the hub. The switch moves the moment it is clicked and the saved value comes back to confirm it. A new player starts where `detailedProgress` in `Config > RingSelect` says.

### Loading Screen

`LoadingScreen` covers everything from the moment the screen is drawn until the player's saved data has arrived and the place around it has loaded, then fades out through black. It stays up for `loadingScreen.minimumTime` at least, so a fast load is not a flash, and nothing on the screen underneath responds until it is gone.

It comes back for every teleport out of the hub — Play, a friend, a personal server, a code — from the moment the server starts it, reading `ringSelect.teleporting` with the tips going round. Roblox is handed a still copy of it to show between the two places, so the player sees your screen the whole way rather than Roblox's. A teleport that fails takes it down again, after the same `minimumTime`, and only then says why.

`LoadingLabel` reads `ringSelect.loading` from `Config > Messages` with animated dots after it. Leave the dots off your own wording. The line holds its size while they animate — the missing dots are there but invisible — which matters because a `TextScaled` label would otherwise shrink and grow with each step.

`TipLabel` shows one of `ringSelect.tips`, a new one every `tipInterval` seconds and never the same one twice in a row. With no tips it hides itself.

It is optional: a place without a `LoadingScreen` shows the ring screen straight away, and covers nothing on a teleport.

A tower place does the same with its own loading screen, the one in `TowerGUI`, which reads `teleports.teleporting` while a player is on their way anywhere — the Teleport menu, Rejoin, Return to Hub, or a personal server closing.

::: tip StarterGui, not ReplicatedFirst
Keep the loading screen inside `RingSelect`. `ReplicatedFirst` is for covering the moments *before* any of your scripts run, while the place itself downloads — and Roblox's own loading screen already covers those. What this screen waits for is the player's data, which only starts loading once the scripts are running, and it reads its tips from `Config`, which a `ReplicatedFirst` script cannot rely on having arrived yet.

If you want to replace Roblox's own loading screen too, that is a separate script in `ReplicatedFirst` calling `RemoveDefaultLoadingScreen()` — and it can hand straight over to this one.
:::

### Locked Areas

`Requirements` appears only when the picked Area is locked, and lists every rule in its `requirements` in `Config > Worlds`, one line each, cloned from `AreaReqLabel` into `RequirementsList`:

```
Beat ToDNE (1/1)
Beat 12 Towers (3/12)
Beat 2 Extreme+ Towers (1/2)
```

Each line says how far along the player is. A rule already met is drawn in `beatenColor` from `Config > RingSelect` — green, as on the progress bars — and a difficulty's name is drawn in that difficulty's colour, so the line is set to `RichText` whatever the template says. A difficulty rule counts every tower of that difficulty **or harder**. The wording is `locks` in `Config > Messages`, the same lines the Teleport menu in your tower places shows one at a time. Play refuses a locked Area and leaves the list up.

The lines are sized by the template. If it is `TextScaled`, a short line comes out bigger than a long one; a `UITextSizeConstraint` in `AreaReqLabel` evens them out.

This screen has no notification holder, so anything the server says — a teleport cooldown, a refusal, data still loading — takes the lines' place for a few seconds, and then the lines come back. While one of the [lists](#friends-and-servers) is open, it goes in that list's `Warning` instead.

Nothing here is a permission. The client refuses a locked Area so the player is told why; the server checks again before it moves anyone.

### Friends And Servers

`FriendButton` and `ServerButton` open `Lists` on one of its two lists. Pressing the same button again closes it, and pressing the other switches over. The whole group is optional: a hub without the two buttons and `Lists` has neither list, and once `Lists` is there the Output names any part of it that is missing.

**The friend list** is every friend playing one of your Areas right now. `FriendFrame` is the row template, hidden and cloned once per friend: `PlayerImage` is their headshot, `PlayerDisplayName` their display name, and `JoinButton` is named after the Area they are in — `Ring 1: Limbo`. Clicking it sends the player into that friend's server, the same way the Teleport menu's Join Friend tab does in a tower place.

A friend in an Area the player has not unlocked is listed anyway, since the list is who is playing. Joining them says what is missing instead, in the same words as a locked Area.

The list is read when it opens, and again on `RefreshButton`, which shows only with the friend list. Reading it is a web request, so a second press within five seconds keeps the rows it has.

`Warning` in the list shows only when there is something to say: that nobody is playing (`friends.nonePlaying` from `Config > Messages`), that the list could not be read, or what went wrong with a join — a locked Area, or the server's answer. It is hidden while the list has friends and nothing has gone wrong, and reopening the list clears an old answer. It takes its place among the rows by its `LayoutOrder`; the rows are numbered from 1, so `0` puts it on top.

**The server list** is about [personal servers](./worlds-personal-servers.md#personal-servers), for the Area on screen:

- **`CreateServer`** makes a personal server in that Area and sends the player to it. Without the Personal Servers pass its text gains `ringSelect.requiresPass` — `(Requires Gamepass)` — and it draws darker, and clicking it opens the pass's purchase prompt instead. Buying the pass brings it back to normal without a rejoin. It is hidden when `PersonalServers` in `Config > GamePasses` has `id = 0`.
- **`EnterServerCode`** swaps the list for `JoinServerFrame`, where a player types or pastes a share code into `CodeBox` and presses `Join` or Enter. `Cancel` swaps back.
- **`JoinLast`** takes the player back to the personal server they owned and left. It shows only while that server is still open — for `ownerLeaveGracePeriod` after the owner leaves, ten minutes by default — and going back calls off the countdown that would close it.

`Warning` under the code box shows only when there is something to say about the code: that it is not a code at all, before anything is sent, or the server's answer — expired, invalid, or an Area still locked. While `JoinServerFrame` is closed, those answers go to `Requirements` instead.

The server checks an Area's requirements before it sends anyone anywhere, a code included, so a code does not get round a lock.

## Troubleshooting

**Nothing draws, and the Output says the place has no `StarterGui > RingSelect`.** The ScreenGui is Studio-authored and the kit never creates it. Check it exists in the hub itself; the kit never copies it from anywhere else.

**The screen is empty and the Output says Config has no playable World.** Every Area in `Config > Worlds` is disabled or has `placeId = 0`.

**The kit's menus and HUD appear in the hub, or the ring screen in a tower place.** The place was started from the wrong file, or has scripts copied in from the other one. The hub's `Server`, `Client` and `Shared` are a cut-down set of a tower place's, so the two cannot share them. Start the hub from `Ascent Hub.rbxlx` and every tower place from `Ascent Area.rbxlx`.

**The Area list never scrolls, and rings past the bottom edge are missing.** `AreaList` has no canvas to scroll. Set its `AutomaticCanvasSize` to `Y` so it grows with the rows put in it; the Output window says so too.

**The client never finishes starting.** The hub needs its server half too — `Server > HubServer` is what creates the networking remotes the client waits for.
