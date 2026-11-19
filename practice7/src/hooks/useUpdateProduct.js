
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateProduct } from "../services/productsCacheApi";

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,

        onSuccess: async (_, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["products", "all"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["products", "detail", Number(variables.id)],
                }),
            ]);
        },
    });
}
