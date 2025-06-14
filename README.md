# Classic Raid Reset

A Node.js script using Puppeteer to automatically capture screenshots of the Classic WoW raid reset schedule from [classicraidreset.com](https://classicraidreset.com).

## Features

- Automatically accepts cookie consent
- Selects relevant checkboxes
- Dynamically crops the screenshot based on page content
- Saves the screenshot as `raidreset.png`

## Requirements

- Node.js (version 14 or higher)
- npm package manager
- Puppeteer (installed via `npm install`)

## Installation

```bash
git clone https://github.com/eliasfaz/classic_raid_reset.git
cd classic_raid_reset
npm install
node capture.js
```
## Handling the image

Discord: 
- Create a channel
- Open the channel options and go to Integrations / Webhooks
- Copy the Webhook
- Send it through bash

```bash
#!/bin/bash

WEBHOOK_URL=""
IMAGE_PATH="/classic_raid_reset/raidreset.png"

curl -H "Content-Type: multipart/form-data" \
  -F "file=@${IMAGE_PATH}" \
  "${WEBHOOK_URL}"

```