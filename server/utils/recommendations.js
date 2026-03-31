// Jaccard Similarity: measures similarity between two sets of tags
// Formula: |Set A ∩ Set B| / |Set A ∪ Set B|

export const calculateJaccardSimilarity = (tags1, tags2) => {
  const set1 = new Set(tags1.map((tag) => tag.toLowerCase()));
  const set2 = new Set(tags2.map((tag) => tag.toLowerCase()));

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};

// Get recommended products based on the viewed product
export const getRecommendations = (viewedProduct, allProducts, limit = 5) => {
  if (!viewedProduct.tags || viewedProduct.tags.length === 0) {
    // If no tags, recommend by category
    return allProducts
      .filter(
        (p) =>
          p._id.toString() !== viewedProduct._id.toString() &&
          p.category === viewedProduct.category,
      )
      .slice(0, limit);
  }

  // Calculate similarity scores
  const similarities = allProducts
    .filter((p) => p._id.toString() !== viewedProduct._id.toString())
    .map((product) => ({
      ...(product.toObject ? product.toObject() : product),
      similarity: calculateJaccardSimilarity(viewedProduct.tags, product.tags),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .filter((p) => p.similarity > 0); // Only include products with some similarity

  // If not enough similar products, fill up with products from same category
  if (similarities.length < limit) {
    const categoryProducts = allProducts
      .filter(
        (p) =>
          p._id.toString() !== viewedProduct._id.toString() &&
          p.category === viewedProduct.category &&
          !similarities.some((sim) => sim._id.toString() === p._id.toString()),
      )
      .slice(0, limit - similarities.length);

    return [...similarities, ...categoryProducts];
  }

  return similarities;
};

// Batch recommendation for multiple products (used for personalized homepage)
export const getPersonalizedRecommendations = (
  viewedProductIds,
  allProducts,
  limit = 10,
) => {
  if (viewedProductIds.length === 0) return allProducts.slice(0, limit);

  const recommendationScores = new Map();

  viewedProductIds.forEach((viewedId) => {
    const viewedProduct = allProducts.find(
      (p) => p._id.toString() === viewedId.toString(),
    );
    if (!viewedProduct) return;

    const recommendations = getRecommendations(
      viewedProduct,
      allProducts,
      limit,
    );
    recommendations.forEach((rec) => {
      const id = rec._id.toString();
      recommendationScores.set(
        id,
        (recommendationScores.get(id) || 0) + rec.similarity,
      );
    });
  });

  // Remove viewed products from recommendations
  viewedProductIds.forEach((id) => {
    recommendationScores.delete(id.toString());
  });

  // Sort by score and return top products
  return Array.from(recommendationScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => allProducts.find((p) => p._id.toString() === id));
};
