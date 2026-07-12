'use client'

import React, { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export type SortDirection = 'asc' | 'desc' | null

export function useTableSort<T>(items: T[], initialField?: keyof T, initialDirection: SortDirection = 'asc') {
  const [sortField, setSortField] = useState<keyof T | null>(initialField || null)
  const [sortDir, setSortDir] = useState<SortDirection>(initialDirection)

  function requestSort(field: keyof T) {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedItems = useMemo(() => {
    if (!sortField || !sortDir) return items

    return [...items].sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]

      if (valA === undefined || valA === null) return 1
      if (valB === undefined || valB === null) return -1

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      return sortDir === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA)
    })
  }, [items, sortField, sortDir])

  return {
    sortedItems,
    sortField,
    sortDir,
    requestSort
  }
}

export function SortableHeader<T>({
  label,
  field,
  sortField,
  sortDir,
  onSort,
  className = ''
}: {
  label: string
  field: keyof T
  sortField: keyof T | null
  sortDir: SortDirection
  onSort: (field: keyof T) => void
  className?: string
}) {
  const isActive = sortField === field

  return (
    <th
      onClick={() => onSort(field)}
      className={`p-4 cursor-pointer hover:text-white transition-colors select-none ${className}`}
    >
      <div className="inline-flex items-center gap-1.5 font-semibold">
        <span>{label}</span>
        {isActive ? (
          sortDir === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-on-surface-variant/60" />
        )}
      </div>
    </th>
  )
}
