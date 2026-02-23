"use client";

import { useQuery } from "@tanstack/react-query";
import { getContractors } from "@/services/masterService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Contractor {
  _id: string;
  contractorName: string;
  contractorOrganizationName: string;
  contactDetails: {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
  };
}

export default function ContractorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ["contractors"],
    queryFn: getContractors,
  });

  const filteredContractors = contractors.filter(
    (item: Contractor) =>
      item.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contractorOrganizationName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.contactDetails.phone.includes(searchTerm) ||
      item.contactDetails.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContractors.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Contractors
          </h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Label
              htmlFor="search"
              className="whitespace-nowrap font-semibold text-gray-700"
            >
              Search Contractor:
            </Label>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name, org, phone..."
                className="pl-9 bg-white border-gray-200 focus:border-[#136FB6] focus:ring-[#136FB6]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              List of Contractors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-100">
                    <TableHead className="w-12 py-4 pl-6 font-semibold text-gray-600">
                      S No.
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Contractor Name
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Organization
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Contact Info
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Address
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        Loading contractors...
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        {searchTerm
                          ? "No contractors match your search"
                          : "No contractors found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item: Contractor, index: number) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-[#136FB6]/5/30 transition-colors"
                      >
                        <TableCell className="pl-6 py-4 font-medium text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#136FB6]/10 flex items-center justify-center flex-shrink-0 text-[#105E9A]">
                              <User size={14} />
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.contractorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Building2 size={16} className="text-gray-400" />
                            <span className="text-gray-700">
                              {item.contractorOrganizationName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-400" />
                              {item.contactDetails.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-400" />
                              {item.contactDetails.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1 text-sm text-gray-600 max-w-[200px]">
                            <div className="flex items-start gap-2">
                              <MapPin
                                size={14}
                                className="text-gray-400 mt-0.5 flex-shrink-0"
                              />
                              <span>
                                {item.contactDetails.address},{" "}
                                {item.contactDetails.city},{" "}
                                {item.contactDetails.state}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredContractors.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredContractors.length}
                  </span>{" "}
                  contractors
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 p-0 ${currentPage === page ? "bg-[#136FB6] hover:bg-[#105E9A]" : ""}`}
                      >
                        {page}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
