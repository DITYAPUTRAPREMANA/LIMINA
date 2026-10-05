export default async function handler(req: any, res: any) {
  try {
    const { path = [] } = req.query;
    const subpath = Array.isArray(path) ? path.join("/") : path;

    const url = new URL(req.url || "", "http://localhost");
    const targetUrl = `https://api.sectors.app/v2/${subpath}${url.search}`;

    const apiKey = process.env.SECTORS_API_KEY || "";
    const response = await fetch(targetUrl, {
      method: req.method || "GET",
      headers: {
        Accept: "application/json",
        Authorization: apiKey,
      },
    });

    const data = await response.text();
    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") || "application/json"
    );
    res.status(response.status).send(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
