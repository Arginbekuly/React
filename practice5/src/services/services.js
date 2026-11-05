export async function getProducts(search = "",signal) {
    let url;
    if (search !== "") {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=12`;
    }
    else{
        url = `https://dummyjson.com/products/?limit=12`;
    }

    const response = await fetch(url,{signal})
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    return data;
}

export async function getProductById(id,signal) {
    const response = await fetch(`https://dummyjson.com/products/${id}`,{ signal });
    if (!response.ok) {
        throw new Error("Product not found");
    }
    const data = await response.json();
    return data;
}



