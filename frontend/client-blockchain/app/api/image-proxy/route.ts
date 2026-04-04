import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // ?url=...
  const imageUrl = request.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { message: "Missing 'url' query param" },
      { status: 400 },
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { message: "Only http/https URLs are allowed" },
      { status: 400 },
    );
  }

  try {
    // 5. Gửi request đến server chứa ảnh gốc (Upstream)
    // cache: "no-store" đảm bảo Next.js không lưu cache kết quả fetch này ở tầng server
    const upstream = await fetch(parsedUrl.toString(), {
      //   cache: "no-store",
    });
    // 6. Nếu server gốc trả về lỗi (404, 500...), forward lỗi đó về cho client
    if (!upstream.ok) {
      return NextResponse.json(
        {
          message: `Unable to load image. Upstream status: ${upstream.status}`,
        },
        { status: upstream.status },
      );
    }
    // 7. Lấy định dạng file (mime-type) từ server gốc, mặc định là image/png nếu không có
    const contentType = upstream.headers.get("content-type") || "image/png";
    // 8. Chuyển đổi dữ liệu hình ảnh thành ArrayBuffer (dạng nhị phân)
    const imageBuffer = await upstream.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Yêu cầu browser không lưu cache để luôn lấy ảnh mới nhất
        // "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching image" },
      { status: 500 },
    );
  }
}
