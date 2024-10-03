export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

// Helper function to get cookie value
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
}
