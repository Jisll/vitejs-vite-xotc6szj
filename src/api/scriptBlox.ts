import axios from 'axios';

export interface ApiResponse<T = FetchResult | SearchResult | ScriptResult> { 
    data: ApiResult<T>;
}

export interface ApiResult<T> {
    result: T;
}

export interface FetchResult {
    totalPages: number
    nextPage: number
    max: number
    scripts: Script[];
}

export interface SearchResult {
    totalPages: number;
    scripts: Script[];
}

export interface ScriptResult {
    script: Script & { script: string };
}

export interface Script {
    _id: string;
    title: string;
    owner: Owner;
    game: Game;
    scriptType: string;
    slug: string;
    verified: boolean;
}

export interface Owner {
    username: string;
}

export interface Game {
    name: string;
    imageUrl: string;
}

export const BASE_URL = 'https://scriptblox.com';

export async function fetchAsync(page: number): Promise<ApiResponse<FetchResult>['data']> {
    const response = await axios.get<ApiResponse<FetchResult>>(`http://localhost:45624/api/scriptBlox/fetch`, {
        params: {
            page: page
        }
    });

    return response.data.data;
}

export async function searchAsync(query: string, page: number, max: number = 20): Promise<ApiResponse<SearchResult>['data']> {
    const response = await axios.get<ApiResponse<SearchResult>>(`http://localhost:45624/api/scriptBlox/search`, {
        params: {
            q: query,
            page: page,
            max: max
        }
    });

    return response.data.data;
}

export async function scriptAsync(slug: string): Promise<ScriptResult> {
    const response = await axios.get<any>(`http://localhost:45624/api/scriptBlox/script/${slug}`);

    return response.data.data;
}

export function resolveAsset(asset: string) {
    if (asset.startsWith('https://'))
        return asset;

    return `${BASE_URL}${asset}`;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { fetchAsync, searchAsync, resolveAsset };