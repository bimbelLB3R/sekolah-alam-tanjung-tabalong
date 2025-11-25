import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'

export function FilterSection({ 
  search, 
  setSearch, 
  showFilters, 
  setShowFilters,
  filterSupervisor,
  setFilterSupervisor,
  filterDateFrom,
  setFilterDateFrom,
  filterDateTo,
  setFilterDateTo,
  users,
  clearFilters,
  setPage
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama rapat atau agenda..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t">
          <div>
            <Label className="text-sm">Pembimbing</Label>
            <Select value={filterSupervisor} onValueChange={(val) => { setFilterSupervisor(val); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Semua pembimbing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Dari Tanggal</Label>
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1) }}
            />
          </div>
          <div>
            <Label className="text-sm">Sampai Tanggal</Label>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => { setFilterDateTo(e.target.value); setPage(1) }}
            />
          </div>
          <div className="md:col-span-3">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" /> Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}