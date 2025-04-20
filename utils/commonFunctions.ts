// Helper to convert Rupiah string to number
export function parseRupiah(rupiah: string): number {
    // Remove "Rp", spaces, and dots from the string then parse as integer
    return parseInt(rupiah.replace(/[Rp\s.]/g, ""));
}