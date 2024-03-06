"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font
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

const medicalKeyDisplayNames: { [key: string]: string } = {
  plan_name: "Plan Name",
  plan_id: "Plan ID",
  deductible: "Deductible",
  coinsurance: "Coinsurance",
  employee_only_rate: "Employee Only Rate",
  employee_spouse_rate: "Employee Spouse Rate",
  employee_child_rate: "Employee Child Rate",
  employee_family_rate: "Employee Family Rate",
  pcp_copay: "PCP Copay",
  specialist_copay: "Specialist Copay",
  er_copay: "ER Copay",
  pharmacy_copay: "Pharmacy Copay",
  inpatient_copay: "Inpatient Copay",
  urgent_care_copay: "Urgent Care Copay",
  prescription_deductible: "Prescription Deductible",
  total_cost: "Total Cost",
  out_of_pocket_max: "Out of Pocket Max",
};

export interface HandbookTemplateProps {
  quoteData: PlanDetails[] | undefined;
  dentalQuoteData: DentalQuoteDetails[] | undefined;
  clientName: any;
}

// Create Document Component
export default function HandbookTemplate(props: HandbookTemplateProps) {
  const [styles, setStyles] = useState({} as any);
  // Create styles
  console.log("does this work", props.dentalQuoteData)
  const medicalQuotes = props?.quoteData?.length;
  console.log(medicalQuotes)

  useEffect(() => {
    setStyles(
      StyleSheet.create({
        page: {
          backgroundColor: "#ffffff",
        },
        copiedPage: {
          backgroundColor: "#ffffff",
        },
        firstPage: {
          backgroundColor: "#20446c",
        },
        section: {
          display: 'flex',
          flexDirection: 'column',
          width: medicalQuotes ? `${65 / medicalQuotes}%` : '100%',
          justifyContent: 'center',
          fontWeight: 'bold'
        },
        smallerSection: {
          display: 'flex',
          flexDirection: 'column',
          width: medicalQuotes ? `${73 / medicalQuotes}%` : '100%',
          justifyContent: 'center',
          borderLeftWidth: 1,
          borderLeftColor: "#000",
          borderLeftStyle: 'solid',
          textAlign: 'center'
        },
        grid: {
          display: 'flex',
          flexDirection: 'row',
          paddingBottom: 30,
          paddingLeft: 30,
          paddingRight: 30,
        },
        bullet: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        },
        viewer: {
          width: '100%', //the pdf viewer will take up all of the width and height
          height: '100%',
        },
        gridText: {
          fontWeight: "semibold",
          textAlign: "center",
          fontSize: 8,
          height: 10,
          width: "100%",
          marginTop: 10,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#000",
          borderBottomStyle: "solid",
          backgroundColor: "transparent",
          color: "black",
          fontFamily: 'Helvetica'
        },
        firstTwoFieldsText: {
          textAlign: "center",
          fontSize: 8,
          height: 10,
          width: "100%",
          marginTop: 10,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#000",
          borderBottomStyle: "solid",
          backgroundColor: "transparent",
          color: "black",
          fontFamily: 'Helvetica-Bold'
        },
        gridHeaderText: {
          textAlign: "left",
          fontSize: 8,
          height: 10,
          width: "100%",
          marginTop: 10,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#000",
          borderBottomStyle: "solid",
          backgroundColor: "transparent",
          color: "black",
          fontFamily: 'Helvetica-Bold'
        },
        headerText: {
          fontWeight: "semibold",
          textAlign: "left",
          fontSize: 20,
          height: 25,
          width: "100%",
          backgroundColor: "transparent",
          color: "#2f5496",
        },
        boldText: {
          fontWeight: 'bold',
          textAlign: "left",
          fontSize: 8,
          marginLeft: 2,
          marginRight: 2,
          height: 10,
          backgroundColor: "transparent",
          color: "black",
        },        
        normalText: {
          fontWeight: 'semibold',
          textAlign: "left",
          fontSize: 8,
          height: 10,
          backgroundColor: "transparent",
          color: "black",
          marginTop: 2,
          marginBottom: 2
        },
        bulletText: {
          fontWeight: "semibold",
          textAlign: "left",
          fontSize: 10,
          height: 12,
          backgroundColor: "transparent",
          color: "black",
          marginTop: 2,
          marginBottom: 2
        },
        rightAlignedText: {
          fontWeight: "semibold",
          textAlign: "right",
          fontSize: 9,
          marginTop: 30,
          marginBottom: 30,
          marginRight: 30,
          height: 12,
          backgroundColor: "transparent",
          color: "black",
          opacity: 0.9,
        },
        rightAlignedTextWithLessBottom: {
          fontWeight: "semibold",
          textAlign: "right",
          fontSize: 9,
          marginTop: 30,
          marginBottom: 10,
          marginRight: 30,
          height: 12,
          backgroundColor: "transparent",
          color: "black",
          opacity: 0.9,
        },
        image: {
          width: '90%',
          marginTop: 10,
          marginBottom: 20
        },
        smallerImage: {
          width: '70%',
          marginTop: 10,
        },
        firstImage: {
          width: '100%',
        },
        centered: {
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        },
        left: {
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          padding: 20
        },
      }),
    );
  }, []);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}

        <Page size="A4" style={styles.firstPage}>
          <View style={styles.centered}>
            <Image 
              src="Glance.png" 
              style={styles.firstImage} />
          </View>
          <Text style={{
              position: 'absolute',
              top: '65%',
              left: '13.5%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: 42,
            }}>
              Benefits at a Glance -
            </Text>
          <Text style={{
              position: 'absolute',
              top: '72%',
              left: '13.5%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: 42,
            }}>
              {props.clientName}
            </Text>
            <Text style={{
            position: 'absolute',
            top: '103.5%',
            left: '93.5%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: 10,
          }}>
            ANGUS MCRAE
          </Text>
        </Page>

        <Page size="A4" style={styles.copiedPage}>
        <View>
          <Text style={styles.rightAlignedText}>Page 2 | {props.clientName}</Text>
        </View>
        <View style={styles.centered}>
          <Image
            src="Eligibility.jpeg"
            style={styles.image}
          />
        </View>
        <View style={styles.centered}>
          <Image
            src="Definitions.png"
            style={styles.image}
          />
        </View>
        </Page>

        {/* <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.rightAlignedText}>Page 3</Text>
            <Text style={styles.headerText}>DEFINITIONS</Text>
            <Text style={styles.normalText}>Below are several common terms you will encounter throughout your Benefits at a Glance and other benefits materials.</Text>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>•</Text>
              <Text style={styles.boldText}>Subheader</Text>
              <Text style={styles.normalText}>Text</Text>
            </View>
            <Text style={styles.boldText}>Subheader</Text>
            <Text style={styles.normalText}>Text</Text>
            <Text style={styles.boldText}>Subheader</Text>
            <Text style={styles.normalText}>Text</Text>
          </View>
        </Page> */}

      <Page size="A4" style={styles.page}>
        <Text style={styles.rightAlignedTextWithLessBottom}>Page 3 | {props.clientName}</Text>
        <View style={styles.left}>
          <Image
            src="Medical.png"
            style={styles.smallerImage}
          />
        </View>
          <View style={styles.grid}>
            <View style={styles.section}>
              {Object.entries(medicalKeyDisplayNames).map(([key, displayName]) => (
                <Text key={key} style={styles.gridHeaderText}>{displayName || "MISSING"}</Text>
              ))}
              </View>
              {props.quoteData?.map((plan, index) => (
                <React.Fragment key={index}>
                <View style={styles.smallerSection}>
                    <Text style={styles.firstTwoFieldsText}>{plan.plan_name || "MISSING"}</Text>
                    <Text style={styles.firstTwoFieldsText}>{plan.plan_id || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.deductible || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.coinsurance || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.employee_only_rate || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.employee_spouse_rate || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.employee_child_rate || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.employee_family_rate || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.pcp_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.specialist_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.er_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.pharmacy_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.inpatient_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.urgent_care_copay || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.prescription_deductible || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.total_cost || "MISSING"}</Text>
                    <Text style={styles.gridText}>{plan.out_of_pocket_max || "MISSING"}</Text>
                  </View>
                </React.Fragment>
            ))}
            </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
