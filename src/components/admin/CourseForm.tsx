"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  cancelButtonClassName,
  dialogContentClassName,
  fieldInputClassName,
  fieldLabelClassName,
  submitButtonClassName,
} from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import { createCourse } from "@/features/courses/action"
import { toast } from "sonner"

const courseFormSchema = z.object({
  name: z.string().min(1, "Please enter a course name."),
  description: z.string()
})

type CourseFormValues = z.infer<typeof courseFormSchema>

export default function CourseForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: ""
    },
  })

  const handleSubmit = async (values: CourseFormValues) => {
    const result = await createCourse(values)
    if (result.error) {
      toast.error(result.message)
    } else {
      form.reset()
      toast.success(result.message)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-full md:w-auto bg-[#e2ec00] text-[#1c1d00] hover:brightness-110 active:scale-95 transition-all px-5 py-3 rounded-xl font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_rgba(226,236,0,0.15)] uppercase select-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(dialogContentClassName, "max-w-xl")}
        showCloseButton={false}
      >
        <div className="mx-auto w-full max-w-xl flex-1 space-y-8">
          <div className="flex items-center justify-between border-b border-[#252525]/30 pb-4">
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-white/5"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-[#e2ec00]" />
                </Button>
              </DialogClose>
              <span className="text-sm font-extrabold tracking-wider text-white uppercase">
                New Course
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <DialogTitle className="font-sans text-3xl font-extrabold tracking-tight text-white">
              Create Course
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Define the core curriculum details for your new learning path.
            </DialogDescription>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelClassName}>
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Master Class: Prompt Engineering"
                        className={fieldInputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelClassName}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe the learning outcomes and target audience..."
                        className={cn(fieldInputClassName, "min-h-0 resize-none")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 pt-4">
                <Button type="submit" className={submitButtonClassName} disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Course"}
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cancelButtonClassName}
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
