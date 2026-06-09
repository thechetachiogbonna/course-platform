"use client";

import { ReactNode } from "react";
import { FolderOpen, Link, PlusCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  fieldInputAltClassName,
  fieldLabelAltClassName,
  selectTriggerClassName,
} from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import { createLesson } from "@/features/lessons/action";
import { toast } from "sonner";

const lessonFormSchema = z.object({
  name: z.string().min(1, "Please enter a lesson name."),
  description: z.string(),
  youtubeVideoId: z.string().min(1, "Please proveide a youtube video Id"),
  status: z.enum(["public", "private", "preview"]),
  order: z.number().min(1, "Order must be at least 1."),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
  sectionName: string;
  sectionId: string;
  children: ReactNode;
}

export default function LessonForm({
  sectionName,
  sectionId,
  children,
}: LessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      name: "",
      description: "",
      youtubeVideoId: "",
      status: "preview",
      order: 1,
    },
  });

  const handleSubmit = async (values: LessonFormValues) => {
    const result = await createLesson({ sectionId, ...values });

    if (result.error) {
      toast.error(result.message);
    } else {
      form.reset();
      toast.success(result.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-start">
        {children}
      </DialogTrigger>
      <DialogContent className={dialogContentClassName} showCloseButton={false}>
        <div className="w-full flex-1 space-y-8">
          <section className="space-y-3">
            <DialogTitle className="font-sans text-3xl font-extrabold tracking-tight text-white">
              New Lesson
            </DialogTitle>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-[#201f1f] px-3 py-2 shadow-inner">
              <FolderOpen className="h-4 w-4 text-[#e2ec00]" />
              <span className="text-xs leading-none font-medium text-[#c9c8ab]">
                Adding to Section:{" "}
                <span className="font-semibold text-[#e2ec00]">
                  {sectionName}
                </span>
              </span>
            </div>
          </section>

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
                    <FormLabel
                      className={cn(fieldLabelAltClassName, "ml-1 block")}
                    >
                      Lesson Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Intro to Transformer Models"
                        className={fieldInputAltClassName}
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
                    <FormLabel
                      className={cn(fieldLabelAltClassName, "ml-1 block")}
                    >
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Briefly describe what students will learn..."
                        className={cn(
                          fieldInputAltClassName,
                          "min-h-0 resize-none",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtubeVideoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(fieldLabelAltClassName, "ml-1 block")}
                    >
                      YouTube Video ID
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-white/30">
                          <Link className="h-4 w-4" />
                        </span>
                        <Input
                          placeholder="dQw4w9WgXcQ"
                          className={cn(
                            fieldInputAltClassName,
                            "pl-12 font-mono",
                          )}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(fieldLabelAltClassName, "ml-1 block")}
                      >
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerClassName}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#252525] bg-[#1a1a1a] text-white">
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="preview">Preview</SelectItem>
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
                      <FormLabel
                        className={cn(fieldLabelAltClassName, "ml-1 block")}
                      >
                        Display Order
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className={fieldInputAltClassName}
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

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex h-auto w-full items-center justify-center gap-1.5 rounded-xl bg-[#e2ec00] py-4 text-xs font-bold tracking-wider text-[#1c1d00] uppercase shadow-[0_4px_12px_rgba(226,236,0,0.15)] hover:brightness-110 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Lesson
                </Button>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto w-full rounded-xl border-[#252525] bg-transparent py-4 text-xs font-bold tracking-wider text-[#c9c8ab] uppercase hover:bg-white/5 hover:text-white"
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
