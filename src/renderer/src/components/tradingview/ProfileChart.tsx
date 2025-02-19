import { ReactNode, useContext } from "react";
import AdvancedRealTimeWidget from "./AdvancedRealTimeWidget/AdvancedRealTimeWidget";
import { ProfileContext } from "@renderer/context/ProfileContext";
import CompanyNotSelected from "../CompanyNotSelected/CompanyNotSelected";


export default function ProfileChart(): ReactNode {
  const {company} = useContext(ProfileContext);

  if( !company || !company.stock_ticker || !company.exchange ) {
    return <CompanyNotSelected />;
  }

  return (
    <AdvancedRealTimeWidget
      exchange={company.exchange}
      ticker={company.stock_ticker}
    />
  );
}