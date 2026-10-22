import { blogShareImage } from "@/lib/share-image";

/** Public: the blog's own link-preview picture (home, listings, about). */
export async function GET() {
  return blogShareImage();
}
