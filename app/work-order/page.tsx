"use client";

import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function WorkOrderPage() {
  const dummyData = [
    {
      id: 1,
      workCode: "W467222300694",
      district: "Balrampur",
      block: "Balrampur",
      panchayat: "Kapildeopur",
      village: "---",
      scheme: "SVS",
      fhtc: 49,
      amount: 48.14,
    },
    {
      id: 2,
      workCode: "W467222300694",
      district: "Balrampur",
      block: "Balrampur",
      panchayat: "Kapildeopur",
      village: "---",
      scheme: "SVS",
      fhtc: 195,
      amount: 164.21,
    },
    {
      id: 3,
      workCode: "W467222300694",
      district: "Balrampur",
      block: "Balrampur",
      panchayat: "Kapildeopur",
      village: "---",
      scheme: "SVS",
      fhtc: 502,
      amount: 25.14,
    },
    {
      id: 4,
      workCode: "W467222300694",
      district: "Balrampur",
      block: "Balrampur",
      panchayat: "Obari",
      village: "---",
      scheme: "SVS",
      fhtc: 50,
      amount: 25.54,
    },
    {
      id: 5,
      workCode: "W467222300694",
      district: "Balrampur",
      block: "Balrampur",
      panchayat: "Chilomakhurd",
      village: "---",
      scheme: "SVS",
      fhtc: 332,
      amount: 105.87,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <h2 className="text-[16px] font-bold text-[#1a2b3c] whitespace-nowrap px-2">
            Work Code Details
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[#F9FAFB] border-gray-100 text-[12px] h-9">
                <SelectValue placeholder="District Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">District Name</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[#F9FAFB] border-gray-100 text-[12px] h-9">
                <SelectValue placeholder="Block Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Block Name</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[#F9FAFB] border-gray-100 text-[12px] h-9">
                <SelectValue placeholder="Work Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Work Code</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-[#136FB6] hover:bg-[#105E9A] text-white h-9 px-8 rounded-lg text-[12px] font-medium shadow-md shadow-[#136FB6]/20">
              Back
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden bg-white rounded-[16px]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#DFEEF9] hover:bg-[#DFEEF9] border-none">
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12">
                      S No.
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12">
                      Work Code
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12">
                      District Name
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      Block Name
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      Panchayat Name
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      Village Name
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      Scheme Type
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      No FHTC
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 bg-[#DFEEF9] opacity-80">
                      AA Amount
                      <br />
                      (In Lakh)
                    </TableHead>
                    <TableHead className="font-bold text-[#1a2b3c] text-[12px] h-12 text-center bg-[#DFEEF9] opacity-80">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyData.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium bg-[#DFEEF9]/50">
                        {row.id}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium bg-[#DFEEF9]/50">
                        {row.workCode}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium bg-[#DFEEF9]/50">
                        {row.district}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.block}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.panchayat}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.village}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.scheme}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.fhtc}
                      </TableCell>
                      <TableCell className="text-[12px] text-gray-900 py-4 font-medium">
                        {row.amount}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Button className="h-7 px-4 bg-[#136FB6] hover:bg-[#105E9A] text-white transition-colors text-[11px] font-bold rounded-md">
                          Action
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button className="bg-[#DFEEF9] hover:bg-[#D0E5F5] text-[#1a2b3c] font-bold text-[12px] h-10 px-6 rounded-lg flex items-center gap-2 shadow-sm">
            <Upload size={14} className="stroke-[2.5]" />
            Export
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
