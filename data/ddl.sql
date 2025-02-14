-- Setup the database schema for the application
CREATE SCHEMA virtualcraftinnovations;
GRANT USAGE ON SCHEMA virtualcraftinnovations TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA virtualcraftinnovations TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA virtualcraftinnovations TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA virtualcraftinnovations TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA virtualcraftinnovations GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA virtualcraftinnovations GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA virtualcraftinnovations GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


-- Users table (based on DBUser)
create table virtualcraftinnovations.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  picture text,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone default now(),
  is_admin boolean default false
);

-- Products table
create table virtualcraftinnovations.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Product Images table
create table virtualcraftinnovations.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references virtualcraftinnovations.products(id) on delete cascade,
  storage_path text not null,
  display_order integer default 0,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

-- Customization Types table
create table virtualcraftinnovations.customization_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Customization Options table
create table virtualcraftinnovations.customization_options (
  id uuid primary key default uuid_generate_v4(),
  type_id uuid references virtualcraftinnovations.customization_types(id) on delete cascade,
  value text not null,
  created_at timestamp with time zone default now()
);

-- Product Customizations junction table
create table virtualcraftinnovations.product_customizations (
  product_id uuid references virtualcraftinnovations.products(id) on delete cascade,
  customization_type_id uuid references virtualcraftinnovations.customization_types(id) on delete cascade,
  primary key (product_id, customization_type_id)
);

-- Indexes for performance
create index idx_products_active on virtualcraftinnovations.products(active);
create index idx_product_images_product_id on virtualcraftinnovations.product_images(product_id);
create index idx_product_images_primary on virtualcraftinnovations.product_images(product_id) where is_primary = true;
create index idx_customization_options_type on virtualcraftinnovations.customization_options(type_id);

-- RLS Policies
alter table virtualcraftinnovations.users enable row level security;
alter table virtualcraftinnovations.products enable row level security;
alter table virtualcraftinnovations.product_images enable row level security;
alter table virtualcraftinnovations.customization_types enable row level security;
alter table virtualcraftinnovations.customization_options enable row level security;
alter table virtualcraftinnovations.product_customizations enable row level security;


ALTER TABLE virtualcraftinnovations.product_images ADD COLUMN public_url TEXT;
ALTER TABLE virtualcraftinnovations.products ALTER COLUMN price TYPE VARCHAR(255);

ALTER TABLE virtualcraftinnovations.product_images
ADD CONSTRAINT fk_product_images_product
FOREIGN KEY (product_id)
REFERENCES virtualcraftinnovations.products(id)
ON DELETE CASCADE;