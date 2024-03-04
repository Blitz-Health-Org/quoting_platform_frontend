import dynamic from "next/dynamic";
import { HandbookTemplateProps } from "./HandbookTemplate";

const PDFViewer = dynamic(() => import("./HandbookTemplate"), {
  ssr: false,
});

export default function RenderedHandbook(params: HandbookTemplateProps) {
  return (
    <div className="bg-gray-100 w-full h-full">
      <PDFViewer {...params} />
    </div>
  );
}
