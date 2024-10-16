export default interface UserCreate {
    email: string;
    role: string;
    created_by?: number;
    fname: string;
    last_name: string;
    company_id: number;
    location_ids: [number];
}
