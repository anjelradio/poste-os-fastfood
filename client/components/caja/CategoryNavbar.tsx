import { getCategories } from "@/lib/api/categories";
import { CategoryType } from "@/lib/constants/category.constants";
import CategoryButton from "../ui/CategoryButton";

export default async function CategoryNavbar() {
  const categories = await getCategories(CategoryType.PRODUCT);

  return (
    <nav>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 py-3 px-1">
        {categories.map((category) => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </div>
    </nav>
  );
}
