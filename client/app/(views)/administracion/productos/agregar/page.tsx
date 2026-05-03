import AddProductForm from "@/features/products/presentation/components/products/AddProductForm";
import ProductForm from "@/features/products/presentation/components/products/ProductForm";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";

export default function AddProductPage() {
    return (
        <div className="flex-1 pb-10">
            {/* Breadcrumb and Back Button */}
            <Breadcrumb
                parent="Gestión del Catálogo"
                child="Agregar Producto"
                backHref="/administracion/productos"
            />
            <AddProductForm>
                <ProductForm />
            </AddProductForm>
        </div>
    );
}
