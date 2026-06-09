"use client"

import { useMemo, useState } from "react"
import { Check, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fieldInputClassName } from "@/lib/form-styles"
import { cn } from "@/lib/utils"

interface ProductMultiSelectProps {
  products: Product[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyMessage?: string
  inputClassName?: string
}

export default function ProductMultiSelect({
  products,
  value,
  onChange,
  placeholder = "Search linked product SKU...",
  emptyMessage = "No matching hardware SKUs found",
  inputClassName,
}: ProductMultiSelectProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const query = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query),
    )
  }, [products, search])

  const toggleProduct = (sku: string) => {
    if (value.includes(sku)) {
      onChange(value.filter((id) => id !== sku))
    } else {
      onChange([...value, sku])
    }
  }

  const removeProduct = (sku: string) => {
    onChange(value.filter((id) => id !== sku))
  }

  const selectedProducts = products.filter((p) => value.includes(p.sku))

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-500">
              <Search className="h-4 w-4" />
            </span>
            <Input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              className={cn(fieldInputClassName, "pl-12", inputClassName)}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-(--radix-popover-trigger-width) gap-0 rounded-xl border-[#252525] bg-[#131313] p-0 shadow-2xl ring-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ScrollArea className="max-h-48">
            {filteredProducts.length === 0 ? (
              <div className="p-3 text-xs text-gray-500 italic">
                {emptyMessage}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const isSelected = value.includes(p.sku)
                  return (
                    <Button
                      key={p.id}
                      type="button"
                      variant="ghost"
                      onClick={() => toggleProduct(p.sku)}
                      className="h-auto w-full justify-between rounded-none p-3 text-left text-xs text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {p.sku} — ${p.price}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-[#e2ec00]" />
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedProducts.map((p) => (
            <Badge
              key={p.id}
              variant="outline"
              className="gap-1 border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[10px] text-gray-300"
            >
              {p.sku}
              <button
                type="button"
                onClick={() => removeProduct(p.sku)}
                className="rounded-full hover:text-white"
                aria-label={`Remove ${p.sku}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
