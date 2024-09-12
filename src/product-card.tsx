import { useEffect, useState } from "react";

export function ProductCard({ variant_handle }: { variant_handle: string }) {
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
    <div
      className="w-full p-2 cursor-pointer"
      onClick={() => {
        window.open(
          `https://materialdepot.in/${variant_handle}/product`,
          "_blank"
        );
      }}
    >
      <img
        src={productData?.data?.variant_image?.[0]?.image_url}
        className="w-full h-auto object-contain rounded bg-gray-200"
        style={{ aspectRatio: 0.75 }}
      />
      <div className="mt-2">
        <div className="text-sm font-semibold">
          {productData?.data?.category_name ?? productData?.data?.brand_name}
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
    </div>
  );
}
