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
