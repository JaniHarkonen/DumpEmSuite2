import { SceneConfigBlueprint } from "@renderer/model/tabs";


export function buildFilterationBlueprint(hostID: string): SceneConfigBlueprint {
  return {
    splitTree: {
      root: {
        isFork: true,
        divider: {
          direction: "horizontal",
          value: 50
        },
        left: {
          isFork: true,
          divider: {
            direction: "horizontal",
            value: 50
          },
          left: {
            isFork: true,
            divider: {
              direction: "horizontal",
              value: 50
            },
            left: {
              isFork: false,
              value: {
                tabs: [
                  {
                    id: hostID + "-stocks",
                    workspace: "ws-test",
                    caption: "Stocks",
                    contentTemplate: "view-filteration-tab-stocks",
                    tags: [],
                    order: 0
                  }
                ],
                activeTabIndex: 0
              }
            }
          },
          right: {
            isFork: true,
            divider: {
              direction: "vertical",
              value: 50
            },
            left: {
              isFork: true,
              divider: {
                direction: "horizontal",
                value: 50
              },
              left: {
                isFork: false,
                value: {
                  tabs: [
                    {
                      id: hostID + "-chart",
                      workspace: "ws-test",
                      caption: "Chart",
                      contentTemplate: "view-filteration-tab-chart",
                      tags: [],
                      order: 0
                    }
                  ],
                  activeTabIndex: 0
                }
              }
            },
            right: {
              isFork: true,
              divider: {
                direction: "horizontal",
                value: 50
              },
              left: {
                isFork: false,
                value: {
                  tabs: [
                    {
                      id: hostID + "-notes",
                      workspace: "ws-test",
                      caption: "Notes",
                      contentTemplate: "view-filteration-tab-notes",
                      tags: [],
                      order: 0
                    }
                  ],
                  activeTabIndex: 0
                }
              }
            }
          }
        }
      }
    }
  };
}