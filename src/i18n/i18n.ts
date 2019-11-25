import i18n from 'i18next';
import { NativeModules, Platform } from 'react-native'
import { initReactI18next } from 'react-i18next';
import en from './en';

var GetLocale = (localestring: string): string => {
    return localestring.split('_')[0];
}

const languageDetector: i18n.LanguageDetectorAsyncModule = {
    type: 'languageDetector',
    async: true,
    detect: (cb) => {
        var locale: string = "en";
        if (Platform.OS == 'ios') {
            locale = GetLocale(NativeModules.SettingsManager.settings.AppleLocale)
        }
        else if (Platform.OS == 'android')
            locale = GetLocale(NativeModules.I18nManager.localeIdentifier)

        cb(locale.replace('_', '-'))
    },
    init: () => { },
    cacheUserLanguage: () => { }
}

var resources: i18n.Resource = {
    en: en,
    de: {
        translation: {
            login: {
                title: 'Shesvla'
            }
        }
    }
}

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        react: {
            wait: true
        },
        resources: resources,
        // have a initial namespace
        ns: ['translation'],
        defaultNS: 'translation',

        interpolation: {
            escapeValue: false // not needed for react
        }
    });

export default i18n;