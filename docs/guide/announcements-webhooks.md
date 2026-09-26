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

## Failed Win Checks

A player who fails a win check is kicked, and the server sees a random line from `antiCheatKickMessages` in `Config > Chat`.

With `webhooks.antiCheat` on, each offence is also posted to `ANTICHEAT_WEBHOOK`: the player, tower, which check failed, their time against the minimum, how long they'd been in the server, how many checkpoints they reached, and what they were carrying. "7 of 8 checkpoints" usually means a checkpoint too small to walk through, not a cheater.
