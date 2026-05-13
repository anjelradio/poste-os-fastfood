import { categoriesRepository } from "@/features/products/data/repositories/categories.repository";
import { CategoryType } from "@/lib/constants/category.constants";
import CategoryButton from "./CategoryButton";

export default async function CategoryNavbar() {
  const response = await categoriesRepository.getCategories(CategoryType.PRODUCT);
  const categories = response.ok ? response.data : [];

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
