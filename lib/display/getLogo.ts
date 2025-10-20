

export function getLogoName(label: string) {
    if (label.slice(0, 6) === "Kamino") {
        return "kamino";
    }
    return label.toLowerCase();
}