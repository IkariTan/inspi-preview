import { useEffect, useState } from "react";

export function getImageUrl(path: string, width: string) {
  let img_url: string = path?.replace(
    "materialdepotimages.s3.ap-south-1.amazonaws.com",
    "dpy2z8n9cxui1.cloudfront.net"
    // `materialdepotimages-compressed-${percent}-percent`
  );

  img_url = img_url?.replaceAll(
    "materialdepotimages.s3.amazonaws.com",
    "dpy2z8n9cxui1.cloudfront.net"
  );

  img_url = img_url?.replaceAll(
    "material-depot-content-files.s3.ap-south-1.amazonaws.com",
    "dqzffhb3lxxp.cloudfront.net"
  );

  if (
    img_url?.includes(".mp4") ||
    img_url?.includes(".mov") ||
    img_url?.includes(".gif")
  ) {
    img_url = img_url?.replaceAll(
      "dpy2z8n9cxui1.cloudfront.net",
      "d2cwt1uuomj2h5.cloudfront.net"
    );
  }

  if (img_url) {
    if (img_url[0] === "/") {
      img_url = "https://dpy2z8n9cxui1.cloudfront.net" + img_url;
    }
  }

  img_url = img_url?.replaceAll("+", "%20");
  if (!img_url?.startsWith("https")) {
    img_url = "https://dpy2z8n9cxui1.cloudfront.net" + img_url;
  }
  if (width !== "") {
    img_url += "?width=" + width;
  }

  return img_url;
}

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
        src={getImageUrl(
          productData?.data?.variant_image?.[0]?.image_url,
          "200"
        )}
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
