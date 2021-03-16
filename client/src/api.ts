const BASE_URL = process.env.REACT_APP_API || "http://localhost:8080";

export const api = {
    baseUrl: BASE_URL,
    getLatestSession: `${BASE_URL}/lastSession`,
    getAllSessions: `${BASE_URL}/sessions`,
    getAllMoves: `${BASE_URL}/moves`,
    getMovesInSession: (sid: number) => `${BASE_URL}/moves/${sid}`,
    getMoveBreakdown: (sid: number) => `${BASE_URL}/breakdown/${sid}`,
    sendSessionResult: (sid: number) => `${BASE_URL}/result/${sid}`,
    getSessionResult: (sid: number) => `${BASE_URL}/result/${sid}`,
}