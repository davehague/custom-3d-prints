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
      console.log(`[API] GET /products - ${id ? `Fetching product ${id}` : 'Fetching all products'}`);

      if (id) {
        return await ProductService.getProductById(id);
      }
      
      return await ProductService.getAllProducts();
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
    console.error(`[API] Error in /products:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});
