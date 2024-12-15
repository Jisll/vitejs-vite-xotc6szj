import axios from 'axios';

export interface ApiResponse<T = ThumbnailData[]> {
    data: ApiResult<T>;
}

export interface ApiResult<T> {
    data: T;
}

export interface ThumbnailData {
    targetId: number;
    state: string;
    imageUrl: string;
    version: string;
}


export async function fetchAvatarHeadshotAsync(userId: string): Promise<ApiResponse<ThumbnailData[]>> {
    const response = await axios.get<ApiResponse<ThumbnailData[]>>(`http://localhost:45624/api/roblox/avatar-headshot`, {
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            userIds: userId
        }
    });

    return response.data;
}