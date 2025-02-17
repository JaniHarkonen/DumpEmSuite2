import { SceneConfigBlueprint, TabBlueprint } from "@renderer/model/tabs";
import { FilterationStep, MacroSector } from "src/shared/schemaConfig";


export function buildWorkspaceBlueprint(
  workspaceID: string, 
  filterationSteps?: FilterationStep[], 
  macroSectors?: MacroSector[]
): SceneConfigBlueprint {
  const buildFilterationStep = (filterationStep: FilterationStep, contentTemplate: string): TabBlueprint => {
    return {
      id: filterationStep.step_id,
      workspace: workspaceID,
      caption: filterationStep.caption || "",
      contentTemplate,
      tags: [],
      sceneConfigBlueprint: {
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
                        id: filterationStep.step_id + "-view-volume-stocks",
                        workspace: workspaceID,
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
                          id: filterationStep.step_id + "-view-volume-chart",
                          workspace: workspaceID,
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
                          id: filterationStep.step_id + "-view-volume-notes",
                          workspace: workspaceID,
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
      },
      order: 0,
    };
  };

  const buildFundamentalFilterationStep = (): TabBlueprint => {
    return {
      id: "view-fundamental",
      workspace: workspaceID,
      caption: "Fundamental",
      contentTemplate: "view-fundamental",
      tags: [
        "permanent"
      ],
      sceneConfigBlueprint: {
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
                        id: "view-fundamental-stocks",
                        workspace: workspaceID,
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
                          id: "view-fundamental-chart",
                          workspace: workspaceID,
                          caption: "Chart",
                          contentTemplate: "view-filteration-tab-chart",
                          tags: [],
                          order: 0
                        },
                        {
                          id: "view-fundamental-material-browser",
                          workspace: workspaceID,
                          caption: "Materials",
                          contentTemplate: "view-material-browser",
                          tags: [],
                          order: 0
                        },
                        {
                          id: "view-fundamental-profile",
                          workspace: workspaceID,
                          caption: "Profile",
                          contentTemplate: "view-company-profile",
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
                          id: "view-fundamental-notes",
                          workspace: workspaceID,
                          caption: "Notes",
                          contentTemplate: "view-fundamental-notes",
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
      },
      order: 1
    };
  };

  const buildMacroSector = (macroSector: MacroSector): TabBlueprint => {
    return {
      id: macroSector.sector_id,
      workspace: workspaceID,
      caption: macroSector.sector_name || "",
      contentTemplate: "view-sector-analysis",
      tags: [],
      sceneConfigBlueprint: {
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
                    tabs: [],
                    activeTabIndex: 0
                  }
                }
              }
            }
          }
        }
      },
      order: 0
    };
  };

  let filterationStepTabs: TabBlueprint[];

  if( !filterationSteps ) {
    filterationStepTabs = [
      buildFilterationStep({
        step_id: "view-volume",
        caption: "Volume"
      }, "view-filteration"),
      buildFilterationStep({
        step_id: "view-price-action",
        caption: "Price action"
      }, "view-filteration"),
      buildFilterationStep({
        step_id: "view-technical",
        caption: "TA 1"
      }, "view-filteration"),
      buildFundamentalFilterationStep()
    ];
  } else {
    filterationStepTabs = filterationSteps.map((step: FilterationStep) => {
      if( step.step_id === "view-fundamental" ) {
        return buildFundamentalFilterationStep();
      }

      return buildFilterationStep(step, "view-filteration");
    });
  }

  let macroSectorTabs: TabBlueprint[];

  if( !macroSectors ) {
    macroSectorTabs = [];
  } else {
    macroSectorTabs = macroSectors.map((sector: MacroSector) => buildMacroSector(sector));
  }

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
            isFork: false,
            value: {
              tabs: [
                {
                  id: "module-companies",
                  workspace: workspaceID,
                  caption: "Companies",
                  contentTemplate: "module-companies",
                  tags: [],
                  order: 0,
                  sceneConfigBlueprint: {
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
                            isFork: false,
                            value: {
                              tabs: [
                                {
                                  id: "view-scraper",
                                  workspace: workspaceID,
                                  caption: "Scraper",
                                  contentTemplate: "view-scraper",
                                  tags: [],
                                  order: 0
                                },
                                {
                                  id: "view-listings",
                                  workspace: workspaceID,
                                  caption: "Listings",
                                  contentTemplate: "view-listings",
                                  tags: [],
                                  order: 0
                                },
                                {
                                  id: "view-profiles",
                                  workspace: workspaceID,
                                  caption: "Profiles",
                                  contentTemplate: "view-profiles",
                                  tags: [],
                                  order: 0,
                                  sceneConfigBlueprint: {
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
                                                    id: "view-company-list",
                                                    workspace: workspaceID,
                                                    caption: "Companies",
                                                    contentTemplate: "view-company-list",
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
                                                      id: "view-chart",
                                                      workspace: workspaceID,
                                                      caption: "Chart",
                                                      contentTemplate: "view-chart",
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
                                                      id: "view-company-profile",
                                                      workspace: workspaceID,
                                                      caption: "Profile",
                                                      contentTemplate: "view-company-profile",
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
                                  }
                                }
                              ],
                              activeTabIndex: 0
                            }
                          }
                        }
                      }
                    }
                  }
                },
                {
                  id: "module-analysis",
                  workspace: workspaceID,
                  caption: "Analysis",
                  contentTemplate: "module-analysis",
                  tags: [],
                  order: 0,
                  sceneConfigBlueprint: {
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
                            isFork: false,
                            value: {
                              tabs: filterationStepTabs,
                              activeTabIndex: 0
                            }
                          }
                        }
                      }
                    }
                  }
                },
                {
                  id: "module-macro",
                  workspace: workspaceID,
                  caption: "Macro",
                  contentTemplate: "module-macro",
                  tags: [],
                  sceneConfigBlueprint: {
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
                            isFork: false,
                            value: {
                              tabs: macroSectorTabs,
                              activeTabIndex: 0
                            }
                          }
                        }
                      }
                    }
                  },
                  order: 0
                }
              ],
              activeTabIndex: 0
            }
          }
        }
      }
    }
  };
}
