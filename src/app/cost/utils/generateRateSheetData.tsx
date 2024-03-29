import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  ToolbarItems,
} from "@syncfusion/ej2-react-grids";
import { ExcelExport, Inject, Toolbar } from "@syncfusion/ej2-react-grids";

export function generateRateSheetData() {
  let data: Object[] = [
    {
      Category: "Miscellaneous",
      "  Spend": "=C11/12",
      "Annual Spend": 1250,
      "Last Year Spend": 1558,
      "Percentage Change": "=C11/D11",
      "Average Change": "=7.9/E11",
    },
  ];

  let grid: GridComponent | null;
  const toolbar: ToolbarItems[] = ["ExcelExport"];
  const toolbarClick = (args: ClickEventArgs) => {
    if (grid && args.item.id === "Grid_excelexport") {
      grid.excelExport();
    }
  };
  return (
    <div>
      <GridComponent
        id="Grid"
        dataSource={data}
        height={270}
        toolbar={toolbar}
        allowExcelExport={true}
        toolbarClick={toolbarClick}
        ref={(g: any) => (grid = g)}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="OrderID"
            headerText="Order ID"
            width="120"
            textAlign="Right"
          />
          <ColumnDirective
            field="CustomerID"
            headerText="Customer ID"
            width="150"
          />
          <ColumnDirective
            field="ShipCity"
            headerText="Ship City"
            width="150"
          />
          <ColumnDirective
            field="ShipName"
            headerText="Ship Name"
            width="150"
          />
        </ColumnsDirective>
        <Inject services={[Toolbar, ExcelExport]} />
      </GridComponent>
    </div>
  );
}
