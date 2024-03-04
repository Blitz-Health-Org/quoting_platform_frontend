"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";

type PlanDetails = {
  plan_name: string;
  plan_id: string;
  deductible: string;
  coinsurance: string;
  employee_only_rate: string;
  employee_spouse_rate: string;
  employee_child_rate: string;
  employee_family_rate: string;
  pcp_copay: string;
  specialist_copay: string;
  er_copay: string;
  pharmacy_copay: string;
  inpatient_copay: string;
  urgent_care_copay: string;
  prescription_deductible: string;
  total_cost: string;
  out_of_pocket_max: string;
};

type DentalQuoteDetails = {
  plan_name: string;
  plan_id: string;
  deductible: string;
  coinsurance: string;
  employee_only_rate: string;
  employee_spouse_rate: string;
  employee_child_rate: string;
  employee_family_rate: string;
  pcp_copay: string;
  specialist_copay: string;
  er_copay: string;
  pharmacy_copay: string;
  inpatient_copay: string;
  urgent_care_copay: string;
  prescription_deductible: string;
  total_cost: string;
  out_of_pocket_max: string;
};

export interface HandbookTemplateProps {
  quoteData: PlanDetails[] | undefined;
  dentalQuoteData: DentalQuoteDetails[] | undefined;
}

// Create Document Component
export default function HandbookTemplate(props: HandbookTemplateProps) {
  const [styles, setStyles] = useState({} as any);
  // Create styles
  console.log("does this work", props.dentalQuoteData)
  
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
          width: '100%', //the pdf viewer will take up all of the width and height
          height: '100%',
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
              {props.quoteData?.map((plan, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.propText}>Plan Name: {plan.plan_name || "MISSING"}</Text>
                  <Text style={styles.propText}>Deductible: {plan.deductible || "MISSING"}</Text>
                  <Text style={styles.propText}>Coinsurance: {plan.coinsurance || "MISSING"}</Text>
                  <Text style={styles.propText}>OOP Max: {plan.out_of_pocket_max || "MISSING"}</Text>
                  <Text style={styles.propText}>PCP Copay: {plan.pcp_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>Specialist Copay: {plan.specialist_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>ER Copay: {plan.er_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>Pharmacy Copay: {plan.pharmacy_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>Inpatient Copay: {plan.inpatient_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>Urgent Care Copay: {plan.urgent_care_copay || "MISSING"}</Text>
                  <Text style={styles.propText}>Prescription Deductible: {plan.prescription_deductible || "MISSING"}</Text>
                  <Text style={styles.propText}>EE Rate: {plan.employee_only_rate || "MISSING"}</Text>
                  <Text style={styles.propText}>ES Rate: {plan.employee_spouse_rate || "MISSING"}</Text>
                  <Text style={styles.propText}>EC Rate: {plan.employee_child_rate || "MISSING"}</Text>
                  <Text style={styles.propText}>EF Rate: {plan.employee_family_rate || "MISSING"}</Text>
                  <Text style={styles.propText}>Plan ID: {plan.plan_id || "MISSING"}</Text>
                  <Text style={styles.propText}>Total Cost: {plan.total_cost || "MISSING"}</Text>
                </React.Fragment>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
