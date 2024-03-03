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
  plan_name: any;
  plan_id: any;
  deductible: any;
  coinsurance: any;
  employee_only_rate: any;
  employee_spouse_rate: any;
  employee_child_rate: any;
  employee_family_rate: any;
  pcp_copay: any;
  specialist_copay: any;
  er_copay: any;
  pharmacy_copay: any;
  inpatient_copay: any;
  urgent_care_copay: any;
  prescription_deductible: any;
  total_cost: any;
  out_of_pocket_max: any;
}

// Create Document Component
export default function HandbookTemplate(props: HandbookTemplateProps) {
  const [styles, setStyles] = useState({} as any);
  // Create styles
  useEffect(() => {
    setStyles(
      StyleSheet.create({
        page: {
          backgroundColor: "#f7f7f7",
          color: "white",
        },
        section: {
          margin: 20,
          padding: 20,
        },
        viewer: {
          width: window.innerWidth, //the pdf viewer will take up all of the width and height
          height: window.innerHeight,
        },
        propText: {
          fontWeight: "semibold",
          textAlign: "left",
          fontSize: 14,
          height: 28,
          marginBottom: 5,
          marginTop: 5,
          width: "50%",
          borderBottomWidth: 1,
          borderBottomColor: "#000", // Assuming you want black border
          borderBottomStyle: "solid",
          backgroundColor: "transparent",
          color: "black",
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
            <Text style={styles.propText}>Plan Name: {props.plan_name}</Text>
            <Text style={styles.propText}>Deductible: {props.deductible}</Text>
            <Text style={styles.propText}>Coinsurance: {props.coinsurance}</Text>
            <Text style={styles.propText}>OOP Max: {props.out_of_pocket_max}</Text>
            <Text style={styles.propText}>PCP Copay: {props.pcp_copay}</Text>
            <Text style={styles.propText}>Specialist Copay: {props.specialist_copay}</Text>
            <Text style={styles.propText}>ER Copay: {props.er_copay}</Text>
            <Text style={styles.propText}>Pharmacy Copay: {props.pharmacy_copay}</Text>
            <Text style={styles.propText}>Inpatient Copay: {props.inpatient_copay}</Text>
            <Text style={styles.propText}>Urgent Care Copay: {props.urgent_care_copay}</Text>
            <Text style={styles.propText}>Prescription Deductible: {props.prescription_deductible}</Text>
            <Text style={styles.propText}>EE Rate: {props.employee_only_rate}</Text>
            <Text style={styles.propText}>ES Rate: {props.employee_spouse_rate}</Text>
            <Text style={styles.propText}>EC Rate: {props.employee_child_rate}</Text>
            <Text style={styles.propText}>EF Rate: {props.employee_family_rate}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
