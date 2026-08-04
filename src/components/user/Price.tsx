import { formatPrice } from "@/lib/utils";

export default function Price({
  price,
  coupon,
}: {
  price: number;
  coupon: Coupon;
}) {
  if (price === 0 || coupon == null) {
    return (
      <span className="font-display font-bold text-lg text-brand-yellow">
        {formatPrice(price)}
      </span>
    );
  }

  return (
    <div className="flex gap-2 items-baseline">
      <div>{formatPrice(price * (1 - coupon.discountPercentage))}</div>
      <div className="line-through text-xs opacity-50">
        {formatPrice(price)}
      </div>
    </div>
  );
}
