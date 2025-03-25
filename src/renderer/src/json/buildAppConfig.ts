import { AppConfig } from "@renderer/model/config";


export default function buildAppConfig(): AppConfig {
  return {
    "hotkeyConfig": {
      "close-remove-tab": {
        "key": [
          "DELETE"
        ]
      },
      "edit-tab": {
        "key": [
          "E"
        ]
      },
      "activate": {
        "key": [
          "SPACE",
          "ENTER"
        ]
      },
      "finalize": {
        "key": [
          "ENTER"
        ]
      },
      "blur": {
        "key": [
          "ESCAPE"
        ]
      },
      "navigate-up": {
        "key": [
          "ARROWUP"
        ]
      },
      "navigate-down": {
        "key": [
          "ARROWDOWN"
        ]
      },
      "navigate-left": {
        "key": [
          "ARROWLEFT"
        ]
      },
      "navigate-right": {
        "key": [
          "ARROWRIGHT"
        ]
      },
      "confirm": {
        "key": [
          "Y"
        ]
      },
      "deny": {
        "key": [
          "N"
        ]
      },
      "save": {
        "key": [
          "CONTROL S"
        ]
      },
      "module-companies": {
        "key": [
          "ALT Q"
        ]
      },
      "module-analysis": {
        "key": [
          "ALT W"
        ]
      },
      "module-macro": {
        "key": [
          "ALT E"
        ]
      },
      "view-scraper": {
        "key": [
          "ALT A"
        ]
      },
      "view-listings": {
        "key": [
          "ALT S"
        ]
      },
      "view-profiles": {
        "key": [
          "ALT D"
        ]
      },
      "view-company-list": {
        "key": [
          "ALT Z"
        ]
      },
      "view-chart": {
        "key": [
          "ALT X"
        ]
      },
      "view-company-profile": {
        "key": [
          "ALT C"
        ]
      },
      "view-fundamental-filtration": {
        "key": [
          "ALT F"
        ]
      },
      "view-fundamental-stocks": {
        "key": [
          "ALT G"
        ]
      },
      "view-fundamental-chart": {
        "key": [
          "ALT H"
        ]
      },
      "view-fundamental-material-browser": {
        "key": [
          "ALT J"
        ]
      },
      "view-fundamental-profile": {
        "key": [
          "ALT K"
        ]
      },
      "view-fundamental-notes": {
        "key": [
          "ALT L"
        ]
      }
    },
    "activeTheme": "light",
    "sceneConfigBlueprint": {
      "splitTree": {
        "root": {
          "isFork": true,
          "divider": {
            "direction": "horizontal",
            "value": 50
          },
          "left": {
            "isFork": true,
            "divider": {
              "direction": "horizontal",
              "value": 50
            },
            "left": {
              "isFork": false,
              "value": {
                "tabs": [],
                "activeTabIndex": 0
              }
            }
          }
        }
      }
    }
  };
}
