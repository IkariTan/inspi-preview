import { useEffect, useState } from "react";
import { Match } from "./App";
import { getImageUrl } from "./utils";

export interface ProductCardProps {
  variant_handle: string;
  match: Match;
  onMatchChange: (match: Match) => void;
}

export function ProductCard({
  variant_handle,
  match,
  onMatchChange,
}: ProductCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productData, setProductData] = useState<any | null>(null);

  useEffect(() => {
    fetch(
      `https://api-dev2.materialdepot.in/apiV1/product-details-v2/?variant_handle=${variant_handle}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProductData(data);
      });
  }, [variant_handle]);

  return (
    <div className="w-full p-2 cursor-pointer">
      <img
        src={getImageUrl(
          productData?.data?.variant_image?.[0]?.image_url,
          "200"
        )}
        className="w-full h-auto object-contain rounded bg-gray-200"
        style={{ aspectRatio: 0.75 }}
        onClick={() => {
          window.open(
            `https://materialdepot.in/${variant_handle}/product`,
            "_blank"
          );
        }}
      />
      <div className="mt-2">
        <div className="text-sm font-semibold flex justify-between">
          <span>{productData?.data?.category_name}</span>
          <span>{productData?.data?.brand_name}</span>
        </div>
        <div className="text-sm text-gray-500">
          {productData?.data?.product_name?.substring(0, 50)}...
        </div>
        <div className="flex mt-2 justify-between">
          <div className="text-sm font-semibold">
            ₹ {productData?.data?.md_price_gst}
          </div>
          <div className="text-sm">₹ {productData?.data?.mrp}</div>
        </div>
      </div>
      <select
        value={match}
        onChange={(ev) => onMatchChange(ev.target.value as Match)}
        className="mt-2 bg-orange-300 p-2 w-full rounded"
      >
        <option value="">Select Match</option>
        <option value="exact">Exact</option>
        <option value="closest">Closest</option>
        <option value="similar_vibe">Similar Vibe</option>
      </select>
    </div>
  );
}
