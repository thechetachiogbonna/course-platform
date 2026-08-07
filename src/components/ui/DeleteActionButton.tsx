"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteActionResult {
  error?: boolean;
  message?: string;
}

interface DeleteActionButtonProps {
  onDelete: () => Promise<DeleteActionResult | void>;
  itemName: string;
  title?: string;
  description?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
}

export default function DeleteActionButton({
  onDelete,
  itemName,
  title = "Delete",
  description,
  successMessage,
  errorMessage = "Failed to delete item",
  className,
  iconClassName,
  disabled = false,
}: DeleteActionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await onDelete();

      if (
        result &&
        typeof result === "object" &&
        "error" in result &&
        result.error
      ) {
        toast.error(result.message ?? errorMessage);
      } else {
        toast.success(
          result?.message ??
            successMessage ??
            `${itemName} deleted successfully`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          disabled={isDeleting || disabled}
          className={className}
          title={title}
          aria-label={title}
          type="button"
        >
          <Trash2 className={iconClassName} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              `This action cannot be undone. This will permanently delete "${itemName}".`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
