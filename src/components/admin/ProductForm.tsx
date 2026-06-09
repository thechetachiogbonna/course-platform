"use client"

import { useMemo } from "react"
import {
  ChevronRight,
  FileText,
  Link,
  DollarSign,
  Eye,
} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import CourseMultiSelect from "@/components/admin/CourseMultiSelect"
import { INITIAL_COURSES } from "@/app/constants"
import {
  fieldInputAltClassName,
  fieldLabelAltClassName,
  selectTriggerDarkClassName,
} from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import { createProduct } from "@/features/products/action"
import { toast } from "sonner"

const productFormSchema = z.object({
  name: z.string().min(1, "Please specify a valid product name."),
  courseIds: z.array(z.string()),
  description: z.string(),
  imageUrl: z.string(),
  price: z.number().min(0, "Price must be zero or greater."),
  status: z.enum(["public", "private"]),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  selectedCourses?: Course[]
  initialProduct?: Product | null
  courses: Course[]
}

export default function ProductForm({
  selectedCourses,
  initialProduct,
  courses
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialProduct?.name ?? "",
      courseIds: selectedCourses?.map((course) => course.id) ?? [],
      description: initialProduct?.description ?? "",
      imageUrl: initialProduct?.imageUrl ?? "",
      price: initialProduct?.price ?? 0,
      status: initialProduct?.status ?? "public",
    },
  })

  const {
    name: watchedName,
    courseIds: watchedCourseIds,
    description: watchedDescription,
    imageUrl,
    price: watchedPrice,
    status: watchedStatus,
  } = form.watch()

  const haveNotBeenEditted = useMemo(() => {
    if (!initialProduct) return false

    const initialCourseIds = [...(initialProduct.courses?.map((c) => c.id) || [])].sort()
    const currentCourseIds = [...(watchedCourseIds || [])].sort()

    return (
      initialProduct.name === (watchedName || "").trim() &&
      JSON.stringify(initialCourseIds) === JSON.stringify(currentCourseIds) &&
      initialProduct.description === (watchedDescription || "").trim() &&
      initialProduct.imageUrl === (imageUrl || "").trim() &&
      initialProduct.price === watchedPrice &&
      initialProduct.status === watchedStatus
    )
  }, [
    initialProduct,
    watchedName,
    watchedCourseIds,
    watchedDescription,
    imageUrl,
    watchedPrice,
    watchedStatus,
  ])

  console.log(haveNotBeenEditted)

  const handleSubmit = async (values: ProductFormValues) => {
    const result = await createProduct(values);

    if (result.error) {
      toast.error(result.message);
    } else {
      form.reset();
      toast.success(result.message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 pb-32">
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c9c8ab]">
          <span>Products</span>
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
          <span className="font-mono font-medium text-[#e2ec00]">
            New Product
          </span>
        </div>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white">
          {initialProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-sm text-[#c9c8ab]">
          Configure details, pricing, and availability settings for your product.
        </p>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <div className="space-y-5 rounded-2xl border border-[#252525] bg-[#1a1a1a]/80 p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-[#252525]/50 pb-3">
              <FileText className="h-5 w-5 text-[#e2ec00]" />
              <h3 className="text-base font-bold tracking-tight text-white">
                Product Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelAltClassName}>
                      Product Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Neural Beat Matching Masterclass"
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
                name="courseIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabelAltClassName}>
                      Attach Course(s)
                    </FormLabel>
                    <FormControl>
                      <CourseMultiSelect
                        courses={courses}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Check available courses for your product."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={fieldLabelAltClassName}>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe the learning objectives and AI features..."
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
          </div>

          {imageUrl && (
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt="Product Cover"
                className="h-48 w-full rounded-2xl border border-[#252525] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="space-y-5 rounded-2xl border border-[#252525] bg-[#1a1a1a]/80 p-6 backdrop-blur-md">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={fieldLabelAltClassName}>
                    Image URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute top-1/2 left-4 -translate-y-1/2 text-white/30">
                        <Link className="h-4 w-4" />
                      </span>
                      <Input
                        type="url"
                        placeholder="https://cloud.nudge.ai/v1/assets/..."
                        className={cn(
                          fieldInputAltClassName,
                          "pl-12 font-mono text-xs",
                        )}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-[#252525] bg-[#1a1a1a]/80 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-[#252525]/50 pb-2">
                <span className="shrink-0 rounded bg-[#e2ec00]/10 p-1 text-[#e2ec00]">
                  <DollarSign className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  Pricing Configuration
                </h3>
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-extrabold tracking-widest text-[#c9c8ab] uppercase">
                      Unit Price (USD)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono font-bold text-[#e2ec00]">
                          $
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          className={cn(
                            fieldInputAltClassName,
                            "pl-8 font-mono",
                          )}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-[#252525] bg-[#1a1a1a]/80 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-[#252525]/50 pb-2">
                <span className="shrink-0 rounded bg-[#e2ec00]/10 p-1 text-[#e2ec00]">
                  <Eye className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  Availability Status
                </h3>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-extrabold tracking-widest text-[#c9c8ab] uppercase">
                      Visibility Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={selectTriggerDarkClassName}>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-[#252525] bg-[#131313] text-white">
                        <SelectItem value="public">
                          Public - Marketplace Listing
                        </SelectItem>
                        <SelectItem value="private">
                          Private - Sandbox/Cohort Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-[#252525]/40 pt-6 sm:flex-row">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || haveNotBeenEditted}
              className="h-auto w-full rounded-xl bg-[#e2ec00] px-8 py-4 text-xs font-bold tracking-wider text-[#1c1d00] uppercase shadow-[0_4px_16px_rgba(226,236,0,0.25)] hover:brightness-110 active:scale-95 sm:w-auto"
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : initialProduct
                  ? "Apply Configuration"
                  : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
