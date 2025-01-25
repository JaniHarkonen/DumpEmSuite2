import { ReactNode } from "react";


type Props = {
  numberOfCompanies: number;
  shownNumberOfCompanies?: number;
};

export default function CompanyListStatisticsPanel(props: Props): ReactNode {
  const pNumberOfCompanies: number = props.numberOfCompanies;
  const pShownNumberOfCompanies: number = props.shownNumberOfCompanies ?? -1;

  const count: number = (pShownNumberOfCompanies >= 0) ? pShownNumberOfCompanies : pNumberOfCompanies;

  return (
    <div className="user-select-text mt-medium-length indent-tiny-size">
      Showing {count} companies {pShownNumberOfCompanies >= 0 ? "out of " + pNumberOfCompanies : ""}
    </div>
  );
}
