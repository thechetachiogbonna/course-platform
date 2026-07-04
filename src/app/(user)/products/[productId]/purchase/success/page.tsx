import { db } from "@/database/db";
import { CheckCircle2, ArrowRight, BookOpen, Sparkles, FolderLock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatString } from "@/lib/utils";

interface ProductInterface {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  courses: {
    id: string;
    name: string;
    description: string;
    section_count: number;
    lesson_count: number;
  }[] | null;
}

async function getProduct(id: string) {
  const result = await db.query(
    `
      SELECT
        p.*,
        c.id AS course_id,
        c.name AS course_name,
        c.description AS course_description,
        COALESCE(counts.section_count, 0) AS section_count,
        COALESCE(counts.lesson_count, 0) AS lesson_count
      FROM products p
      LEFT JOIN course_products cp
        ON p.id = cp.product_id
      LEFT JOIN courses c
        ON c.id = cp.course_id
      LEFT JOIN (
        SELECT
          c.id AS course_id,
          COUNT(DISTINCT s.id) AS section_count,
          COUNT(DISTINCT l.id) AS lesson_count
        FROM courses c
        LEFT JOIN sections s
          ON s.course_id = c.id
          AND s.status = 'public'
        LEFT JOIN lessons l
          ON l.section_id = s.id
          AND l.status IN ('public', 'preview')
        GROUP BY c.id
      ) counts ON counts.course_id = c.id
      WHERE p.id = $1 AND p.status = 'public'
      ORDER BY c.name ASC
    `,
    [id],
  );

  if (!result.rows.length) return null;

  const product = result.rows[0];
  const coursesMap = new Map<string, any>();

  for (const row of result.rows) {
    if (!row.course_id) continue;

    if (!coursesMap.has(row.course_id)) {
      coursesMap.set(row.course_id, {
        id: row.course_id,
        name: row.course_name,
        description: row.course_description,
        section_count: Number(row.section_count || 0),
        lesson_count: Number(row.lesson_count || 0),
      });
    }
  }

  return {
    ...product,
    imageUrl: product.image_url,
    courses: Array.from(coursesMap.values()),
  } as ProductInterface;
}

export default async function PurchaseSuccessPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) notFound();

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-2 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none glow-bg z-0" />

      <div className="relative z-10 flex flex-col items-center text-center mb-10">
        {/* Animated Celebration Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-yellow/20 blur-xl animate-pulse w-20 h-20 -m-2" />
          <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow relative">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Purchase Successful!
        </h1>
        <p className="text-sm md:text-base text-[#c9c8ab] max-w-xl leading-relaxed">
          Thank you for your purchase! You have successfully unlocked lifetime access to the courses included in <span className="text-white font-semibold">{product.name}</span>.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl overflow-hidden electric-glow-large relative z-10 mb-8">
        {/* Product Hero Header */}
        <div className="relative h-48 md:h-64 w-full bg-[#1c1b1b]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover opacity-80"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/45 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest bg-brand-yellow/15 border border-brand-yellow/20 px-2.5 py-1 rounded-md mb-2 inline-block">
                Unlocked Lifetime Access
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-1">
                {product.name}
              </h2>
            </div>
            <div className="text-xs text-[#c9c8ab] shrink-0 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#252525]">
              {formatString({
                number: Number(product.courses?.length),
                plural: "courses",
                singular: "course",
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-[#929277] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FolderLock className="w-3.5 h-3.5" />
              Your Unlocked Courses
            </h3>

            <div className="space-y-3">
              {product.courses && product.courses.length > 0 ? (
                product.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#141414]/90 rounded-xl border border-[#252525] hover:border-brand-yellow/30 transition-all group"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-yellow transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-xs text-[#c9c8ab] line-clamp-1 max-w-lg">
                        {course.description || "Start learning right away with curated lessons."}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-4 justify-between md:justify-end">
                      <span className="text-[11px] text-[#929277] bg-[#1c1b1b] px-2.5 py-1 rounded border border-[#252525]">
                        {formatString({
                          number: Number(course.section_count),
                          plural: "Sections",
                          singular: "Section",
                        })} • {formatString({
                          number: Number(course.lesson_count),
                          plural: "Lessons",
                          singular: "Lesson",
                        })}
                      </span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-xs font-bold text-brand-yellow flex items-center gap-1 hover:brightness-110"
                      >
                        Start Learning
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-[#929277]">
                  No courses are linked to this product yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
        <Link
          href="/courses"
          className="w-full sm:w-auto px-8 py-3.5 bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Go to My Courses</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1c1b1b] border border-[#252525] hover:bg-[#252525] active:scale-95 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-brand-yellow" />
          <span>Explore More Products</span>
        </Link>
      </div>
    </div>
  );
}
