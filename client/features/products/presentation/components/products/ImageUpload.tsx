"use client";

import { ImageIcon, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

export default function ImageUpload({ image }: { image?: string | null }) {
    const [imageUrl, setImageUrl] = useState("");
    return (
        <CldUploadWidget
            onSuccess={(result) => {
                if (result.event === "success") {
                    // @ts-expect-error next-cloudinary result typing is broader than this event payload
                    setImageUrl(result.info.secure_url);
                }
            }}
            uploadPreset="products_unsigned"
            options={{
                maxFiles: 1,
            }}
        >
            {({ open }) => (
                <div>
                    {/* Current Product Image Slot */}
                    {image && !imageUrl && (
                        <div className="flex flex-col items-center mb-8">
                            <label className="block text-gray-300 text-sm font-medium mb-4 text-center">
                                Imagen Actual del Producto
                            </label>
                            <div className="relative group/img">
                                {/* Shadow/Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-10 group-hover/img:opacity-20 transition-opacity duration-300" />

                                {/* Square container for current image */}
                                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-orange-500/30 bg-gray-900/50 backdrop-blur-sm shadow-2xl transition-all duration-300 group-hover/img:border-orange-500/50">
                                    <Image
                                        fill
                                        src={image}
                                        alt="Producto Actual"
                                        className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                    {/* Indicator icon */}
                                    <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 opacity-60 group-hover/img:opacity-100 transition-opacity">
                                        <ImageIcon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className="relative w-full rounded-xl bg-gray-800/30 border-2 border-dashed border-gray-600/50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors duration-200"
                        style={{ minHeight: "200px" }}
                        onClick={() => open?.()}
                    >
                        {imageUrl ? (
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    fill
                                    style={{ objectFit: "contain" }}
                                    src={imageUrl}
                                    alt="Imagen del Producto"
                                />
                            </div>
                        ) : (
                            <>
                                <Upload className="h-12 w-12 text-gray-500 mb-3" />
                                <p className="text-gray-400 text-sm">
                                    Subir imagen del producto
                                </p>
                            </>
                        )}
                    </div>

                    <input
                        type="hidden"
                        name="image"
                        value={imageUrl || image || ""}
                    />
                </div>
            )}
        </CldUploadWidget>
    );
}
