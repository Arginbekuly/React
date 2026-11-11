import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../services/productsCacheApi";

export function useProductQuery(id) {
    const productId = Number(id);

    return useQuery({
        queryKey: ["products", "detail", productId],
        queryFn: ({ signal }) => fetchProductById(productId, signal),
        enabled: Number.isSafeInteger(productId) && productId > 0,
    });
}