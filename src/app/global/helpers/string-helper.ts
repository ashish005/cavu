export class StringHelper {
    public static capitalizeFirstLetter(text: string) {
        if (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        } else {
            return text;
        }
    }

    public static toTitleCase(text: string) {
        return text.replace(/\w\S*/g, (subString) => {
            return subString.charAt(0).toUpperCase() + subString.substring(1).toLowerCase();
        });
    }

    public static toLowerCase(item: string | string[]) {
        if (Array.isArray(item)) {
            const loweredArray: string[] = [];

            for (let i = 0; i < item.length; i++) {
                loweredArray[i] = item[i].toLowerCase();
            }

            return loweredArray;
        } else {
            return item.toLowerCase();
        }
    }

    public static expandCamelCase(text: string) {
        if (!text) {
            return text;
        }

        return text.replace(/([A-Z][a-z]+)/g, ' $1')
            .replace(/([A-Z][A-Z]+)/g, ' $1')
            .replace(/([^A-Za-z ]+)/g, ' $1');
    }

    public static tillDecimalPlaces(val, places: number = 3){
        return val.toFixed(places || 3)
    }
}