# Vue-Nuxt-Supabase Starter Project

This is a starter project that combines Vue.js, Nuxt 3, Pinia for state management and Tailwind CSS for styling.

## Features

- Vue.js (latest version)
- Nuxt 3
- Pinia for state management
- Tailwind CSS for utility-first styling
- Lucide Vue Next for icons

## Prerequisites

- Node.js (version compatible with Nuxt 3)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```
   git clone [your-repo-url]
   cd vue-nuxt-supabase-starter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```


4. Open your browser and navigate to `http://localhost:3000`


## Project Structure

# Vue-Nuxt-Supabase Starter Project

[Previous content remains the same...]

## Project Structure

Key files and directories include:

- `components/`: Contains reusable Vue components like AppFooter and AppHeader.
- `layouts/`: Contains the default layout used across pages.
- `pages/`: Contains the route pages of your application.
- `public/`: Holds static assets that are served directly.
- `server/`: Contains server-side code and configuration.
- `stores/`: Contains Pinia store files for state management.
- `types/`: Holds TypeScript type definitions and interfaces.
- `utils/`: Contains utility functions, including the Supabase client setup.
- `app.vue`: The main application component.
- `nuxt.config.ts`: Nuxt configuration file.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration file.


## Dependencies

- Nuxt 3
- Vue.js (latest)
- Pinia
- @pinia/nuxt
- @nuxtjs/tailwindcss
- lucide-vue-next

## Configuration

The project is configured with:

- Nuxt 3 devtools enabled
- Pinia module for state management
- Tailwind CSS module for styling
- Compatibility date set to 2024-09-20
- Custom app head configuration including favicon and meta tags

## Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Tailwind provides a set of utility classes that you can use directly in your HTML to style your components. To customize your Tailwind setup, you can modify the `tailwind.config.js` file (if you've created one) or add Tailwind-specific configuration to your `nuxt.config.ts` file.

## Icons with Lucide Vue Next

The project includes [Lucide](https://lucide.dev/) for icons. You can use these icons in your Vue components as needed.

## Favicon

To change the title and favicon, update `nuxt.config.ts`.  Create your own favicon at https://favicon.io/ and simply drop overtop of the files in the `public` folder.


## Environment Variables

Create a `.env` file in the root directory of the project to store secret project variables.

```
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### Important Notes:

- Never commit your `.env` file to version control. It's already included in the `.gitignore` file to prevent accidental commits.
- Use `NUXT_PUBLIC_` prefix for variables that need to be accessible on both server and client side in Nuxt 3.
- For variables that should only be available on the server side, omit the `NUXT_PUBLIC_` prefix.
- Always use environment variables for sensitive information like API keys, database credentials, etc.

### Additional Environment Variables

Depending on your project needs, you might want to add more environment variables. Some common ones include:

- `NODE_ENV`: Typically set automatically, but you can override it for different environments (development, production, etc.)
- `NUXT_PUBLIC_API_BASE_URL`: If you're using any external APIs
- `NUXT_PUBLIC_SITE_URL`: Your site's URL, useful for generating sitemaps or absolute URLs

Remember to update the `nuxt.config.ts` file to use these environment variables where needed.
