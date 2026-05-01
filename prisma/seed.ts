import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Categories
  const categoryShirts = await prisma.category.upsert({
    where: { slug: "shirts" },
    update: {},
    create: {
      name: "Shirts",
      slug: "shirts",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    },
  });

  const categoryTShirts = await prisma.category.upsert({
    where: { slug: "t-shirts" },
    update: {},
    create: {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    },
  });

  const categoryPants = await prisma.category.upsert({
    where: { slug: "pants" },
    update: {},
    create: {
      name: "Pants",
      slug: "pants",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    },
  });

  const categoryJackets = await prisma.category.upsert({
    where: { slug: "jackets" },
    update: {},
    create: {
      name: "Jackets",
      slug: "jackets",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    },
  });

  const categoryPolos = await prisma.category.upsert({
    where: { slug: "polos" },
    update: {},
    create: {
      name: "Polos",
      slug: "polos",
      image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80",
    },
  });

  const categoryAccessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    },
  });

  // Create Products
  const products = [
    {
      name: "Classic Cotton Crew Tee",
      slug: "classic-cotton-crew-tee",
      description: "Our signature crew neck t-shirt is made from 100% premium combed cotton. Preshrunk to ensure a lasting fit after every wash.",
      categoryId: categoryTShirts.id,
      retailPrice: 850,
      wholesalePrice: 500,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80"
      ],
      featured: true,
      isNew: true,
      isBestSeller: true,
    },
    {
      name: "Oxford Button-Down Shirt",
      slug: "oxford-button-down-shirt",
      description: "A versatile wardrobe staple made from durable Oxford cloth.",
      categoryId: categoryShirts.id,
      retailPrice: 1650,
      wholesalePrice: 1000,
      images: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"
      ],
      featured: false,
      isNew: true,
      isBestSeller: true,
    },
    {
      name: "Slim Fit Chinos",
      slug: "slim-fit-chinos",
      description: "Comfortable and stylish chinos perfect for everyday wear.",
      categoryId: categoryPants.id,
      retailPrice: 1450,
      wholesalePrice: 850,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80"
      ],
      featured: false,
      isNew: false,
      isBestSeller: true,
    },
    {
      name: "Denim Trucker Jacket",
      slug: "denim-trucker-jacket",
      description: "Classic denim jacket that goes with almost everything.",
      categoryId: categoryJackets.id,
      retailPrice: 2850,
      wholesalePrice: 1800,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80"
      ],
      featured: true,
      isNew: false,
      isBestSeller: false,
    },
    {
      name: "Premium Pique Polo",
      slug: "premium-pique-polo",
      description: "A tailored polo shirt made from breathable pique cotton.",
      categoryId: categoryPolos.id,
      retailPrice: 1250,
      wholesalePrice: 750,
      images: [
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
      ],
      featured: true,
      isNew: true,
      isBestSeller: true,
    },
    {
      name: "Leather Minimalist Wallet",
      slug: "leather-minimalist-wallet",
      description: "Handcrafted genuine leather wallet with a slim profile.",
      categoryId: categoryAccessories.id,
      retailPrice: 950,
      wholesalePrice: 550,
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
      ],
      featured: false,
      isNew: true,
      isBestSeller: false,
    },
  ];

  for (const productData of products) {
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          ...productData,
          variants: {
            create: [
              { size: "S", color: "Default", stock: 10 },
              { size: "M", color: "Default", stock: 20 },
              { size: "L", color: "Default", stock: 20 },
              { size: "XL", color: "Default", stock: 10 },
            ],
          },
        },
      });
      console.log(`Created product: ${product.name}`);
    }
  }

  // Create Admin User
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gochalo.com" },
    update: {},
    create: {
      email: "admin@gochalo.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      isApproved: true,
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
