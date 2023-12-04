import dbConnect from "../../../db/connect.js";
import Product from "../../../db/models/Product.js";

export default async function handler(request, response) {
  const { id } = request.query;
  // goal is to connect to the db
  await dbConnect();

  // check if the request method is GET

  if (request.method === "GET") {
    try {
      const products = await Product.findById(id).populate("reviews");
      console.log("products", products);
      response.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (request.method === "PUT") {
    const updatedProduct = request.body;
    await Product.findByIdAndUpdate(id, updatedProduct);

    // Find the joke by its ID and update the content that is part of the request body!
    response.status(200).json({ status: `Product successfully updated.` });
    // If successful, you'll receive an OK status code.
  }

  if (request.method === "DELETE") {
    await Product.findByIdAndDelete(id);
    // Declare jokeToDelete to be the joke identified by its id and delete it.
    // This line handles the entire deletion process.
    response.status(200).json({ status: `Joke ${id} successfully deleted.` });
  }
}
