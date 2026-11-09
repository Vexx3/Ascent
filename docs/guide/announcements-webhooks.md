# Announcements & Webhooks

Wins are announced in chat, and can be posted to Discord too. This page also
covers far messages, for runs that end far up a hard tower, and anti-cheat kicks.

## Win announcements

Every win is announced in that server's chat. You can change the wording in
[Chat](./chat.md#win-messages).

To announce a difficulty's wins to **every** server, turn on `announceGlobally`
(Normal wins) or `announceAllJumpsGlobally` (All Jumps wins) on that difficulty in
`Config > Towers`.

## Discord webhooks

The kit can post wins to Discord channels. It's off until you set it up:

1. In Studio, turn on **Game Settings > Security > Allow HTTP Requests**.
2. In Discord, make a webhook for each channel you want to post in, and copy its
   URL.
3. In the Creator Dashboard, open your experience's **Secrets** page and add a
   secret for each one, with the webhook URL as its value:

   | Secret | Posts |
   | :-- | :-- |
   | `NORMAL_WEBHOOK` | Normal wins. |
   | `SC_WEBHOOK` | Normal wins at Soul Crushing and above. |
   | `ALL_JUMPS_WEBHOOK` | All Jumps wins. |
   | `ANTICHEAT_WEBHOOK` | Players kicked for failing a win check, if `antiCheat` is on. |

4. Set `webhooks.enabled = true` in `Config > Chat`.

Which secret a Normal win uses depends on its
[difficulty category](./difficulties.md#difficulty-categories), so you can send a
category to a secret of your own.

The posts are written in `webhooks` in `Config > Chat`:

| Setting | What it is |
| :-- | :-- |
| `normalMessage` | The post for a Normal win. |
| `allJumpsMessage` | The post for an All Jumps win. |
| `rushMessage`, `allJumpsRushMessage` | The post for a tower rush win. |
| `boostsUsedMessage` | An extra line listing the boosts used. |
| `modifiersMessage` | An extra line listing the run's [modifiers](./modifiers.md). |
| `antiCheat` | Whether to post anti-cheat kicks. Off by default. |

You can use `{PlayerName}`, `{EndingName}`, `{DifficultyEmoji}`, `{Time}`,
`{BoostList}` and `{ModifierList}` in posts, and `{TowerCount}` in rush posts.

## Far messages

When a run ends far up a hard tower without a win, that server's chat says so:

> [SERVER]: kiel died VERY far in ToTDS after 12:34.56

Far messages are on as long as `farMessages` is in `Config > Chat`. Set
`chat = false` inside it to turn off the chat line.

To post them to Discord as well:

1. Turn on **Allow HTTP Requests**.
2. Add a secret named `FAR_WEBHOOK`, holding a Discord webhook URL.
3. Set `farMessages.discord = true` in `Config > Chat`.

### Which runs count

A run counts when it ends without a win. Each way a run can end has its own word in
`actions`. Set a word to `""` to leave that kind of ending out:

| How the run ended | Word |
| :-- | :-- |
| The player died | `died` |
| The player restarted | `restarted` |
| The player pressed Exit Tower | `exited` |
| The player left the game | `quit` |
| The player switched to Practice | `practiced` |
| The player switched to All Jumps | `all-jumped` |
| The player loaded a [saved run](./saved-runs.md) | `savedRun`, off by default |

- Practice runs never count.
- All Jumps runs only count with `allJumpsRuns = true`.
- Runs that used a boost count, unless `boostedRuns = false`.
- A run faster than the tower's [minimum time](./tower-setup.md#minimum-time)
  says nothing, so give every tower a minimum time.
- Players can turn their own far messages off with the **Disable Progress Message**
  setting (`disableProgress`).

### How far is far

A **set** lists how far up a tower each word starts. Each level has a `word` and an
`at`. `at = 0.7` means the player passed 70% of the tower's checkpoints. A tower
with no checkpoints never gets a far message.

The kit comes with these sets:

| Set | Levels |
| :-- | :-- |
| `Catastrophic` | far |
| `Horrific+` | far (70%), VERY far (90%) |
| `Citadel` | pretty far, VERY far |
| `Rediculously Long` | far, VERY far, EXTREMELY FAR |
| `Inhumanely Long` | far, VERY far, EXTREMELY FAR, REDICULOUSLY FAR |
| `Impossibly Long` | slightly far, then the four above |

A tower uses the first of these it has:

1. **Its own set:** `farMessages = "Impossibly Long"` on its entry in
   `Config > Towers`, or a `FarMessages` attribute on the tower. `"None"` turns far
   messages off for that tower.
2. **Its tower type's set**, from `byType`.
3. **Its difficulty's set**, from `byDifficulty`. A difficulty's set also covers
   every harder difficulty, up to the next one listed.

```luau
ToEL = { name = "Tower of Extreme Length", difficulty = 12.4, area = "Ring1", farMessages = "Impossibly Long" },
```

### Marking exact spots

To start a level at an exact checkpoint, give that checkpoint (in
`ServerStorage > TowerCheckpoints`) a `FarMessage` string attribute with the
level's word, such as `"VERY far"`. If a tower has any marked checkpoints, it only
uses those.

### The messages

`chatMessage` is the chat line, and `discordMessage` is the Discord post. Both can
use `{Player}`, `{Action}`, `{Far}`, `{Tower}`, `{TowerName}`, `{Difficulty}`,
`{Time}`, `{Progress}` (such as `72%`) and `{Checkpoint}` (such as `7/10`).

- `{DifficultyEmoji}` is a Discord emoji, so only use it in `discordMessage`.
- The chat line supports [rich text](https://create.roblox.com/docs/ui/rich-text),
  so `<b>{Far}</b>` works.
- The `[SERVER]:` tag in front is `wins.serverPrefix` in `Config > Messages`.

To log runs your own way, use the [`runEnded` event](./hooks.md#server-events).

## Anti-cheat kicks

A player who fails a win check is kicked, and the server sees a random line from
`antiCheatKickMessages` in `Config > Chat`.

If `webhooks.antiCheat` is on, each kick is also posted to `ANTICHEAT_WEBHOOK`,
with the player, the tower, which check failed, the times, the checkpoints reached
and the items they had. "7 of 8 checkpoints" usually means a checkpoint is too small
to walk through, not that the player cheated.
