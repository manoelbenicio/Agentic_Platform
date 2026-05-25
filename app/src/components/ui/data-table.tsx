"use client"

import { cn } from "@/lib/utils"
import { useState, useMemo, useCallback, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react"

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  align?: "left" | "center" | "right"
  mono?: boolean
  render?: (value: unknown, row: T) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  className?: string
}

type SortDir = "asc" | "desc" | null

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const handleSort = useCallback(
    (colIndex: number) => {
      if (sortCol === colIndex) {
        setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"))
        if (sortDir === "desc") setSortCol(null)
      } else {
        setSortCol(colIndex)
        setSortDir("asc")
      }
      setPage(0)
    },
    [sortCol, sortDir]
  )

  const sorted = useMemo(() => {
    if (sortCol === null || sortDir === null) return data
    const col = columns[sortCol]
    const accessor =
      typeof col.accessor === "function" ? col.accessor : (r: T) => r[col.accessor as keyof T]
    return [...data].sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      if (va == null || vb == null) return 0
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [data, columns, sortCol, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const getCellValue = (row: T, col: Column<T>): ReactNode => {
    const raw =
      typeof col.accessor === "function"
        ? col.accessor(row)
        : row[col.accessor]
    if (col.render) return col.render(raw, row)
    return raw as ReactNode
  }

  const alignCls = (a?: string) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left"

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "sticky top-0 z-10 cursor-pointer select-none whitespace-nowrap px-4 py-2.5",
                  "text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--indra-light)]",
                  "bg-[rgba(0,43,58,0.6)] backdrop-blur-sm",
                  "border-b border-[var(--indra-border)]",
                  "transition-colors hover:text-[var(--indra-cyan)]",
                  alignCls(col.align)
                )}
                onClick={() => handleSort(i)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {sortCol === i ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  ) : (
                    <ChevronsUpDown className="h-3 w-3 opacity-30" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, ri) => (
            <tr
              key={ri}
              className={cn(
                "border-b border-[var(--indra-border)] transition-all duration-200",
                "hover:bg-[rgba(0,176,189,0.04)] hover:shadow-[inset_3px_0_0_var(--indra-cyan)]"
              )}
            >
              {columns.map((col, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-[13px]",
                    alignCls(col.align),
                    col.mono
                      ? "font-[var(--font-mono)] text-[var(--indra-white)]"
                      : "text-[var(--indra-blue-gray)]"
                  )}
                  style={col.mono ? { fontFamily: "var(--font-mono)", fontFeatureSettings: "'tnum'" } : undefined}
                >
                  {getCellValue(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--indra-border)] px-4 py-2.5">
          <span
            className="text-[11px] text-[var(--indra-light)]"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            Página {page + 1} de {totalPages} · {sorted.length} registros
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded",
                "border border-[var(--indra-border)] transition-colors",
                "hover:bg-[rgba(0,176,189,0.08)] disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 text-[var(--indra-light)]" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded",
                "border border-[var(--indra-border)] transition-colors",
                "hover:bg-[rgba(0,176,189,0.08)] disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-3.5 w-3.5 text-[var(--indra-light)]" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
