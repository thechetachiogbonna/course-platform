"use server";

import { db } from "@/database/db";

export const createProduct = async (productData: Pick<Product, "name" | "description" | "imageUrl" | "price" | "status"> & { courseIds: string[] }) => {
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
                [courseId, productId]
            );
        }

        await db.query("COMMIT");

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
}