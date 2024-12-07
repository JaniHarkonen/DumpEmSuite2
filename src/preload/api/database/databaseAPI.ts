import { RunResult } from "sqlite3";
import { DatabaseAPI, DeleteResult, FetchResult, PostResult, QueryResult } from "../../../shared/database.type";
import { Company, Currency, FilterationStep, FKCompany, FKProfile, Profile, Scraper, Tag } from "../../../shared/schemaConfig";
import { DatabaseManager } from "./database";
import { col, DELETE, equals, FROM, IN, insertInto, query, SELECT, SET, table, UPDATE, val, value, values, WHERE } from "./sql";


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
            equals(col<FKCompany>("fk_company_currency_id", "c"), col<Currency>("currency_id", "cx"))
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
  }
};
