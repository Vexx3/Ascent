# Ascent Setup Plugin

Ascent Setup is the kit's Studio plugin. It adds an **Ascent** tab to Studio's
toolbar. Its windows show what each
tower and the place are missing, with a button to fix each thing. You can undo
anything it changes with `Ctrl+Z`.

## Installing it

1. Open the plugin on the [Creator Store](https://create.roblox.com/store/asset/133971753175712/Ascent-Setup)
   and press **Get Plugin**.
2. Open Studio. The **Ascent** tab appears in the toolbar.
3. If it doesn't, open **Plugins > Manage Plugins** and switch the plugin on.

The **Check** window tells you if the plugin and your place are on different
versions, and which one to update.

## The toolbar

| Button | Works in | What it does |
| :-- | :-- | :-- |
| **Towers** | Tower places | Lists your towers. Select a tower to see its page. |
| **Add Checkpoint** | Tower places | Adds a checkpoint to the selected tower, where your camera is looking. |
| **Checkpoints** | Tower places | Shows the selected tower's checkpoints so you can move them, or puts them back. |
| **Test Tower** | Tower places | Plays the selected tower. Select a part in it first to start on that part. A run started there never counts. |
| **Cameras** | The hub | Shows which way each Area's camera points. |
| **Look Through** | The hub | Looks through the selected Area camera. Press again for the next one. |
| **Aim Here** | The hub | Moves the selected Area camera to your current view. |
| **Check** | Both | Checks the place is ready to publish. |
| **Config** | Both | Opens one of the Config scripts. |

To give a button a keyboard shortcut, open Studio's **Customize Shortcuts**
window and search for *Ascent*.

## Making a tower

1. Point your camera where the tower should go.
2. Press **Towers**, then **New tower**.
3. Fill in the form and press **Make tower**.

The tower's page opens with a **To do** list of what's left. Work down it.

::: warning Pick the acronym carefully
Wins are saved under the acronym. Rename a tower only before anyone has played it.
:::

::: tip Using Rojo?
Untick **Add it to Config > Towers**, and add the tower's line to your own file.
Rojo overwrites changes made to synced scripts in Studio.
:::

## The Check window

Press **Check** before you publish. It lists anything the place is missing, with a
button to fix most of it.

If the place isn't published yet, pick its Area at the top of the window. New
towers go in that Area.

When you need help, press **Print a report for support** at the bottom of the
window. See [Asking for help](./troubleshooting.md#asking-for-help).
