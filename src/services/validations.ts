export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidName(name: string): boolean {
    return name.trim() !== '';
}

export function isValidMobile(mobile: string): boolean {
    return /^\d{10}$/.test(mobile);
}

export function isValidDonationAmount(donationAmount: number): boolean {
    return donationAmount > 0;
}
