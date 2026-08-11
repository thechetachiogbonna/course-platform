"use server";

import { db } from "@/database/db";
import { revalidatePath } from "next/cache";

export const createProduct = async (
  productData: Pick<
    Product,
    "name" | "description" | "imageUrl" | "price" | "status"
  > & { courseIds: string[] },
) => {
  try {
    await db.query("BEGIN");

    const productResult = await db.query(
      `
            INSERT INTO products (
                name,
                description,
                image_url,
                price,
                status
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
      [
        productData.name,
        productData.description,
        productData.imageUrl,
        productData.price,
        productData.status,
      ],
    );

    const productId = productResult.rows[0].id;

    for (const courseId of productData.courseIds) {
      await db.query(
        `
                    INSERT INTO course_products (
                        course_id,
                        product_id
                    ) VALUES ($1, $2)
                `,
        [courseId, productId],
      );
    }

    await db.query("COMMIT");

    revalidatePath("/admin");

    return {
      error: false,
      message: "Product created successfully",
    };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error creating product:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
};

export const updateProduct = async (
  id: string,
  productData: Pick<
    Product,
    "name" | "description" | "imageUrl" | "price" | "status"
  > & { courseIds: string[] },
) => {
  try {
    await db.query("BEGIN");

    await db.query(
      `
            UPDATE products
            SET
                name = $1,
                description = $2,
                image_url = $3,
                price = $4,
                status = $5,
                updated_at = NOW()
            WHERE id = $6
            RETURNING id
            `,
      [
        productData.name,
        productData.description,
        productData.imageUrl,
        productData.price,
        productData.status,
        id,
      ],
    );

    await db.query(
      `
            DELETE FROM course_products
            WHERE product_id = $1
            `,
      [id],
    );

    for (const courseId of productData.courseIds) {
      await db.query(
        `
                    INSERT INTO course_products (
                        course_id,
                        product_id
                    ) VALUES ($1, $2)
                `,
        [courseId, id],
      );
    }

    await db.query("COMMIT");

    revalidatePath("/admin");

    return {
      error: false,
      message: "Product updated successfully",
    };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating product:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await db.query("BEGIN");

    const purchaseCheck = await db.query(
      `
            SELECT 1
            FROM purchases
            WHERE product_id = $1
            LIMIT 1
            `,
      [productId],
    );

    if (purchaseCheck.rows.length > 0) {
      await db.query("ROLLBACK");
      return {
        error: true,
        message: "Cannot delete a product with existing purchases.",
      };
    }

    const deleteResult = await db.query(
      `
            DELETE FROM products
            WHERE id = $1
            RETURNING id
            `,
      [productId],
    );

    if (deleteResult.rowCount === 0) {
      await db.query("ROLLBACK");
      return {
        error: true,
        message: "Product not found.",
      };
    }

    await db.query("COMMIT");
    revalidatePath("/admin");

    return {
      error: false,
      message: "Product deleted successfully",
    };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error deleting product:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
};

export const userOwnsProduct = async (userId: string, productId: string) => {
  try {
    const result = await db.query(
      `
            SELECT 
                *
            FROM purchases
            WHERE user_id = $1 AND product_id = $2
        `,
      [userId, productId],
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error fetching user owned products:", error);
    return false;
  }
};
