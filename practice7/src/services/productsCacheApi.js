
const BASE_URL = "https://dummyjson.com/products";

export async function fetchAllProducts(signal) {
    const response = await fetch(`${BASE_URL}?limit=0`, {
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products;
}

export async function fetchProductById(id, signal) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(
            response.status === 404
                ? "Product not found"
                : "Failed to fetch product"
        );
    }

    return response.json();
}

export async function updateProduct({ id, title }) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    return response.json();
}
