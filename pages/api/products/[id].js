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
}
