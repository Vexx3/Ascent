# Announcements & Webhooks

The announcements system handles local game messages, win messages, cross-server broadcasts, global notifications, anti-cheat kick messages, and Discord webhooks.

Main setup locations:

- `ReplicatedStorage > Shared > Config > Chat`
- `ReplicatedStorage > Shared > Config > Project`
- `ReplicatedStorage > Shared > Config > Towers > difficulties`

## Win Announcements

When a valid win is processed, the server sends a win announcement to clients.

Configure client message formatting in the `client` section of `ReplicatedStorage > Shared > Config > Chat`:

| Setting | Purpose |
| :-- | :-- |
| `winMessage` | Normal win message. |
| `allJumpsWinMessage` | All Jumps win message. |
| `boostsUsedMessage` | Extra boost list line. |
| `fontFace` and `fontSize` | Normal message styling. |
| `fancyFontFace` and `fancyFontSize` | Styling for difficulties with `fancyFont = true`. |

## Global Announcements

Difficulty entries in the `difficulties` array of `ReplicatedStorage > Shared > Config > Towers` control cross-server announcement behavior:

| Field | Purpose |
| :-- | :-- |
| `announceGlobally` | Sends normal wins across servers. |
| `announceAllJumpsGlobally` | Sends All Jumps wins across servers. |

The server publishes these through MessagingService.

## Global Notifications

The `notify` command can send notifications to selected players or globally across servers.

Global notifications use the MessagingService topic `GlobalNotification`.

## Discord Webhooks

Configure webhooks in the `webhooks` section of `ReplicatedStorage > Shared > Config > Chat`.
They are disabled by default. Enable them only after creating the required Roblox secrets.

| Setting | Purpose |
| :-- | :-- |
| `enabled` | Turns win-webhook posting on or off. |
| `normalMessage` | Normal win template. |
| `allJumpsMessage` | All Jumps win template. |
| `boostsUsedMessage` | Optional boost list suffix. |
| `antiCheat` | Posts a report when a win fails the server checks. Off by default. |

Supported placeholders:

- `{PlayerName}`
- `{EndingName}`
- `{DifficultyEmoji}`
- `{Time}`
- `{BoostList}`

Create these Roblox secrets in **Game Settings -> Security -> Secrets**:

| Secret | Used For |
| :-- | :-- |
| `NORMAL_WEBHOOK` | Normal wins whose difficulty category names no webhook. |
| `SC_WEBHOOK` | Normal wins in a category that names it — Soul Crushing and above, as shipped. |
| `ALL_JUMPS_WEBHOOK` | All Jumps wins, whatever the difficulty. |
| `ANTICHEAT_WEBHOOK` | Failed win checks, when `antiCheat` is on. |

**Which one a win posts to is decided by its difficulty category**, not by its
rating. An All Jumps win always goes to `ALL_JUMPS_WEBHOOK`; everything else
follows `webhook` on the matching entry in `categories`, falling back to
`NORMAL_WEBHOOK`. Point a category at a secret name of your own and that is
where its wins go — see [Difficulty Categories](./difficulties.md#difficulty-categories).

A missing secret is a warning in the Output and nothing else, so a place that
has not set one up loses the posts and nothing more. A post that fails is tried
twice more, a couple of seconds apart, before it is given up on.

HTTP requests must be enabled in Roblox Game Settings for webhook posting.

## Failed Win Checks

When a win fails the server's validation the player is kicked, and everyone in
the server sees a themed message picked at random from
`Config > Chat > antiCheatKickMessages`.

### Reports

Turning on `webhooks.antiCheat` also posts a report to `ANTICHEAT_WEBHOOK`, so
you can act on it after the server is gone. **One report per offence**, not one
per touch: several limbs reach a winpad before a kicked player actually
disconnects, and each used to be reported separately.

Each report carries:

| Field | Why it is there |
| :-- | :-- |
| Reason | Which of the three checks refused the win. |
| Player, user ID | Who it was. |
| Tower, difficulty | Where it happened. |
| Tower time, minimum time | The run against the bar it had to clear. |
| **Server time** | How long they had been in the server. Separates a first-minute exploit from someone who had been playing for an hour. |
| **Checkpoints** | How many reached, how many missed, and which was next. |
| Mode, boosts, debug item | What they were carrying. |
| Rush and index | When the run was part of a rush. |

The checkpoint detail is the useful part, and it is there to catch the kit being
wrong as much as the player. Checkpoints are *sampled* rather than touched, so
somebody who crosses one between samples fails the order check honestly —
"7 of 8 reached" reads very differently from "0 of 8".

## See Also

- [Configuration Reference: Chat](./configuration.md#chat)
- [Difficulties](./difficulties.md)
