///<reference path="../../.WebStorm2019.1/config/javascript/nodejs/10.16.3/node-typings/node_modules/@types/node/globals.d.ts"/>
const fs = require('fs');

const chalk = require('chalk');

const app = 'web';
const english_file = 'en';

const languages = ['es', 'de', 'fr', 'it'];

class HandleLanguages {


    findMissingString(language) {
        const englishJson = this.getJSON(english_file);
        const languageJson = this.getJSON(language);

        const missing = {};

        Object.keys(englishJson).forEach(key1 => {
            Object.keys(englishJson[key1]).forEach(key2 => {
                if (languageJson[key1] === undefined || languageJson[key1][key2] === undefined) {

                    if (missing[key1] === undefined) {
                        missing[key1] = {};
                    }
                    missing[key1][key2] = englishJson[key1][key2];
                }
            });
        });
        return missing;

    }

    addMissingString(language) {
        const englishJson = this.getJSON(english_file);
        const languageJson = this.getJSON(language);
        const missingLanguageJson = this.getJSON('/missing/' + language);

        const missing = {};

        Object.keys(englishJson).forEach(key1 => {
            Object.keys(englishJson[key1]).forEach(key2 => {
                if (languageJson[key1] === undefined || languageJson[key1][key2] === undefined) {

                    if (missing[key1] === undefined) {
                        missing[key1] = {};
                    }

                    if (missingLanguageJson[key1] !== undefined && missingLanguageJson[key1][key2] !== undefined) {
                        missing[key1][key2] = missingLanguageJson[key1][key2];
                    }

                } else {
                    if (missing[key1] === undefined) {
                        missing[key1] = {};
                    }
                    missing[key1][key2] = languageJson[key1][key2];
                }
            });
        });
        return missing;
    }

    createMissingFiles() {
        languages.forEach(language => {
            const missingString = this.findMissingString(language);
            const path = app + '/missing';
            this.writeFile(path, language, missingString);
        });

    }

    createTranslationsFiles() {
        languages.forEach(language => {
            const translationsFiles = this.addMissingString(language);
            const path = app + '/created';
            this.writeFile(path, language, translationsFiles);
        });

    }

    getJSON(fileName) {
        const languageFile = fs.readFileSync(app + '/' + fileName + '.json');
        return JSON.parse(languageFile);
    }

    writeFile(path, language, file) {
        const fileName = language + '.json';
        try {
            fs.writeFileSync(path + '/' + fileName, JSON.stringify(file));
        } catch (e) {
            fs.mkdirSync(path);
            fs.writeFileSync(path + '/' + fileName, JSON.stringify(file));
        }

    }

    printMessage(message, color) {
        switch (color) {
            case 'blue':
                console.log(chalk.blue(message));
                break;
            case 'red':
                console.log(chalk.red(message));
                break;
            case 'green':
                console.log(chalk.green(message));
                break;
            case 'yellow':
                console.log(chalk.yellow(message));
                break;
            case 'pink':
                console.log(chalk.magenta(message));
                break;

        }

    }

}

const init = new HandleLanguages();

init.createMissingFiles();

