import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import { useState } from "react";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data || !data.reviews) {
    return null; // Return null if data or reviews are not available
  }

  async function handleEditProduct(event) {
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      mutate();
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await response.json(); // Ensure the response is fully read

        mutate();
        router.push("/");
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the delete request:", error);
    }
  }

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      {data.reviews.map((review) => (
        <ul key={review._id}>
          <li>{review.title}</li>
          <li>{review.text}</li>
          <li>{review.rating}</li>
        </ul>
      ))}

      <button
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
      >
        Edit
      </button>

      {isEditMode && <ProductForm onSubmit={handleEditProduct} />}

      <button type="button" onClick={() => handleDeleteProduct(id)}>
        Delete Product
      </button>

      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
