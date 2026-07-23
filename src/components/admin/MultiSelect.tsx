"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fieldInputAltClassName } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

interface CourseMultiSelectProps {
  courses: Course[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export default function MultiSelect({
  courses,
  value,
  onChange,
  placeholder = "Search courses to attach...",
  emptyMessage = "No matching courses found",
}: CourseMultiSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    const query = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query),
    );
  }, [courses, search]);

  const toggleCourse = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((courseId) => courseId !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeCourse = (id: string) => {
    onChange(value.filter((courseId) => courseId !== id));
  };

  const selectedCourses = courses.filter((c) => value.includes(c.id));

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
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              className={cn(fieldInputAltClassName, "pl-12")}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-(--radix-popover-trigger-width) gap-0 rounded-xl border-[#252525] bg-[#131313] p-0 shadow-2xl ring-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ScrollArea className="max-h-48 overflow-y-scroll">
            {filteredCourses.length === 0 ? (
              <div className="p-3 text-xs text-gray-500 italic">
                {emptyMessage}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredCourses.map((c) => {
                  const isSelected = value.includes(c.id);
                  return (
                    <Button
                      key={c.id}
                      type="button"
                      variant="ghost"
                      onClick={() => toggleCourse(c.id)}
                      className="h-auto w-full justify-between rounded-none p-3 text-left text-xs text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {c.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-brand-yellow" />
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedCourses.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCourses.map((c) => (
            <Badge
              key={c.id}
              variant="outline"
              className="gap-1 border-[#252525] bg-[#1a1a1a] px-2 py-1 text-[10px] text-gray-300"
            >
              {c.name}
              <button
                type="button"
                onClick={() => removeCourse(c.id)}
                className="rounded-full hover:text-white"
                aria-label={`Remove ${c.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
