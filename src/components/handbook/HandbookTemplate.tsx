"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";

export interface HandbookTemplateProps {
  calendarYearDeductible: number;
  calendarYearMaximum: number;
  type1Expenses: number;
  type2Expenses: number;
  type3Expenses: number;
  type4Expenses: number;
  orthodontiaLifetimeMaximum: number;
  waitingPeriods: number;
  outOfNetworkReimbursement: number;
}

// Create Document Component
export default function HandbookTemplate(props: HandbookTemplateProps) {
  const [styles, setStyles] = useState({} as any);
  // Create styles
  useEffect(() => {
    setStyles(
      StyleSheet.create({
        page: {
          backgroundColor: "#d11fb6",
          color: "white",
        },
        section: {
          margin: 1,
          padding: 1,
        },
        viewer: {
          width: window.innerWidth, //the pdf viewer will take up all of the width and height
          height: window.innerHeight,
        },
      }),
    );
  }, []);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Calendar Year Deductible: {props.calendarYearDeductible}</Text>
            <Text>Calendar Year Maximum: {props.calendarYearMaximum}</Text>
            <Text>Type 1 Expenses: {props.type1Expenses}</Text>
            <Text>Type 2 Expenses: {props.type2Expenses}</Text>
            <Text>Type 3 Expenses: {props.type3Expenses}</Text>
            <Text>Type 4 Expenses: {props.type4Expenses}</Text>
            <Text>Orthodontia Lifetime Maximum: {props.orthodontiaLifetimeMaximum}</Text>
            <Text>Waiting Periods: {props.waitingPeriods}</Text>
            <Text>OutOfNetwork Reimbursement: {props.outOfNetworkReimbursement}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
