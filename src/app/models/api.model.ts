export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

export interface TmdbMovieDetailsResponse {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  credits: TmdbCreditsResponse;
  recommendations: TmdbSearchResponse;
}

export interface TmdbCreditsResponse {
  cast: TmdbCastMember[];
  crew: { id: number; name: string; job: string }[];
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface SearchFilters {
  year: string;
  minRating: string;
}
