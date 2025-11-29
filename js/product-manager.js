// Product Manager for Supabase Integration
class ProductManager {
    constructor() {
        this.supabase = window.supabaseClient;
    }

    // Create product
    async createProduct(productData) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .insert([{
                    name: productData.name,
                    price: productData.price,
                    description: productData.description,
                    category: productData.category,
                    stock: productData.stock,
                    images: productData.images,
                    seller_id: productData.seller_id,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creating product:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all products
    async getAllProducts(filters = {}) {
        try {
            let query = this.supabase
                .from('products')
                .select('*');

            if (filters.category && filters.category !== 'all') {
                query = query.eq('category', filters.category);
            }

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
            }

            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }

            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: error.message };
        }
    }

    // Get product by ID
    async getProductById(id) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching product:', error);
            return { success: false, error: error.message };
        }
    }

    // Get products by seller
    async getProductsBySeller(sellerId) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('seller_id', sellerId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching seller products:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify ownership
    async verifyOwnership(productId, sellerId) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('seller_id')
                .eq('id', productId)
                .single();

            if (error) throw error;
            return data.seller_id === sellerId;
        } catch (error) {
            console.error('Error verifying ownership:', error);
            return false;
        }
    }

    // Update product (with ownership check)
    async updateProduct(id, updates, sellerId) {
        try {
            // Verify ownership first
            if (sellerId) {
                const isOwner = await this.verifyOwnership(id, sellerId);
                if (!isOwner) {
                    return { success: false, error: 'You do not have permission to update this product' };
                }
            }

            const { data, error } = await this.supabase
                .from('products')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete product (with ownership check)
    async deleteProduct(id, sellerId) {
        try {
            // Verify ownership first
            if (sellerId) {
                const isOwner = await this.verifyOwnership(id, sellerId);
                if (!isOwner) {
                    return { success: false, error: 'You do not have permission to delete this product' };
                }
            }

            const { error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: error.message };
        }
    }

    // Upload product image
    async uploadProductImage(file, productId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${productId}/${Date.now()}.${fileExt}`;

            const { data, error } = await this.supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = this.supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }
    }

    // Update stock
    async updateStock(productId, quantity) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update({ stock: quantity })
                .eq('id', productId)
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error updating stock:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize product manager
const productManager = new ProductManager();
window.productManager = productManager;
