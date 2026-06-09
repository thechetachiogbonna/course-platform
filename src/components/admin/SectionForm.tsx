"use client";

import { Book, Edit3, Plus, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  dialogContentClassName,
  fieldInputClassName,
  fieldLabelAltClassName,
  selectTriggerDarkClassName,
} from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import { createSection } from "@/features/sections/action";
import { toast } from "sonner";

const sectionFormSchema = z.object({
  name: z.string().min(1, "Please enter a section name."),
  status: z.enum(["public", "private"]),
  order: z.number().min(1, "Order must be at least 1."),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface SectionFormProps {
  courseName: string;
  courseId: string;
}

export default function SectionForm({
  courseName,
  courseId,
}: SectionFormProps) {
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: "",
      status: "public",
      order: 1,
    },
  });

  const courseTitle = courseName;

  const handleSubmit = async (values: SectionFormValues) => {
    const result = await createSection({ courseId, ...values });
    if (result.error) {
      toast.error(result.message);
    } else {
      form.reset();
      toast.success(result.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-[#e2ec00]/10 border border-[#e2ec00]/30 text-[#e2ec00] text-xs font-bold py-2 px-4 rounded-xl hover:bg-[#e2ec00]/20 transition-all flex items-center gap-1 uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Section</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(dialogContentClassName, "max-w-xl")}
        showCloseButton={false}
      >
        <div className="mx-auto w-full max-w-xl flex-1 space-y-8">
          <div className="space-y-3">
            <DialogTitle className="font-sans text-3xl font-extrabold tracking-tight text-white">
              Add New Section
            </DialogTitle>

            <div className="flex items-center gap-3 rounded-2xl border border-[#252525] bg-[#1c1b1b] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e2ec00]/20 bg-[#e2ec00]/10 text-[#e2ec00]">
                <Book />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[#c9c8ab] uppercase">
                  ADDING TO COURSE
                </p>
                <p className="text-sm font-extrabold text-white">
                  {courseTitle}
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="relative space-y-6 overflow-hidden rounded-2xl border border-[#252525] bg-[#1a1a1a]/80 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-[#e2ec00] to-transparent opacity-40" />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelAltClassName}>
                      Section Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g. Introduction to Transformers"
                          className={cn(fieldInputClassName, "pr-12")}
                          {...field}
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30">
                          <Edit3 className="h-4 w-4" />
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={fieldLabelAltClassName}>
                        Publication Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerDarkClassName}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#252525] bg-[#131313] text-white">
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">
                            Private (Draft)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={fieldLabelAltClassName}>
                        Display Order
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className={fieldInputClassName}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex h-auto flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#e2ec00] py-3.5 text-xs font-bold tracking-wider text-[#1c1d00] uppercase shadow-[0_4px_12px_rgba(226,236,0,0.15)] hover:brightness-110 active:scale-95"
                >
                  {form.formState.isSubmitting ? (
                    "Creating section"
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Add Section
                    </>
                  )}
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto flex-1 rounded-xl border-[#353534] bg-transparent py-3.5 text-xs font-bold text-[#c9c8ab] uppercase hover:bg-white/5 hover:text-white"
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
  );
}
