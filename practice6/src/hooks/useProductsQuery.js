import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "../services/productsCacheApi";

export function useProductsQuery() {
    return useQuery({
        queryKey: ["products", "all"],
        queryFn: ({ signal }) => fetchAllProducts(signal),
        staleTime: 2 * 60 * 1000,
    });
}