// server/services/ProductService.ts
import {
  DBProductImage,
  DBProductWithImages,
  type Database,
} from "@/types/database";
import { type DBProduct, type DBProductWithDetails } from "@/types/database";
import { serverSupabase } from "../utils/serverSupabaseClient";

export class ProductService {
  static async getAllProducts(): Promise<DBProductWithImages[]> {
    console.log(`[ProductService] Getting all active products`);
    try {
      // Verify connection
      if (!serverSupabase) {
        console.error(`[ProductService] Supabase client not initialized`);
        throw new Error("Database connection not initialized");
      }

      const { data, error } = await serverSupabase
        .from("products")
        .select(
          `
          *,
          images:product_images(*)
        `
        )
        .eq("active", true)
        .order("name");

      if (error) {
        console.error(`[ProductService] Error getting products:`, error);
        throw error;
      }

      console.log(`[ProductService] Found ${data?.length ?? 0} products`);
      return data || [];
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in getAllProducts:`,
        error
      );
      throw error;
    }
  }

  static async getProductById(
    id: string
  ): Promise<DBProductWithDetails | null> {
    console.log(`[ProductService] Getting product by id:`, id);
    try {
      const { data, error } = await serverSupabase
        .from("products")
        .select(
          `
          *,
          images:product_images(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error(`[ProductService] Error getting product:`, error);
        throw error;
      }

      console.log(
        `[ProductService] ${data ? "Found product" : "Product not found"}`
      );
      return data;
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in getProductById:`,
        error
      );
      throw error;
    }
  }

  static async createProduct(
    product: Database["public"]["Tables"]["products"]["Insert"]
  ): Promise<DBProduct> {
    console.log(`[ProductService] Creating new product:`, product.name);
    try {
      const { data, error } = await serverSupabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) {
        console.error(`[ProductService] Error creating product:`, error);
        throw error;
      }

      console.log(`[ProductService] Successfully created product:`, data.id);
      return data;
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in createProduct:`,
        error
      );
      throw error;
    }
  }

  static async updateProduct(
    id: string,
    updates: Database["public"]["Tables"]["products"]["Update"]
  ): Promise<DBProduct> {
    console.log(`[ProductService] Updating product:`, id);
    try {
      const { data, error } = await serverSupabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(`[ProductService] Error updating product:`, error);
        throw error;
      }

      console.log(`[ProductService] Successfully updated product:`, id);
      return data;
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in updateProduct:`,
        error
      );
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    console.log(`[ProductService] Deleting product:`, id);
    try {
      const { error } = await serverSupabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`[ProductService] Error deleting product:`, error);
        throw error;
      }

      console.log(`[ProductService] Successfully deleted product:`, id);
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in deleteProduct:`,
        error
      );
      throw error;
    }
  }

  // ###### product images ######
  static async getProductImages(productId: string): Promise<DBProductImage[]> {
    console.log(`[ProductService] Getting images for product:`, productId);
    try {
      const { data, error } = await serverSupabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("display_order");

      if (error) {
        console.error(`[ProductService] Error getting product images:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in getProductImages:`,
        error
      );
      throw error;
    }
  }

  private static generatePublicUrl(filePath: string): string {
    const { data } = serverSupabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async uploadProductImage(
    productId: string,
    file: File
  ): Promise<DBProductImage> {
    console.log(`[ProductService] Uploading image for product:`, productId);
    try {
      // Check if bucket exists
      const { data: buckets } = await serverSupabase.storage.listBuckets();

      const bucketExists = buckets?.some(
        (bucket) => bucket.name === "product-images"
      );

      if (!bucketExists) {
        console.error(
          `[ProductService] Storage bucket 'product-images' does not exist`
        );
        throw new Error(
          "Storage bucket 'product-images' not found. Please create it in Supabase dashboard."
        );
      }

      // Generate a unique filename using timestamp
      const timestamp = new Date().getTime();
      const filePath = `products/${productId}/${timestamp}-${file.name}`;

      const { error: uploadError } = await serverSupabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(`[ProductService] Error uploading image:`, uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const publicUrl = this.generatePublicUrl(filePath);

      // Get the count of existing images to determine if this should be primary
      const { data: existingImages, error: countError } = await serverSupabase
        .from("product_images")
        .select("id")
        .eq("product_id", productId);

      if (countError) {
        console.error(
          `[ProductService] Error counting existing images:`,
          countError
        );
        throw countError;
      }

      const isPrimary = existingImages.length === 0;

      const { data, error: imageError } = await serverSupabase
        .from("product_images")
        .insert({
          product_id: productId,
          storage_path: filePath,
          public_url: publicUrl,
          display_order: existingImages.length,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (imageError) {
        console.error(
          `[ProductService] Error creating image record:`,
          imageError
        );
        throw imageError;
      }

      return data;
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in uploadProductImage:`,
        error
      );
      throw error;
    }
  }

  static async updateProductImage(
    imageId: string,
    updates: Partial<DBProductImage>
  ): Promise<DBProductImage> {
    console.log(`[ProductService] Updating image:`, imageId);
    try {
      // If setting as primary, unset other primary images for this product
      if (updates.is_primary) {
        const { data: currentImage } = await serverSupabase
          .from("product_images")
          .select("product_id")
          .eq("id", imageId)
          .single();

        if (currentImage) {
          await serverSupabase
            .from("product_images")
            .update({ is_primary: false })
            .eq("product_id", currentImage.product_id);
        }
      }

      const { data, error } = await serverSupabase
        .from("product_images")
        .update(updates)
        .eq("id", imageId)
        .select()
        .single();

      if (error) {
        console.error(`[ProductService] Error updating image:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in updateProductImage:`,
        error
      );
      throw error;
    }
  }

  static async deleteProductImage(imageId: string): Promise<void> {
    console.log(`[ProductService] Deleting image:`, imageId);
    try {
      // First get the image details to delete from storage
      const { data: image, error: fetchError } = await serverSupabase
        .from("product_images")
        .select("*")
        .eq("id", imageId)
        .single();

      if (fetchError) {
        console.error(`[ProductService] Error fetching image:`, fetchError);
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await serverSupabase.storage
        .from("product-images")
        .remove([image.storage_path]);

      if (storageError) {
        console.error(
          `[ProductService] Error deleting from storage:`,
          storageError
        );
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await serverSupabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (dbError) {
        console.error(`[ProductService] Error deleting image record:`, dbError);
        throw dbError;
      }

      // If this was the primary image, set a new primary
      if (image.is_primary) {
        const { data: remainingImages, error: remainingError } =
          await serverSupabase
            .from("product_images")
            .select("*")
            .eq("product_id", image.product_id)
            .order("display_order")
            .limit(1);

        if (!remainingError && remainingImages.length > 0) {
          await this.updateProductImage(remainingImages[0].id, {
            is_primary: true,
          });
        }
      }
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in deleteProductImage:`,
        error
      );
      throw error;
    }
  }

  static async reorderProductImages(
    productId: string,
    imageIds: string[]
  ): Promise<void> {
    console.log(`[ProductService] Reordering images for product:`, productId);
    try {
      // Update each image's display order
      const updates = imageIds.map((id, index) => ({
        id,
        display_order: index,
      }));

      const { error } = await serverSupabase
        .from("product_images")
        .upsert(updates);

      if (error) {
        console.error(`[ProductService] Error reordering images:`, error);
        throw error;
      }
    } catch (error) {
      console.error(
        `[ProductService] Unexpected error in reorderProductImages:`,
        error
      );
      throw error;
    }
  }
}
