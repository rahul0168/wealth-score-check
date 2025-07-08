// @ts-nocheck
import { useEffect } from "react";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

const assetData = [
  { name: "FD", overall: 20, returns: 5, contribution: 1 },
  { name: "Gold", overall: 5, returns: 5, contribution: 0.5 },
  { name: "Debt Schemes", overall: 15, returns: 5, contribution: 0.75 },
  { name: "Equity", overall: 30, returns: 15, contribution: 4.5 },
  { name: "Mutual Fund", overall: 20, returns: 15, contribution: 3 },
  { name: "Insurance", overall: 20, returns: 7, contribution: 3 },
  { name: "AIF", overall: 0, returns: 10, contribution: 0 },
  { name: "Real Estate", overall: 10, returns: 8, contribution: 0.8 },
];

export function AssetTable({
  overAllTotalContri,
  setOverAllTotalContri,
  userInput,
  setUserInput,
}) {
  const totalOverAllCalc = () => {
    const data = assetData.reduce((acc, asset) => {
      const weight = userInput[asset.name] ?? 0;
      return acc + (weight * asset.returns) / 100;
    }, 0);
    setOverAllTotalContri(data);
  };

  const getTotalWeightage = () => {
    return Object.values(userInput).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0
    );
  };

  useEffect(() => {
    totalOverAllCalc();
  }, [userInput]);

  return (
    <div className="border rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name of Asset Class</TableHead>
            <TableHead className="text-right">Weightage %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetData.map((asset) => (
            <TableRow key={asset.name}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                 
                  onChange={(e) =>
                     setUserInput({
                      ...userInput,
                      [asset.name]: !e.target.value?.trim()
                        ? 0
                        : parseInt(e.target.value),
                    })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium">Total Weightage</TableCell>
            <TableCell className="text-right">{getTotalWeightage()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
