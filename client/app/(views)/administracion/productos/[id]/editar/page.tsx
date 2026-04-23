import { notFound } from "next/navigation";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import ProductForm from "@/features/products/presentation/components/products/ProductForm";
import EditProductForm from "@/features/products/presentation/components/products/EditProductForm";
import { productsRepository } from "@/features/products/data/repositories/products.repository";

export default async function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const param = await params;
    const response = await productsRepository.getProductById(+param.id);

    if (!response.ok || !response.data) {
        notFound();
    }

    const product = response.data;

    return (
        <div className="flex-1 pb-10">
            {/* Breadcrumb and Back Button */}
            <Breadcrumb
                parent="Gestión del Catálogo"
                child={`Editar ${product.name}`}
            />
            <EditProductForm>
                <ProductForm product={product} />
            </EditProductForm>
        </div>
    );
}
