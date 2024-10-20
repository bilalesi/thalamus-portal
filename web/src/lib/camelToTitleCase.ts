export function camelToTitleCase(camelCaseStr: string) {
    const titleCaseStr = camelCaseStr
        .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
        .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter of the string
        .trim(); // Remove leading or trailing whitespace

    return titleCaseStr;
}
