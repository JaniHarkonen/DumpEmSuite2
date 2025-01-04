import { SceneConfigBlueprint } from "@renderer/model/tabs";


export default function buildSectorBlueprint(hostID: string, workspaceID: string): SceneConfigBlueprint {
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
                    id: hostID + "-notes",
                    workspace: workspaceID,
                    caption: "Notes",
                    contentTemplate: "view-sector-tab-notes",
                    tags: [],
                    order: 0
                  },
                  {
                    id: hostID + "-materials",
                    workspace: workspaceID,
                    caption: "Materials",
                    contentTemplate: "view-sector-tab-materials",
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
  };
}
