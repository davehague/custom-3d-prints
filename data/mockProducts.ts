import { type Product } from "@/types/Product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "3D Printed Vase",
    description: "A beautiful customizable vase",
    price: 29.99,
    imageUrl: "/products/vase.webp?height=300&width=300",
    customizations: [
      { type: "Color", options: ["Red", "Blue", "Green"] },
      { type: "Size", options: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: "2",
    name: "Personalized Keychain",
    description: "A stylish keychain with your name or logo",
    price: 9.99,
    imageUrl: "/products/keychain.webp?height=300&width=300",
    customizations: [
      { type: "Material", options: ["Plastic", "Wood", "Metal"] },
      { type: "Shape", options: ["Circle", "Square", "Heart"] },
    ],
  },
  {
    id: "3",
    name: "Custom Phone Stand",
    description: "A practical stand for your phone, designed to fit your style",
    price: 14.99,
    imageUrl: "/products/phone-stand.webp?height=300&width=300",
    customizations: [
      { type: "Material", options: ["Plastic", "Wood", "Acrylic"] },
      { type: "Height", options: ["Short", "Medium", "Tall"] },
    ],
  },
  {
    id: "4",
    name: "3D Printed Planter Pot",
    description: "A modern, customizable planter pot for your plants",
    price: 19.99,
    imageUrl: "/products/plant-pot.webp?height=300&width=300",
    customizations: [
      { type: "Color", options: ["Gray", "White", "Terracotta"] },
      { type: "Shape", options: ["Round", "Square", "Hexagonal"] },
    ],
  },
  {
    id: "5",
    name: "Customized Coasters Set",
    description: "A set of coasters with your custom design or logo",
    price: 12.99,
    imageUrl: "/products/coasters.webp?height=300&width=300",
    customizations: [
      { type: "Material", options: ["Wood", "Plastic", "Cork"] },
      { type: "Shape", options: ["Circle", "Square"] },
    ],
  },
  {
    id: "6",
    name: "3D Printed Desk Organizer",
    description: "A stylish and practical desk organizer for your workspace",
    price: 24.99,
    imageUrl: "/products/organizer.webp?height=300&width=300",
    customizations: [
      { type: "Material", options: ["Plastic", "Wood", "Metal"] },
      { type: "Size", options: ["Small", "Medium", "Large"] },
    ],
  },
  {
    id: "7",
    name: "Customizable Earbud Holder",
    description: "A neat holder for your earbuds, available in various styles",
    price: 7.99,
    imageUrl: "/products/earbud-holder.webp?height=300&width=300",
    customizations: [
      { type: "Material", options: ["Plastic", "Wood"] },
      { type: "Shape", options: ["Rectangle", "Circle"] },
    ],
  },
  {
    id: "8",
    name: "3D Printed Robot Model",
    description:
      "A customizable robot figure, perfect for display or collection",
    price: 39.99,
    imageUrl: "/products/robot-model.webp?height=300&width=300",
    customizations: [
      { type: "Color", options: ["Silver", "Black", "Gold"] },
      { type: "Size", options: ["Small", "Medium", "Large"] },
    ],
  },
  // You can add more mock products here
];

export const getMockProduct = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};
