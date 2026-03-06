export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tmdbApiKey = env.TMDB_API_KEY;

  if (!tmdbApiKey) {
    return new Response(JSON.stringify({ error: "TMDB_API_KEY is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Get parameters from the request
  const type = url.searchParams.get("type") || "trending"; // trending, search, movies, tv, discover
  const query = url.searchParams.get("query") || "";
  const page = url.searchParams.get("page") || "1";
  const genre = url.searchParams.get("genre") || "";
  const rating = url.searchParams.get("rating") || "0";

  let apiUrl = "";
  const baseUrl = "https://api.themoviedb.org/3";

  if (type === "search") {
    apiUrl = `${baseUrl}/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&page=${page}`;
  } else if (type === "movies") {
    apiUrl = `${baseUrl}/movie/popular?api_key=${tmdbApiKey}&page=${page}`;
  } else if (type === "series") {
    apiUrl = `${baseUrl}/tv/popular?api_key=${tmdbApiKey}&page=${page}`;
  } else if (type === "discover") {
    apiUrl = `${baseUrl}/discover/movie?api_key=${tmdbApiKey}&with_genres=${genre}&vote_average.gte=${rating}&page=${page}`; // Modified discover URL to include rating
  } else if (type === "genres") {
    apiUrl = `${baseUrl}/genre/movie/list?api_key=${tmdbApiKey}`;
  } else {
    apiUrl = `${baseUrl}/trending/all/day?api_key=${tmdbApiKey}&page=${page}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from TMDB" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
