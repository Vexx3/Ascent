# Announcements & Webhooks

## Win Announcements

Every win is announced in the server's chat. The wording is in [Chat](./chat.md#win-messages).

A difficulty with `announceGlobally` (or `announceAllJumpsGlobally`) in `Config > Towers` announces its wins to **every** server.

The `notify` [admin command](./commands.md) sends a notification to players here or in every server.

## Discord Webhooks

Win posts to Discord are **off** until you set them up:

1. Turn on **Game Settings → Security → Allow HTTP Requests**.
2. In the Creator Dashboard, add these under **Experience → Secrets**, each holding a Discord webhook URL:

   | Secret | Posts |
   | :-- | :-- |
   | `NORMAL_WEBHOOK` | Normal wins. |
   | `SC_WEBHOOK` | Normal wins at Soul Crushing and above. |
   | `ALL_JUMPS_WEBHOOK` | All Jumps wins. |
   | `ANTICHEAT_WEBHOOK` | Failed win checks, if `antiCheat` is on. |

3. Set `webhooks.enabled = true` in `Config > Chat`.

Which secret a Normal win uses comes from its [difficulty category](./difficulties.md#difficulty-categories); point a category at a secret of your own to add a channel.

The messages are in `webhooks` in `Config > Chat`:

| Setting | Message |
| :-- | :-- |
| `normalMessage` | A Normal win. |
| `allJumpsMessage` | An All Jumps win. |
| `rushMessage`, `allJumpsRushMessage` | A tower rush win. |
| `boostsUsedMessage` | An extra line listing boosts. |
| `antiCheat` | Whether to report failed win checks. Off by default. |

Placeholders: `{PlayerName}`, `{EndingName}`, `{DifficultyEmoji}`, `{Time}`, `{BoostList}`, and `{TowerCount}` in rush messages. Posts never ping anyone. A missing secret is one warning in the Output.

## Far Messages

When a run ends far up a hard tower, the server's chat says so, as in EToH. It's the same `[SERVER]:` line a win gets, in the same font and the tower's difficulty colour:

> [SERVER]: kiel died VERY far in ToTDS after 12:34.56

Only that server sees it. Far messages are on once `farMessages` is in `Config > Chat`; `chat = false` turns the chat line off.

To post them to Discord as well:

1. Turn on **Allow HTTP Requests**, as above.
2. Add a secret named `FAR_WEBHOOK` holding a Discord webhook URL: a channel of its own, or the same URL as a win channel.
3. Set `farMessages.discord = true` in `Config > Chat`.

> **kiel** died VERY far in **ToTDS [emoji]** after `12:34.56`

### Which runs count

A run counts when it ends without a win: dying, restarting, the Exit button, leaving the game, or switching to Practice. Each has its word in `actions` (`died`, `restarted`, `exited`, `quit`, `practiced`). Set one to `""` to leave that ending out; switching to All Jumps or back to Normal is left out to begin with.

- Practice runs never count. All Jumps runs count with `allJumpsRuns = true`, and boosted runs count unless `boostedRuns = false`.
- Nothing is said for a run that got far faster than the tower's [minimum time](./tower-setup.md#minimum-time) allows for that much of it. That's also what stops one player flooding the chat, so there's no cooldown on top: a speedrunner gets every far run said. A tower with no minimum time has nothing pacing it, so give every tower one.
- Nobody "quits far" when the server shuts down.

### How far is far

A tower's **set** lists its levels in order. Each has a `word` and an `at`: `at = 0.7` is reached once the run has passed 70% of the tower's checkpoints. The furthest level reached is the one said, and a tower without checkpoints never says one.

| Set | Levels |
| :-- | :-- |
| `Catastrophic` | far |
| `Horrific+` | far (70%), VERY far (90%) |
| `Citadel` | pretty far, VERY far |
| `Rediculously Long` | far, VERY far, EXTREMELY FAR |
| `Inhumanely Long` | far, VERY far, EXTREMELY FAR, REDICULOUSLY FAR |
| `Impossibly Long` | slightly far, then the four above |

Change the words and the `at`s freely, or add sets of your own. Which set a tower uses is the first of:

1. **Its own.** `farMessages = "Impossibly Long"` on its entry in `Config > Towers`, or a `FarMessages` attribute on the tower. `"None"` turns it off.
2. **Its type's**, from `byType` (citadels use `Citadel`), if the tower is hard enough to count at all.
3. **Its difficulty's**, from `byDifficulty`. Each difficulty listed covers itself and everything harder, up to the next one listed, so `Catastrophic` and `Horrific` cover Catastrophic and up. Easier towers say nothing.

So a long tower only needs its set named on its entry:

```luau
ToEL = { name = "Tower of Extreme Length", difficulty = 12.4, area = "Ring1", farMessages = "Impossibly Long" },
```

### Marking checkpoints

To put the levels at exact spots, like EToH's hand-placed triggers, give checkpoints in `ServerStorage > TowerCheckpoints` a `FarMessage` string attribute naming a level of the tower's set. `FarMessage = "VERY far"` on checkpoint `12` means passing checkpoint 12 is VERY far.

A tower with any marks uses only its marks, so a level nobody marked is never reached there. The Output warns about a mark naming a level its tower's set doesn't have.

### The messages

`chatMessage` is the chat line and `discordMessage` the Discord post. Both take `{Player}`, `{Action}`, `{Far}`, `{Tower}` (the acronym), `{TowerName}`, `{Difficulty}`, `{Time}`, `{Progress}` (such as `72%`) and `{Checkpoint}` (such as `7/10`). `{Player}` follows `useDisplayName` in `Config > Project`.

- `{DifficultyEmoji}` is a Discord emoji, so it belongs in `discordMessage`. In chat it shows as its code.
- The chat line is [rich text](https://create.roblox.com/docs/ui/rich-text), so `<b>{Far}</b>` makes the word bold. The `[SERVER]:` before it is `wins.serverPrefix` in `Config > Messages`, shared with win lines.

For your own logging, every run ending is also the [`runEnded` event](./hooks.md).

## Failed Win Checks

A player who fails a win check is kicked, and the server sees a random line from `antiCheatKickMessages` in `Config > Chat`.

With `webhooks.antiCheat` on, each offence is also posted to `ANTICHEAT_WEBHOOK`: the player, tower, which check failed, their time against the minimum, how long they'd been in the server, how many checkpoints they reached, and what they were carrying. "7 of 8 checkpoints" usually means a checkpoint too small to walk through, not a cheater.
