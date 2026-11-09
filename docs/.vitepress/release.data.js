// The newest release in CHANGELOG.md, read at build time for the home page.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const changelog = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../CHANGELOG.md')

export default {
  load() {
    const match = fs
      .readFileSync(changelog, 'utf8')
      .match(/^## \[(\d+\.\d+\.\d+[^\]]*)\] - (\d{4}-\d{2}-\d{2})/m)
    if (match === null) {
      return null
    }
    const date = new Date(`${match[2]}T00:00:00Z`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    return { version: match[1], date }
  },
}
