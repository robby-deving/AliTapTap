"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonIcon } from "@/components/ui/buttonIcon"
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
    {/* Pagination Controls */}
    {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </div> */}
      
      <div className="flex items-center justify-between space-x-4 py-4">
        <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex justify-between space-x-2">
          <ButtonIcon 
            direction="double-left" 
            onClick={() => table.firstPage()} 
            disabled={!table.getCanPreviousPage()} 
          />
          <ButtonIcon 
            direction="left" 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()} 
          />
          <ButtonIcon 
            direction="right" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()} 
          />
          <ButtonIcon 
            direction="double-right" 
            onClick={() => table.lastPage()} 
            disabled={!table.getCanNextPage()} 
          />
        </div>
        
      </div>

    </div>
  )
}
