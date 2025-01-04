import { RunResult } from "sqlite3";
import { DatabaseAPI, DeleteResult, FetchResult, PostResult, QueryResult } from "../../../shared/database.type";
import { Company, Currency, Filteration, FilterationStep, FKCompany, FKFilteration, FKMacroAnalysis, FKProfile, MacroAnalysis, MacroSector, Profile, Scraper, Tag } from "../../../shared/schemaConfig";
import { DatabaseManager } from "./database";
import { AND, AS, col, DELETE, equals, FROM, IN, insertInto, NOT, query, replaceInto, SELECT, SET, subquery, table, UPDATE, val, value, values, WHERE } from "./sql";


const databaseManager: DatabaseManager = new DatabaseManager(); // This should declared somewhere else!!!

function createError(err: Error): QueryResult {
  return {
    wasSuccessful: false,
    error: err
  };
}

function destructureRunResult(runResult: RunResult | null): PostResult | DeleteResult {
  if( !runResult ) {
    return {
      wasSuccessful: true,
      lastID: -1,
      changes: -1
    };
  } else {
    return {
      wasSuccessful: true,
      lastID: runResult.lastID,
      changes: runResult.changes
    };
  }
};

export const databaseAPI: DatabaseAPI = {
  open: ({
    databaseName,
    databasePath
  }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.open(databaseName, databasePath, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  close: ({ databaseName }) => {
    return new Promise<QueryResult>((resolve, reject) => {
      databaseManager.close(databaseName, (err: Error | null) => {
        if( !err ) {
          resolve({ wasSuccessful: true });
        } else {
          reject(createError(err));
        }
      });
    });
  },
  fetchScraperInfo: ({ databaseName }) => {
    return new Promise<FetchResult<Scraper>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(col("*")) + 
          FROM(table("scraper"))
        );
        
        databaseManager.fetch<Scraper>(
          databaseName, preparedString,
          (err: Error | null, rows: Scraper[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err))
            }
          }, []
        );
      }
    );
  },
  fetchAllCompanies: ({ databaseName }) => {
    return new Promise<FetchResult<Company & Currency>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<Company>("company_id", "c"), 
            col<Company>("company_name", "c"), 
            col<Company>("stock_ticker", "c"), 
            col<Company>("stock_price", "c"),
            col<Company>("volume_price", "c"),
            col<Company>("volume_quantity", "c"),
            col<Company>("exchange", "c"),
            col<Company>("chart_url", "c"),
            col<Company>("updated", "c"),
            col<Currency>("currency_id", "cx")
          ) + FROM(
            table("company", "c"), table("currency", "cx")
          ) + WHERE(
            equals(
              col<FKCompany>("fk_company_currency_id", "c"), 
              col<Currency>("currency_id", "cx")
            )
          )
        );

        databaseManager.fetch<Company & Currency>(
          databaseName, preparedString, 
          (err: Error | null, rows: (Company & Currency)[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              })
            } else {
              reject(createError(err));
            }
          }, []
        );
      }
    );
  },
  fetchAllTags: ({ databaseName }) => {
    return new Promise<FetchResult<Tag>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<Tag>("tag_id"), 
            col<Tag>("tag_hex"), 
            col<Tag>("tag_label")
          ) + FROM(
            table("tag")
          )
        );

        databaseManager.fetch<Tag>(
          databaseName, preparedString, 
          (err: Error | null, rows: (Tag)[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              })
            } else {
              reject(createError(err));
            }
          }, []
        );
      }
    );
  },
  fetchCompanyProfile: ({
    databaseName, company
  }) => {
    return new Promise<FetchResult<Profile>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<Profile>("investors_url"), 
            col<Profile>("presence"),
            col<Profile>("profile_description"),
            col<Profile>("sector")
          ) + 
          FROM(table("profile")) + 
          WHERE(equals(col<FKProfile>("fk_profile_company_id"), val()))
        );

        databaseManager.fetch<Profile>(
          databaseName, preparedString,
          (err: Error | null, rows: Profile[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err));
            }
          }, [company.company_id]
        );
      }
    );
  },
  fetchFilterationStepStocks: ({
    databaseName,
    filterationStepID
  }) => {
    return new Promise<FetchResult<Company & Currency & Tag>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<Company>("company_id", "c"), 
            col<Company>("company_name", "c"), 
            col<Company>("stock_ticker", "c"), 
            col<Company>("stock_price", "c"),
            col<Company>("volume_price", "c"),
            col<Company>("volume_quantity", "c"),
            col<Company>("exchange", "c"),
            col<Company>("chart_url", "c"),
            col<Company>("updated", "c"),
            col<Currency>("currency_id", "cx"),
            col<Tag>("tag_id", "t"),
            col<Tag>("tag_hex", "t"),
            col<Tag>("tag_label", "t")
          ) + FROM(
            table("company", "c"),
            table("currency", "cx"),
            table("tag", "t"),
            table("filteration", "f")
          ) + WHERE(
            equals(
              col<FKFilteration>("fk_filteration_company_id", "f"), 
              col<Company>("company_id", "c")
            ) + AND(
              equals(
                col<FKCompany>("fk_company_currency_id", "c"), 
                col<Currency>("currency_id", "cx")
              )
            ) + AND(
              equals(
                col<FKFilteration>("fk_filteration_tag_id", "f"), 
                col<Tag>("tag_id", "t")
              )
            ) + AND(
              equals(col<FKFilteration>("fk_filteration_step_id", "f"), val())
            )
          )
        );

        databaseManager.fetch<Company & Currency & Tag>(
          databaseName, preparedString,
          (err: Error | null, rows: (Company & Currency & Tag)[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err));
            }
          }, [filterationStepID]
        );
      }
    );
  },
  fetchFilterationStepNote: ({
    databaseName,
    filterationStepID,
    companyID
  }) => {
    return new Promise<FetchResult<Filteration>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<Filteration>("notes", "f")
          ) + FROM(
            table("filteration", "f")
          ) + WHERE(
            equals(
              col<FKFilteration>("fk_filteration_step_id", "f"), val()
            ) + AND(
              equals(
                col<FKFilteration>("fk_filteration_company_id", "f"), val()
              )
            )
          )
        );

        databaseManager.fetch<Filteration>(
          databaseName, preparedString,
          (err: Error | null, rows: (Filteration)[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err));
            }
          }, [filterationStepID, companyID]
        );
      }
    );
  },
  fetchMacroSectorNote: ({
    databaseName,
    macroSectorID
  }) => {
    return new Promise<FetchResult<MacroAnalysis>>(
      (resolve, reject) => {
        const preparedString: string = query(
          SELECT(
            col<MacroAnalysis>("notes")
          ) + FROM(
            table("macro_analysis")
          ) + WHERE(
            equals(
              col<FKMacroAnalysis>("fk_macro_analysis_sector_id"), val()
            )
          )
        );

        databaseManager.fetch<MacroAnalysis>(
          databaseName, preparedString,
          (err: Error | null, rows: (MacroAnalysis)[]) => {
            if( !err ) {
              resolve({
                wasSuccessful: true,
                rows
              });
            } else {
              reject(createError(err));
            }
          }, [macroSectorID]
        );
      }
    );
  },
  postNewCompany: ({
    databaseName, 
    company
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("company"),
            col<Company>("company_name"), 
            col<Company>("stock_ticker"), 
            col<Company>("stock_price"),
            col<Company>("volume_price"),
            col<Company>("volume_quantity"),
            col<Company>("exchange"),
            col<Company>("chart_url"),
            col<Company>("updated"),
            col<FKCompany>("fk_company_currency_id")
          ) + values(
            value(val(), val(), val(), val(), val(), val(), val(), val(), val())
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [
            company.company_name, 
            company.stock_ticker, 
            company.stock_price,
            company.volume_price,
            company.volume_quantity,
            company.exchange,
            company.chart_url,
            company.updated,
            'EUR'
          ]
        );
      }
    );
  },
  postNewFilterationStep: ({
    databaseName,
    filterationStep
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("filteration_step"),
            col<FilterationStep>("step_id"),
            col<FilterationStep>("caption")
          ) + values(
            value(val(), val())
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [filterationStep.step_id, filterationStep.caption]
        );
      }
    );
  },
  postNewTag: ({
    databaseName,
    tag
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("tag"),
            col<Tag>("tag_hex"),
            col<Tag>("tag_label")
          ) + values(
            value(val(), val())
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [tag.tag_hex, tag.tag_label]
        );
      }
    );
  },
  postNewMacroSector: ({
    databaseName,
    macroSector
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("macro_sector"),
            col<MacroSector>("sector_id"),
            col<MacroSector>("sector_name")
          ) + values(
            value(val(), val())
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [macroSector.sector_id, macroSector.sector_name]
        );
      }
    )
  },
  postAllStocksFromCompanyListings: ({
    databaseName,
    filterationStepID,
    defaultTagID
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          insertInto(
            table("filteration"),
            col<FKFilteration>("fk_filteration_company_id"),
            col<FKFilteration>("fk_filteration_step_id"),
            col<FKFilteration>("fk_filteration_tag_id")
          ) + SELECT(
            col<Company>("company_id", "c"),
            col<FilterationStep>("step_id", "fs"),
            col<Tag>("tag_id", "t")
          ) + FROM(
            table("company", "c"),
            table("filteration_step", "fs"),
            table("tag", "t"),
          ) + WHERE(
            equals(col<Tag>("tag_id", "t"), defaultTagID) + 
            AND(
              equals(col<FilterationStep>("step_id", "fs"), val())
            ) + AND(
              NOT() + IN(
                col<Company>("company_id", "c"),
                SELECT(col<FKFilteration>("fk_filteration_company_id", "f")) + 
                FROM(table("filteration", "f")) + 
                WHERE(
                  equals(col<FKFilteration>("fk_filteration_step_id", "f"), val())
                )
              )
            )
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [filterationStepID, filterationStepID]
        );
      }
    );
  },
  postFilterationStepCaption: ({
    databaseName,
    filterationStep
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          UPDATE(table("filteration_step")) + 
          SET(equals(col<FilterationStep>("caption"), val())) + 
          WHERE(equals(col<FilterationStep>("step_id"), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [filterationStep.caption, filterationStep.step_id]
        );
      }
    );
  },
  postCompanyChanges: ({
    databaseName,
    company,
    attributes,
    values
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const setterString: string[] = attributes.map((attrib: keyof Company) => {
          return equals(col<Company>(attrib), val());
        });

        const preparedString: string = query(
          UPDATE(table("company")) + 
          SET(...setterString) + 
          WHERE(equals(col<Company>("company_id"), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [...values, company.company_id]
        )
      }
    );
  },
  postCompanyProfileChanges: ({
    databaseName,
    company,
    attributes,
    values
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const setterString: string[] = attributes.map((attribute: keyof Profile) => {
          return equals(col<Profile>(attribute), val())
        });
        const preparedString: string = query(
          UPDATE(table("profile")) + 
          SET(...setterString) + 
          WHERE(equals(col<FKProfile>("fk_profile_company_id"), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));

            } else {
              reject(createError(err));
            }
          }, [...values, company.company_id]
        )
      }
    );
  },
  postTagChanges: ({
    databaseName,
    updatedTag
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          UPDATE(table("tag")) + 
          SET(equals(col<Tag>("tag_hex"), val()), equals(col<Tag>("tag_label"), val())) + 
          WHERE(equals(col<Tag>("tag_id"), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [updatedTag.tag_hex, updatedTag.tag_label, updatedTag.tag_id]
        )
      }
    );
  },
  postFilterationTagChanges: ({ 
    databaseName,
    filterationStepID, 
    companyID, 
    tagID 
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          UPDATE(table("filteration")) + 
          SET(equals(col<FKFilteration>("fk_filteration_tag_id"), val())) + 
          WHERE(
            equals(col<FKFilteration>("fk_filteration_step_id"), val()) +
            AND(
              equals(col<FKFilteration>("fk_filteration_company_id"), val())
            )
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [tagID, filterationStepID, companyID]
        )
      }
    )
  },
  postStocksToFilterationStep: ({
    databaseName,
    sourceStepID,
    targetStepID,
    stockIDs,
    preserveTag,
    defaultTagID,
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const tagColumn: string = (
          preserveTag ? 
          col<FKFilteration>("fk_filteration_tag_id", "f") : 
          defaultTagID + AS(col<FKFilteration>("fk_filteration_tag_id"))
        );
        const preparedString: string = query(
          insertInto(
            table("filteration"),
            col<FKFilteration>("fk_filteration_company_id"),
            col<FKFilteration>("fk_filteration_step_id"),
            col<FKFilteration>("fk_filteration_tag_id")
          ) + SELECT(
            col<FKFilteration>("fk_filteration_company_id", "f"),
            val() + AS(col<FKFilteration>("fk_filteration_step_id")),
            tagColumn
          ) + FROM(
            table("filteration", "f")
          ) + WHERE(
            equals(col<FKFilteration>("fk_filteration_step_id", "f"), val()) + 
            AND(
              IN(
                col<FKFilteration>("fk_filteration_company_id"),
                ...stockIDs.map(() => val())
              )
            ) + AND(
              NOT() + IN(
                col<FKFilteration>("fk_filteration_company_id"),
                subquery(
                  SELECT(col<FKFilteration>("fk_filteration_company_id")) + 
                  FROM(table("filteration")) + 
                  WHERE(
                    equals(col<FKFilteration>("fk_filteration_step_id"), val())
                  )
                )
              )
            )
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [targetStepID, sourceStepID, ...stockIDs, targetStepID]
        )
      }
    )
  },
  postFilterationNoteChanges: ({
    databaseName,
    filterationStepID,
    companyID,
    value
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          UPDATE(table("filteration")) + 
          SET(equals(col<Filteration>("notes"), val())) + 
          WHERE(
            equals(col<FKFilteration>("fk_filteration_step_id"), val()) + 
            AND(
              equals(col<FKFilteration>("fk_filteration_company_id"), val())
            )
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [value, filterationStepID, companyID]
        );
      }
    );
  },
  postMacroSectorCaption: ({
    databaseName,
    macroSector
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          UPDATE(table("macro_sector")) + 
          SET(equals(col<MacroSector>("sector_name"), val())) + 
          WHERE(equals(col<MacroSector>("sector_id"), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [macroSector.sector_name, macroSector.sector_id]
        );
      }
    );
  },
  postMacroSectorNoteChanges: ({
    databaseName,
    macroSectorID,
    notes
  }) => {
    return new Promise<PostResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          replaceInto(
            table("macro_analysis"), 
            col<MacroAnalysis>("notes"), 
            col<FKMacroAnalysis>("fk_macro_analysis_sector_id")
          ) + values(value(val(), val()))
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [notes, macroSectorID]
        );
      }
    );
  },
  deleteCompanies: ({
    databaseName, 
    companies
  }) => {
    return new Promise<DeleteResult>(
      (resolve, reject) => {
        const companyIDs: string[] = companies.map(
          (company: Company) => company.company_id.toString()
        );
        const preparedString: string = query(
          DELETE(
            FROM(table("company")) + 
            WHERE(IN(col<Company>("company_id"), ...companies.map(() => val())))
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, companyIDs
        )
      }
    );
  },
  deleteFilterationStep: ({
    databaseName,
    step_id
  }) => {
    return new Promise<DeleteResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          DELETE(
            FROM(table("filteration_step")) + 
            WHERE(equals(col<FilterationStep>("step_id"), val()))
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [step_id]
        );
      }
    )
  },
  deleteTag: ({
    databaseName,
    tag
  }) => {
    return new Promise<DeleteResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          DELETE(
            FROM(table("tag")) + 
            WHERE(equals(col<Tag>("tag_id"), val()))
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [tag.tag_id]
        )
      }
    )
  },
  delistStock: ({
    databaseName,
    filterationStepID,
    companyID
  }) => {
    return new Promise<DeleteResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          DELETE(
            FROM(table("filteration")) + 
            WHERE(
              equals(col<FKFilteration>("fk_filteration_step_id"), val()) + 
              AND(
                IN(
                  col<FKFilteration>("fk_filteration_company_id"),
                  ...companyID.map(() => val())
                )
              )
            )
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [filterationStepID, ...companyID]
        )
      }
    )
  },
  deleteMacroSector: ({
    databaseName,
    macroSectorID
  }) => {
    return new Promise<DeleteResult>(
      (resolve, reject) => {
        const preparedString: string = query(
          DELETE(
            FROM(table("macro_sector")) + 
            WHERE(equals(col<MacroSector>("sector_id"), val()))
          )
        );

        databaseManager.post(
          databaseName, preparedString,
          (runResult: RunResult | null, err: Error | null) => {
            if( !err ) {
              resolve(destructureRunResult(runResult));
            } else {
              reject(createError(err));
            }
          }, [macroSectorID]
        );
      }
    )
  }
};
