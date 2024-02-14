"use server";

import PDFParser from "pdf2json";
import * as fs from "node:fs";
import { v4 as uuidv4 } from "uuid";

export async function parsePDF(formData: FormData): Promise<string | Error> {
  "use server";

  const rawFormData = {
    file: formData.get("file"),
  };

  const { file: file } = rawFormData;
  if (file) {
    const fileName = uuidv4();
    const tempFilePath = `/tmp/${fileName}.pdf`;
    const fileBuffer = Buffer.from(await (file as File).arrayBuffer());

    await fs.promises.writeFile(tempFilePath, fileBuffer);

    let parsedText = await new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: any) =>
        reject(errData.parserError),
      );

      pdfParser.on("pdfParser_dataReady", () => {
        resolve((pdfParser as any).getRawTextContent());
      });

      pdfParser.loadPDF(tempFilePath);
    });
    return parsedText as string;
  } else {
    return Error("file undefined");
  }
}
