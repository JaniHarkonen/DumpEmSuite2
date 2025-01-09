import { SceneConfigBlueprint } from "@renderer/model/tabs";


export function buildWorkspaceBlueprint(workspaceID: string): SceneConfigBlueprint {
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
                              tabs: [
                                {
                                  id: "view-volume",
                                  workspace: workspaceID,
                                  caption: "Volume",
                                  contentTemplate: "view-filteration",
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
                                                    id: "view-volume-stocks",
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
                                                      id: "view-volume-chart",
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
                                                      id: "view-volume-notes",
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
                                  order: 0
                                },
                                {
                                  id: "view-price-action",
                                  workspace: workspaceID,
                                  caption: "Price action",
                                  contentTemplate: "view-filteration",
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
                                                    id: "view-price-action-stocks",
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
                                                      id: "view-price-action-chart",
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
                                                      id: "view-price-action-notes",
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
                                  order: 0
                                },
                                {
                                  id: "view-technical",
                                  workspace: workspaceID,
                                  caption: "TA 1",
                                  contentTemplate: "view-filteration",
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
                                                    id: "view-technical-stocks",
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
                                                      id: "view-technical-chart",
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
                                                      id: "view-technical-notes",
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
                                  order: 0
                                },
                                {
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
                              tabs: [],
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
  }
}
