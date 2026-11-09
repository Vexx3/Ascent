# Changelog

What to do by hand for each release is in [Updating Ascent](https://kiels.dev/Ascent/guide/updating).

## [Unreleased]

### Added

- [Modifiers](https://kiels.dev/Ascent/guide/modifiers): start a tower or rush with any of twelve run modifiers that change its tickets and Elo. Off until you set `enabled = true`.
- [Saved Runs](https://kiels.dev/Ascent/guide/saved-runs): save an All Jumps run to a slot and carry it on later, in any place, with an optional Auto Save. Off until you set `savedRuns.enabled = true`.
- [Leaderboards](https://kiels.dev/Ascent/guide/ui-and-hud#leaderboards-menu) menu: Towers, All Jumps and Elo, plus the fastest time on every tower and rush. `leaderboardsEnabled = false` in `Config > Project` removes it.
- [Far messages](https://kiels.dev/Ascent/guide/announcements-webhooks#far-messages): chat, and optionally Discord, says when a Normal run ends far up a hard tower.
- Lag free personal servers, which keep only the towers the owner names, and free personal servers (`personalServers.free`).
- [Goal badges](https://kiels.dev/Ascent/guide/badges#goal-badges): badges for a number of towers, a difficulty or harder, named towers, a whole Area, All Jumps wins, an Elo or time in one sitting (`goalBadges` in `Config > Towers`).
- A [Credits](https://kiels.dev/Ascent/guide/ui-and-hud#credits) page, opened from the ⓘ button by the X and filled from `Config > Credits`, ending with a "Made with Ascent" line you can turn off (`showAscent`).
- New personal bests are announced, and hovering the timer shows your best.
- Completions shows your total tower playtime and, in a tower's details, how long until it pays tickets again.
- Tower warnings, such as for flashing lights, from `warning` in `Config > Towers`.
- Checkpoints also put back boosts, keys, morphers and pushboxes, each with a setting to switch it off.
- The menu asks before Restart Run, Exit Tower, Rejoin, Return to Hub, a mode switch and Reset UI Layout, with a Confirmations setting to turn that off.
- Settings: Restart Key, Keyboard Overlay, UI Scale, Reduce Motion, Show Spectator Count, Win Messages and Disable Progress Message.
- Keys for the menu, spectate, the checkpoint panel and Reset Objects, spectate keys, and controller buttons for Quick Restart and All Jumps.
- Every keybind can be reset or unbound, controller buttons show as Roblox's own pictures, and picking a key another action uses says so.
- Edit UI Layout on a computer, saved apart from a phone's layout, and a control's size snaps to match another's.
- A restart button on phones.
- The menu and HUD grow on screens bigger than 1080p (`screenScaling`).
- The FPS keys say what they set, and can skip rates a player marks.
- Clicking the timer hides it.
- Hooks: `Events.runEnded`, `AccountData.read(player)`, and `personalBest` and `modifiers` on `towerWon` and `rushWon`.
- The Output and the plugin name a checkpoint more than 50 studs outside its tower.
- The Output says which version of Ascent each server runs.
- The folders you edit, such as `Config`, `Towers` and `TowerCheckpoints`, have an orange icon in the Explorer.
- [Switches](https://kiels.dev/Ascent/guide/configuration#turning-features-on-and-off) to turn off Elo as a whole (`Config > Elo.enabled`) and personal servers (`personalServers.enabled` in `Config > Worlds`).
- The ring select has a spot for your game's logo, a padlock on locked Areas, and World arrows that go round, keeps clear of Roblox's own buttons, and follows your UI Scale and Reduce Motion settings.
- The ring select's Area Progress is one strip of outlined difficulty colours, with a red or green bar under each tower that runs through the rainbow once the Area is beaten, and is the view new players start on.
- Plugin: **Print a report for support** in the Check window, with your version, any kit scripts you've edited, what the plugin found, and the last playtest's errors.
- A tower can have any number of signs, and a sign can be anything with a colour, such as a model, a Highlight, a light, a text label or particles, with its own colours if you like.
- Plugin: a **New tower** form, **Rename** for a tower and everything named after it, and **Add portal**.
- Plugin: every problem it finds has a button to fix it, show it, or open the Config script to change.
- Plugin: the Check window walks you through installing the kit's code, and **Move into place** puts each package where it belongs.

### Changed

- **Breaking:** `Config` is at `ReplicatedStorage > Config`, beside `Shared` rather than inside it, so an update replaces `Shared` whole.
- **Breaking:** the screens are rebuilt. `MainMenu` and `TowerGUI` must be replaced, and `StarterGui > HUD` and `ReplicatedStorage > Design` copied in.
- **Breaking:** the hub's ring select is rebuilt in the same style as the menu, drawn by `Design`. Replace `StarterGui > RingSelect` and copy `ReplicatedStorage > Design` into the hub.
- **Breaking:** the code requires `Config > Modifiers` and `Config > Credits`, and a Config without them stops the place starting.
- **Breaking:** the Practice tools are named `Noclip`, `Heal` and `Godmode`.
- **Breaking:** the kit's code comes as Roblox packages for buyers, installed from the Toolbox, and most updates arrive by themselves. The downloaded places hold everything else.
- `fake-win` takes a tower from Config instead of a typed ending name and a difficulty.
- The plugin's Towers window is a list you can search, and a tower's page shows its to-do list above sections that open and close.
- The plugin's windows update themselves after a change, and its messages are shorter and plainer.
- The plugin is installed from the [Creator Store](https://create.roblox.com/store/asset/133971753175712/Ascent-Setup) and updates there, and the Check window says whether the place or the plugin is behind.
- A new look for the menu and HUD, drawn by [one stylesheet](https://kiels.dev/Ascent/guide/styling), with outline icons, coloured tabs and padlocks for anything locked.
- A new game starts simple: Elo and the shop's daily items ship off (`shop.featured.enabled`), and the shipped `dataStoreKey` is `ASCENT_STABLE`. Your own Config keeps its settings.
- Buttons, switches, sliders and dropdowns are dark with coloured words rather than bright fills, shop cards fade to their rarity colour, and the timer and notifications are plainer.
- Ascent is under a paid licence rather than zlib: use it in your own games, but do not share or resell it.
- The timer starts once the tower is built, so a `minimumTime` set very close to the fastest climb may want lowering.
- The menu's pages are tabs along the top, with the run's actions in a bar underneath. Rejoin and Return to Hub moved to the Teleport page.
- The HUD is its own ScreenGui, and keeps clear of Roblox's controls on every screen.
- Settings are regrouped and renamed: Restart Key, Hold Time, Truss Fix, Reset Objects, and Misc is now Chat.
- Settings with a choice are dropdowns. FPS Display is now Performance Stats, with FPS, Ping and Show Labels.
- The Teleport page has one Personal Server switch and one Servers tab, and Settings no longer has a Personal Server tab.
- Completions sorts and looks up players from its own page.
- A tower's details in Completions are a table with a close button, over a shaded chart.
- Personal servers use Roblox's new reserved server IDs. Share codes made before updating stop working.
- Times read `0:37.95` rather than `00:37.95`.
- Spectate is a slim bar, and the spectate and checkpoint panels take turns.
- A tower rush has no Practice mode.
- Winpads flash on each player's own screen, so two players can see different colours.
- Scribe 2.6.1, TopbarPlus 3.5.0 and Purse 1.2.0.
- The kit's own code uses generalized iteration and carries far fewer comments. `Config` keeps all of its comments.

### Removed

- `menu`, `shopBuyButton`, `layoutEditor.panel`, `layoutEditor.text` and `timing.settingsToggle` from `Config > Visuals`, and `selectedTransparency`, `unselectedTransparency` and `unavailableDarken` from `Config > RingSelect`: these are in `Design` now.
- Internal functions only an edited kit would call: the `HudController` loading and acronym forwards, `Spectate.isSpectating`, `Spectate.changed`, `PromptDialog.isShowing`, `Godmode.isOn`, `Formatting.formatWebhookMessage`.
- Gift notes: Roblox's new chat rules require text between players to go through chat, so a gift no longer carries a message.
- The `notify` command, for the same reason. Staff can talk to players in chat.

### Fixed

- Long names and text were cut off with "…"; they now wrap or shrink to fit, in every menu, the HUD and the hub. Tag your own labels [`FitText`](https://kiels.dev/Ascent/guide/styling#long-text) for the same.
- On the Fastest leaderboard, a long tower name ran under the Normal and All Jumps buttons.
- A death in All Jumps or Practice puts you back exactly at your checkpoint, in the pose it was placed in.
- Going to a checkpoint or restarting lets go of seats, swings and ropes first.
- Reset Objects keeps the tower checkpoints already reached, so a win is no longer refused afterwards.
- Spectating plays the watched player's song, with this release's `MusicSystemManager`.
- The Modifiers menu could list no towers all session.
- Changing a setting quickly could put it back a step.
- A control placed with Edit UI Layout stays on screen when its size changes.
- The shop's Preview never opened for a player wearing an accessory with a thumbnail camera.
- The alignment dot sat off centre on a phone, and shook.
- The teleport screen showed its words twice.
- A toast could cover the tower's status.
- A tower's details in Completions closed by themselves about once a minute.
- Pointing at the towers behind a tower's details in Completions still showed their tooltips.
- An Area's box in Completions could disappear when the chart redrew.

### Security

- A winpad, portal or marker counts a touch only from within a few studs, as exploit tools can report one from anywhere.
- Leaving All Jumps or Practice while spamming the checkpoint key could win a Normal run.
- Saved run names go through Roblox's text filter.
- The server refuses Reset Objects in Normal mode.

## [1.2.0] - 2026-09-28

### Added

- `Config > RingSelect` can set the progress view, whether the hub saves settings, and its hover and button looks.
- The hub's Settings panel, its button and each row are optional.
- Extended Completions: event towers, closed places and rushes leave the normal count (`extended = true`).
- Award, purchase, error and tab sounds.
- The remaining looks and timings are in Config, each optional.

### Changed

- **Breaking:** menu sounds are Sounds in `SoundService > Menu`, and `Config > Visuals.menuSounds` is gone.
- Hovering a button is silent, and the click sound is new.
- The hub's `Shared` is the same as a tower place's.
- Rushes show on the Completions chart only under Extended Completions.
- Failures during play are structured logs that Creator Analytics can group.

### Fixed

- The topbar icons could cover the timer on a small screen.

## [1.1.1] - 2026-09-27

### Fixed

- The hub counted All Jumps wins as beaten.

## [1.1.0] - 2026-09-27

### Added

- Flip Indication: a preview of where a corner flip will put you.
- `firstRating` in `Config > Towers`, for charts that start below Easy.
- `falloff` in `Config > Elo.points`, so a player's hardest towers count most.

### Changed

- Elo prices a tower from the bottom of the chart.

### Fixed

- Heal parts in v6 towers heal.

## [1.0.0] - 2026-09-27

The first stable release. The names in [Hooking Into the Kit](https://kiels.dev/Ascent/guide/hooks) stay as they are within 1.x.

### Added

- Staff roles for the admin console, with a lowest role per command group.
- Commands: `gamepass-grant`, `gamepass-revoke`, `tower-grant`, `tower-revoke`, `shop-item-revoke`, `mute`, `unmute`, `freeze`, `unfreeze` and `staff`.
- Hooks for your own Scripts: `Events`, `CustomData` and the `CustomCommands` folder.
- Hide UI, a focus mode for climbing.
- A checkpoint panel for All Jumps and Practice.
- Friends and personal servers in the hub, and an outline on a tower's frame when its bar is hovered.
- A loading screen for every teleport.
- The spectate panel says how many are watching.
- Config is checked when the server starts, and `configVersion` says when it needs editing.
- Every player-facing word is in `Config > Messages`.

### Changed

- **Breaking:** functions that yield end in `Async`, such as `TowerRegistry.loadForPlayerAsync`.
- **Breaking:** `Config > Chat.tags.byGamePass` is gone.
- **Breaking:** webhooks ship switched off. Set `webhooks.enabled = true` once the secrets exist.
- **Breaking:** Scribe 2.5.0. Publish every place together, then shut down old servers.
- Reset on Death is Restart on Death, and covers every death.
- A checkpoint puts the tower's buttons and lighting back.
- The hub has sounds, music and a Music Volume slider.
- Every loading screen says what is loading.
- Tower Setup is a toolbar rather than one window.
- An Area's requirements read as goals, with the player's progress on each.

### Fixed

- A win announced across servers could be lost if the player left in that moment.
- Looking up a player in Completions could show somebody else.
- A personal server's closing countdown could not be called off.
- A slow moment of Roblox's group service took group cosmetics off players.
- Rejoin in a personal server opened a public one.
- The shop could charge more than it showed.
- Removing an All Jumps checkpoint threw away the rest on a death.
- A gradient chat tag turned the player's name white.
- A saved name spelled like one of Scribe's methods, or a `%` in a message, broke it.
- A misnamed menu part hung the menu rather than being reported.
- All Jumps' default keys clashed with Quick Restart and Corner Flip.
- A tower acronym with a symbol in it broke Config.
- A typo in a Tower Setup number box deleted the value.

### Security

- A locked Area is enforced when a player arrives, not only in the menu.
- The shipped Config names nobody: no user IDs, game passes or products of the kit's author.
- Every client message is bounded and rate-limited, and always has a listener.
- A tower's client objects go only to the player they are for, rather than to the whole server.
- A gift note is shown as text, so it cannot draw rich text on the recipient's screen.
- Runs that used a Studio test tool earn nothing.
- Webhook posts ping nobody, whatever a player's name spells.

## 1.0.0-rc.3 - 2026-09-21

### Added

- Players can gift a game pass, with an optional note.
- Chat tags can be gradients.
- An FPS cap players can set and step through with keys.
- An Area can be locked behind Elo.
- Global leaderboards for towers, All Jumps and Elo.

### Changed

- **Breaking:** one Elo replaces `normalElo` and `allJumpsElo`.
- `elo-board` is now `leaderboard`.
- Scribe 2.4.0.

### Fixed

- An old-kit profile's completions import as the right towers.
- Looking up a player in Completions could hang on Loading.
- One bad value in Studio no longer stops the Shop or Cosmetics menu loading.
- One misnumbered checkpoint folder no longer stops the server.
- Honest players were kicked for crossing two checkpoints quickly.
- Dying restarted the tower in All Jumps and Practice.

## 1.0.0-rc.2 - 2026-09-15

### Added

- `Config > CustomSettings`, for settings of your own.
- An Area can be locked behind a badge.
- The Blink schema ships in the place.

### Changed

- **Breaking:** `subDifficulties` entries say `upTo` rather than `threshold`.

### Fixed

- A difficulty's decimal named the band below the one it is in.
- One anti-cheat kick posted a webhook report per limb.
- A failed badge award or webhook post was simply lost.
- A slow badge award could hold up saving the run.

## 1.0.0-rc.1 - 2026-09-04

### Added

- The first release: tower loading, winpads, rushes, Practice and All Jumps, Elo, tickets and a shop, cosmetics, game passes, chat tags, announcements, personal servers, an admin console and a Studio plugin.
- Saves from fanofpixels' Multi-Tower Kit carry over. See [Moving An Old Kit Across](https://kiels.dev/Ascent/guide/migrating).

[Unreleased]: https://github.com/Vexx3/Ascent/releases
[1.2.0]: https://github.com/Vexx3/Ascent/releases/tag/v1.2.0
[1.1.1]: https://github.com/Vexx3/Ascent/releases/tag/v1.1.1
[1.1.0]: https://github.com/Vexx3/Ascent/releases/tag/v1.1.0
[1.0.0]: https://github.com/Vexx3/Ascent/releases/tag/v1.0.0
