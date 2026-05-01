import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const bestSeller = searchParams.get("bestseller") === "true";
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("q");

    let whereClause: any = {};

    if (category) {
      whereClause.category = {
        slug: category
      };
    }

    if (featured) {
      whereClause.featured = true;
    }

    if (bestSeller) {
      whereClause.isBestSeller = true;
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive"
      };
    }

    let orderBy: any = {};
    if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "price-low") {
      orderBy = { retailPrice: "asc" };
    } else if (sort === "price-high") {
      orderBy = { retailPrice: "desc" };
    } else if (sort === "popular") {
       orderBy = { isBestSeller: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: true,
        variants: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
