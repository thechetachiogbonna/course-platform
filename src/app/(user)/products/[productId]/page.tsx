import Image from "next/image";
import { db } from "@/database/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatString } from "@/lib/utils";
import Price from "@/components/user/Price";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { userOwnsProduct } from "@/features/products/action";
import { getCurrentUser } from "@/features/users/action";
import { getUserCoupon } from "@/lib/user-country-header";

interface ProductInterface {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  courses:
    | {
        id: string;
        name: string;
        description: string;
        section_count: number;
        lesson_count: number;
      }[]
    | null;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const [product, { user }, coupon] = await Promise.all([
    getProduct(productId),
    getCurrentUser(),
    getUserCoupon(),
  ]);

  if (!product) notFound();

  const totalLessons = product.courses?.reduce(
    (acc, course) => acc + Number(course.lesson_count || 0),
    0,
  );
  const totalSections = product.courses?.reduce(
    (acc, course) => acc + Number(course.section_count || 0),
    0,
  );

  const ownsProduct = await userOwnsProduct(user.id, productId);

  return (
    <div className="w-full max-w-5xl mx-auto pb-28">
      <section className="relative w-full h-72 md:h-100 rounded-2xl overflow-hidden mb-8 mx-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-5 pb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#929277] ml-1">1.2k students</span>
            </div>
            <span className="text-[#929277] text-xs">•</span>
            <span className="text-xs text-[#929277]">
              {formatString({
                number: Number(product.courses?.length),
                plural: "courses",
                singular: "course",
              })}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-0">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">
              About this product
            </h2>
            <p className="text-sm text-[#c9c8ab] leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Courses</h2>
              <span className="text-xs text-[#929277]">
                {formatString({
                  number: Number(totalSections),
                  plural: "Sections",
                  singular: "Section",
                })}{" "}
                •{" "}
                {formatString({
                  number: Number(totalLessons),
                  plural: "Lessons",
                  singular: "Lesson",
                })}
              </span>
            </div>

            <div className="space-y-2">
              {product?.courses?.map((course) => {
                return (
                  <div
                    key={course.id}
                    className="border border-[#252525] rounded-xl overflow-hidden transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="w-full flex items-center justify-between p-4 bg-[#1c1b1b] hover:bg-[#201f1f] transition-colors text-left">
                      <div className="flex flex-col items-start gap-0.5">
                        <div className="text-sm font-semibold text-white">
                          {course.name}
                        </div>

                        <div className="mt-2 text-xs text-[#c9c8ab]">
                          {formatString({
                            number: Number(course.section_count),
                            plural: "Sections",
                            singular: "Section",
                          })}{" "}
                          •{" "}
                          {formatString({
                            number: Number(course.lesson_count),
                            plural: "Lessons",
                            singular: "Lesson",
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-brand-yellow whitespace-nowrap text-xs font-bold py-2 px-4 rounded-xl hover:bg-brand-yellow/10 transition-all flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span className="text-nowrap">View Course</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right — sticky sidebar */}
        <div>
          <div className="glass-card rounded-xl p-6 lg:sticky lg:top-24 electric-glow">
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <Price price={product.price} coupon={coupon} />
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-6">
              {ownsProduct ? (
                <Link
                  href={`/courses/${product.courses?.[0].id}`}
                  className="flex items-center justify-center gap-2 w-full bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] font-bold text-sm py-3 rounded-xl transition-all shadow-md"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Learning
                </Link>
              ) : (
                <Link
                  href={`/products/${product.id}/purchase`}
                  className="block text-center w-full bg-brand-yellow hover:brightness-110 active:scale-95 text-[#1b1d00] font-bold text-sm py-3 rounded-xl transition-all shadow-md"
                >
                  Buy Now
                </Link>
              )}
            </div>

            {/* Instructor */}
            <div className="mt-6 pt-6 border-t border-[#252525]">
              <p className="text-[10px] font-bold text-[#929277] uppercase tracking-widest mb-3">
                Instructor
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-brand-yellow/20 shrink-0 bg-[#252525]">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs3pPs1hkW_6w4pjePAjrFcjanIpqDOgV7_Ne5cAFfCQJmxA21i3i-oBtbDJVYJaqQSp86NeMFUkxqzQIJbyg5Eu1HVArf0fmf6cBsmp-ytO4dFsUn5n-AsBpD_g5u71MbVOl-IEgU6hNnte73XLgxN_VMKruKif6o91kwI9XWbsOfoh-Q_ZMhGbrsb8B_6lvWBisQEXMDYvzm1g2FLe6b4EEa7KLdxmFR4c3KJeq3r6Ry6zKOLVSWi9wRJwM5GNcLzO5Ua8chblo"
                    alt="Dr. Felix Thorne"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Dr. Felix Thorne
                  </p>
                  <p className="text-xs text-[#929277]">
                    Principal AI Architect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
