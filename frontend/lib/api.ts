const API_URL= process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
    constructor(public status:number, public message:string){
        super(message);
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T>{
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
        cache: "no-store",
    });
    if(!res.ok) throw new ApiError(res.status, `Api request failed:  ${res.statusText}` );
    return res.json() as Promise<T>;
}