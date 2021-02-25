const BASE_URL = process.env.REACT_APP_API || "http://localhost:8080";

export const api = {
    baseUrl: BASE_URL,
    getAllSessions: `${BASE_URL}/sessions`,
    getAllMoves: `${BASE_URL}/moves`,
    getMovesInSession: (sid: number) => `${BASE_URL}/moves/${sid}`,
}