"use client"

import { Button } from "@/components/ui/button"
// import { ButtonIcon } from "@/components/ui/buttonIcon"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import * as React from "react"
// import { ArrowUp, ArrowDown } from "lucide-react";
// import { useState } from "react";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  })

  return (
    <div>
    <div className="rounded-md border border-[#E4E4E7]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-[#E4E4E7]">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-gray-400 text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                // data-state={row.getIsSelected() && "selected"}
                className="border-[#E4E4E7]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center text-[#232323] text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
      <div className="flex items-center justify-between space-x-4 py-4">
        <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex justify-between space-x-2">
        <Button variant="outline" size="icon"
          className="border-[#E4E4E7] hover:bg-gray-200 cursor-pointer" 
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          <ChevronsLeft />
        </Button>
        <Button variant="outline" size="icon" 
          className="border-[#E4E4E7] hover:bg-gray-200 cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" 
          className="border-[#E4E4E7] hover:bg-gray-200 cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          <ChevronRight />
        </Button>
        <Button variant="outline" size="icon" 
          className="border-[#E4E4E7] hover:bg-gray-200 cursor-pointer"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          <ChevronsRight />
        </Button>
        </div>
      </div>

    </div>
  )
}