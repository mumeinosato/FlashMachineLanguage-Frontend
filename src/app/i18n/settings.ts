export const defaultLanguage = 'ja';
export const availableLanguages = [defaultLanguage, 'en'];
export const namespace = ['common'];

export function getOptions(lng = defaultLanguage) {
    return {
        lng,
        defaultNS: namespace,
        fallbackLng: defaultLanguage,
        fallbackNS: namespace[0],
        ns: namespace,
        supportedLngs: availableLanguages
    }
}