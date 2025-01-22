import { ReactNode, useContext } from "react";
import AdvancedRealTimeWidget from "./AdvancedRealTimeWidget";
import { ProfileContext } from "@renderer/context/ProfileContext";


export default function ProfileChart(): ReactNode {
  const {company} = useContext(ProfileContext);

  if( !company || !company.stock_ticker || !company.exchange ) {
    return <>Please, select a company...</>;
  }

  return (
    <AdvancedRealTimeWidget
      ticker={company.stock_ticker}
      exchange={company.exchange}
    />
  );
}