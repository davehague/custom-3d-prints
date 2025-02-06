# Virtual Craft Innovations - Custom 3D Prints

An e-commerce platform for customizable 3D printed products, built with Vue.js and Nuxt 3.

## Features

- Browse catalog of customizable 3D printed products
- Product customization interface
- Shopping cart functionality
- User authentication
- Order management
- Real-time order status tracking

## Tech Stack

- Vue.js with Nuxt 3 for the frontend
- Supabase for backend and authentication
- Pinia for state management
- Tailwind CSS for styling
- Lucide Vue Next for icons

## Getting Started

1. Clone the repository:

   ```
   git clone [your-repo-url]
   cd custom-3d-prints
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:

   ```
   NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NUXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Project Structure

- `components/`: Reusable components including product cards, cart items, etc.
- `pages/`: Route pages for product listing, customization, checkout, etc.
- `stores/`: Pinia stores for cart, user, and product state
- `types/`: TypeScript definitions for products, orders, and user data
- `utils/`: Utility functions including Supabase client setup

## Environment Variables

Required environment variables:

- `NUXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NUXT_PUBLIC_SUPABASE_KEY`: Your Supabase anonymous key
- `NUXT_PUBLIC_SITE_URL`: Production site URL (for SEO)

## Customization

### Products

Add new product templates in the Supabase database with the following information:

- Product name
- Base price
- Customization options
- Available materials
- Base STL file reference

### Styling

Modify `tailwind.config.js` to update the theme colors and other design tokens to match your brand.

## Deployment

1. Build the production version:

   ```
   npm run build
   ```

2. Generate static files:

   ```
   npm run generate
   ```

3. Deploy the `.output` directory to your hosting provider

## HTTPS Setup

1. Set up HTTPS for local development (required for OAuth):

```bash
mkcert localhost

```

1. Update `.gitignore` to exclude the certificates:

```
# SSL Certificates
localhost-key.pem
localhost.pem

```
