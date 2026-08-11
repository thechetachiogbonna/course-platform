"use client";

import { GripVertical } from "lucide-react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useTransition } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { toast } from "sonner";

interface SortableLists<T> {
  lists: T[];
  courseId: string;
  children: (items: T[], isPending: boolean) => ReactNode;
  orderChangeHandler: (
    newOrder: string[],
    courseId: string,
  ) => Promise<{ error: boolean; message: string }>;
}

export function SortableList<T extends { id: string }>({
  lists,
  courseId,
  children,
  orderChangeHandler,
}: SortableLists<T>) {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(lists);
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const {
          operation: { source },
        } = event;
        if (isSortable(source)) {
          const { initialIndex, index } = source;
          if (initialIndex === index) return;

          let newItems = [] as typeof lists;

          setItems((items) => {
            newItems = move(items, event).map((item, index) => {
              return {
                ...item,
                order: index + 1,
              };
            }) as T[];

            return newItems;
          });

          startTransition(async () => {
            const { error, message } = await orderChangeHandler(
              newItems.map((item) => item.id),
              courseId,
            );

            if (error) {
              setItems(lists);
              toast.error(message);
            } else {
              toast.success(message);
            }
          });
        }
      }}
    >
      {children(items, isPending)}
    </DragDropProvider>
  );
}

export function SortableItem({
  children,
  id,
  index,
  isPending,
  listType,
}: {
  children: ReactNode;
  id: string;
  index: number;
  isPending: boolean;
  listType: "section" | "lesson";
}) {
  const { ref, handleRef, isDragSource } = useSortable({
    id,
    index,
    group: listType,
  });

  return (
    <div
      className={cn(
        "",
        isDragSource && "bg-white/5 border border-white/50",
        isPending && "opacity-50 cursor-not-allowed",
      )}
      ref={ref}
      aria-disabled={isPending}
    >
      <div className={cn("flex", listType === "lesson" && "items-center")}>
        <div
          ref={handleRef}
          className={cn(
            "p-2 rounded-lg shrink-0 mt-0.5 hover:cursor-grab h-max",
            isPending && "opacity-50 cursor-not-allowed",
            listType === "section" && "mt-6",
          )}
        >
          <GripVertical
            aria-hidden={isPending}
            aria-disabled={isPending}
            className="w-4 h-4"
          />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
