# DumpEm Suite 2 (v2.0.1)

DumpEm Suite 2 is an investment analysis application I built mainly for my personal use to aid me with the research process. DumpEm Suite 2 lets you carry out a filtration process on a set of candidate companies as well as write analyses via its markdown-based notes complete with custom widgets such as charts and quarterly earnings tables. DumpEm Suite 2 is also highly 
customizable giving you full control over how much data you have at your disposal at any given time. The Flexible Splits -system lets you view tabs side-by-side or collapse them and simply focus on one view at a time. Hotkeys, that can be used to quickly navigate the program, are also customizable alongside the app theme.

## Change log

### Version v.2.0.2 (31.3.2025)

**New features**
- Search fields can now be used to look for items in lists, such as companies.
- Company profile selection is now maintained in the extra info of a tab.
- Changed list sub-bulletpoint to a • from the previous

**Bug fixes**
- When opening an existing workspace, the macro sectors didn't get loaded in properly.
- When selecting another company on the "Profiles"-tab, the company profile note didn't change while being edited leading to the previous profile potentially replacing the profile of the selected company.
- The annual earnings projector markdown widget was sensitive to the order of its configuration tags (`<cashflow>` and `<market-cap>`). Entering the tags in the wrong order caused the markdown to become corrupt when the values of the widget were changed.
- Changing the caption of a filtration step was not reflected in the filtration step drop menu of submission forms without refresh.
- Changing the information of a company was not reflected in the stock lists of filtration steps.
- Changing the profile information of a company was not reflected in the profile found in the fundamental filtration step.

### Version v.2.0.1 (26.02.2025)

As expected, the first release of DumpEm Suite 2 contained a few bugs and annoyances. Version 2.0.1 fixes the following bugs and introduces some small features:

**New features**
- Markdown editor now stores the scrollbar position
- Highlighted text can now be enclosed with certain symbols ( ", ', (, [, { ) in text areas

**Bug fixes**
- IR-links on company profiles didn't work when clicked. A browser window was opened but no link was entered.
- Workspace structure was loaded improperly, so that loading a workspace would always result in the default layout.
- Changing app config (opening/sliding/splitting tabs) would override the active theme with a stale version.
- Opening parenthesis would have a mysterious extra space in front of them.

## Features

DumpEm Suite 2 has the following features:
- scraping companies via ScrapeScript-based scrapers, which were introduced in DumpEm Suite 1
- Company Profiles view that lets you build detailed explanations of the operations of the companies
- Analysis module that lets you 
  - filter out the candidates in filtration steps
  - customize the number of filtration steps/rounds
  - view stock charts via TradingView's Advanced Real-Time Chart Widget
  - write in-depth analysis on the candidates via markdown-based text editor with custom features, such as chart, quarterly earnings and annual earnings widgets
  - compile research materials, such as earnings reports and press releases, in one place
- Macro module that helps you write higher-level analyses via a markdown-based text editor as well as compile research materials
- Flexible Splits -based UI that lets you drag and drop tabs so that they can be viewed side-by-side or collapsed into a single view
- hotkeys that can be configured and enable you to quickly navigate the app
- light and dark themes that can be swapped between depending on the amount of eye strain you wish to endure

## Motivation and DumpEm Suite v1

DumpEm Suite v2.0.0 is the second iteration (or third if you count DumpEm) of the DumpEm Suite investment tool. Albeit being very useful for note-taking, the prior
version of DumpEm Suite suffers from poor code as well as design choices mixed with an inflexible UI and some minor bugs. For this reason, I've decided to re-design
and re-write the investment suite. DumpEm Suite 2 is set to feature a customizable and flexible UI coupled with new modules and tools to help with information gathering
and visualization. 


## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

**WARNING!** This project was developed on Windows and will most likely not work on other operating systems due to the heavy reliance on direct calls to OS-specific features, such as reading/writing files and executing Windows shell commands. Also, this electron app is **NOT** sandboxed and has no set **Content Security Policy**, so it has access to the file system and can contact CDNs. However, the app CAN be ran offline, and only connects to the TradingView's widget CDN when charts are loaded in.

### Install

```bash
$ yarn
```

### Development

When running in development mode, the Chromium browser menu is enabled.

```bash
$ yarn dev
```

### Demo

If you want to see an example workspace, simply goto `Workspace -> Open existing workspace` (or press CTRL + O), and navigate to the `test-data/test-database`-directory and click open. DumpEm Suite 2 will figure out the rest from there.

### Build

When built for production, the Chromium browser menu is disabled. **IMPORTANT!** The Build process may fail due to "unused variable" -false positives, so it is recommended to make the 
following changes to the `package.json` running build commands (running in development should work fine without any alterations):
```json
...
"scripts": {
  ...
  //"build": "npm run typecheck && electron-vite build",
  "build": "electron-vite build", 
  ...
}
```

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```
