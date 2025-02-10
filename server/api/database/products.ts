import { ProductService } from "~/server/services/ProductService";
import { H3Event } from "h3";
import type { Database, DBProduct } from "@/types/database";

interface ProductQueryParams {
  id?: string;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // GET - Find all products or single product by ID
    if (event.method === "GET") {
      const { id } = getQuery<ProductQueryParams>(event);
      console.log(`[API] GET /products - Starting request`);

      try {
        let result;
        if (id) {
          result = await ProductService.getProductById(id);
        } else {
          result = await ProductService.getAllProducts();
        }
        console.log(`[API] GET /products - Success:`, result ? 'Data retrieved' : 'No data');
        return { success: true, data: result };
      } catch (err) {
        console.error(`[API] GET /products - ProductService error:`, err);
        throw createError({
          statusCode: 500,
          message: err instanceof Error ? err.message : 'Internal server error'
        });
      }
    }

    // POST - Create new product
    if (event.method === "POST") {
      const body = await readBody<Database['public']['Tables']['products']['Insert']>(event);
      console.log(`[API] POST /products - Creating new product:`, body.name);

      if (!body.name || body.price === undefined) {
        throw createError({
          statusCode: 400,
          message: "Name and price are required",
        });
      }

      return await ProductService.createProduct(body);
    }

    // PATCH - Update existing product
    if (event.method === "PATCH") {
      const body = await readBody<Partial<DBProduct>>(event);
      console.log(`[API] PATCH /products - Updating product:`, body.id);

      if (!body.id) {
        throw createError({
          statusCode: 400,
          message: "Product ID is required",
        });
      }

      return await ProductService.updateProduct(body.id, body);
    }

    // DELETE - Delete existing product
    if (event.method === "DELETE") {
      const { id } = getQuery<ProductQueryParams>(event);
      console.log(`[API] DELETE /products - Deleting product:`, id);

      if (!id) {
        throw createError({
          statusCode: 400,
          message: "Product ID is required",
        });
      }

      await ProductService.deleteProduct(id);
      return { message: "Product deleted successfully" };
    }

    throw createError({
      statusCode: 405,
      message: "Method not allowed",
    });
  } catch (error: any) {
    console.error(`[API] Error in /products:`, {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
      stack: error.stack
    });
  }
});
