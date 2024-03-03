"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import RenderedHandbook from "../../components/handbook/RenderedHandbook";

export default function QuotingPage() {
  const [displayPDF, setDisplayPDF] = useState(false);

  const dummyData = {
    calendarYearDeductible: 1000,
    calendarYearMaximum: 2000,
    type1Expenses: 1000,
    type2Expenses: 1000,
    type3Expenses: 1000,
    type4Expenses: 1000,
    orthodontiaLifetimeMaximum: 1000,
    waitingPeriods: 1000,
    outOfNetworkReimbursement: 1000,
  };

  if (displayPDF) {
    return (
      <div className="bg-gray-100 w-full h-screen">
        <Button onClick={() => setDisplayPDF(false)}>Back</Button>
        <RenderedHandbook {...dummyData} />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 w-full h-screen">
      <Button onClick={() => setDisplayPDF(true)}>Render Handbook</Button>
    </div>
  );
};  
