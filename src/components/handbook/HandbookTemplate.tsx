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
  planName: number;
  deductible: number;
  coinsurance: number;
  oopMax: number;
  PCPcopay: number;
  specialistCopay: number;
  ERcopay: number;
  pharmacyCopay: number;
  inpatientCopay: number;
  urgentCareCopay: number;
  prescriptionDeductible: number;
  eeRate: number;
  esRate: number;
  ecRate: number;
  efRate: number;
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
          fontWeight: 'semibold', 
          textAlign: 'left', 
          fontSize: 14, 
          height: 28,
          marginBottom: 5,
          marginTop: 5, 
          width: '50%', 
          borderBottomWidth: 1, 
          borderBottomColor: '#000', // Assuming you want black border
          borderBottomStyle: 'solid', 
          backgroundColor: 'transparent',
          color: 'black',
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
            <Text style={styles.propText}>Plan Name: {props.planName}</Text>
            <Text style={styles.propText}>Deductible: {props.deductible}</Text>
            <Text style={styles.propText}>Coinsurance: {props.coinsurance}</Text>
            <Text style={styles.propText}>OOP Max: {props.oopMax}</Text>
            <Text style={styles.propText}>PCP Copay: {props.PCPcopay}</Text>
            <Text style={styles.propText}>Specialist Copay: {props.specialistCopay}</Text>
            <Text style={styles.propText}>ER Copay: {props.ERcopay}</Text>
            <Text style={styles.propText}>Pharmacy Copay: {props.pharmacyCopay}</Text>
            <Text style={styles.propText}>Inpatient Copay: {props.inpatientCopay}</Text>
            <Text style={styles.propText}>Urgent Care Copay: {props.urgentCareCopay}</Text>
            <Text style={styles.propText}>Prescription Deductible: {props.prescriptionDeductible}</Text>
            <Text style={styles.propText}>EE Rate: {props.eeRate}</Text>
            <Text style={styles.propText}>ES Rate: {props.esRate}</Text>
            <Text style={styles.propText}>EC Rate: {props.ecRate}</Text>
            <Text style={styles.propText}>EF Rate: {props.efRate}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
