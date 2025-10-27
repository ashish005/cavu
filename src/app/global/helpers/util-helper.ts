import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';

type HttpMessageSearchOptions = Readonly<{
    searchInCaption?: boolean;
    searchInMessage?: boolean;
    exactMatch?: boolean;
    startsWith?: boolean;
    endsWith?: boolean;
    contains?: boolean;
    resultType?: 'caption' | 'preferMessage' | 'both';
}>;

export class UtilHelper {
    public static readonly captionAndMessageSeparator = ':';
    public static readonly noNetworkMessageCaption = 'No Network';
    public static readonly noNetworkMessageDetail = 'The server cannot be reached';
    public static readonly accessDeniedMessageCaption = 'Access Denied!';
    public static readonly accessDeniedMessageDetail = '';
    public static readonly notFoundMessageCaption = 'Not Found';
    public static readonly notFoundMessageDetail = 'The target resource cannot be found';
    public static readonly methodNotAllowedCaption = 'Not allowed';
    public static readonly methodNotAllowedDetail = 'Method not allowed';

    public static readonly findHttpResponseMessageDefaultSearchOption: HttpMessageSearchOptions = {
        searchInCaption: true,
        searchInMessage: false,
        exactMatch: true,
        startsWith: false,
        endsWith: false,
        contains: false,
        resultType: 'preferMessage',
    };

    public static cookies =
    {
        getItem: (sKey: string) => {
            return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey)
                .replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        },
        setItem: (sKey: string, sValue: string, vEnd: number | string | Date, sPath: string, sDomain: string, bSecure: boolean) => {
            if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }

            let sExpires = '';

            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                        break;
                    case String:
                        sExpires = '; expires=' + vEnd;
                        break;
                    case Date:
                        sExpires = '; expires=' + (vEnd as Date).toUTCString();
                        break;
                }
            }

            document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires +
                (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
            return true;
        },
        removeItem: (sKey: string, sPath: string, sDomain: string) => {
            if (!sKey) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
                (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
            return true;
        },
        hasItem: (sKey: string) => {
            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
        },
        keys: () => {
            const aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);
            for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    public static getHttpResponseMessages(data: HttpResponseBase): string[] {
        const responses: string[] = [];

        if (this.checkNoNetwork(data)) {
            responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
        } else {
            const responseData = this.getResponseData(data);

            if (responseData) {
                if (typeof responseData === 'object') {
                    for (const key in responseData) {
                        responses.push(`${key}${this.captionAndMessageSeparator} ${responseData[key]}`);
                    }
                }
                else {
                    responses.push(responseData);
                }
            }
        }

        if (this.checkAccessDenied(data)) {
            responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);
        }

        if (this.checkNotFound(data)) {
            let message = `${this.notFoundMessageCaption}${this.captionAndMessageSeparator} ${this.notFoundMessageDetail}`;
            if (data.url) {
                message += `. ${data.url}`;
            }

            responses.splice(0, 0, message);
        }

        if (!responses.length) {
            const response = (data as HttpErrorResponse).message ?? data.statusText;

            if (response)
                responses.push(response);
        }

        return responses;
    }

    public static getHttpResponseMessage(data: HttpResponseBase, ...preferredMessageKeys: string[]): string | null {
        let httpMessage =
            UtilHelper.findHttpResponseMessage(UtilHelper.noNetworkMessageCaption, data) ||
            UtilHelper.findHttpResponseMessage(UtilHelper.notFoundMessageCaption, data) ||
            UtilHelper.findHttpResponseMessage('error_description', data);

        if (!httpMessage) {
            for (const msgKey of preferredMessageKeys) {
                httpMessage = UtilHelper.findHttpResponseMessage(msgKey, data);

                if (httpMessage?.trim() !== '')
                    return httpMessage;
            }
        }

        if (!httpMessage) {
            httpMessage = UtilHelper.findHttpResponseMessage('error', data);
        }

        if (!httpMessage) {
            const responseMessages = UtilHelper.getHttpResponseMessages(data);

            if (responseMessages.length)
                httpMessage = responseMessages.join('\n');
        }

        return httpMessage;
    }

    public static findHttpResponseMessage(searchString: string, data: HttpResponseBase,
                                          searchOptions?: HttpMessageSearchOptions): string | null {

        searchString = searchString.toUpperCase();
        searchOptions = { ...this.findHttpResponseMessageDefaultSearchOption, ...searchOptions };

        let result: string | null = null;
        let captionAndMessage = { caption: '', message: null as string | null };
        const httpMessages = this.getHttpResponseMessages(data);

        for (const httpMsg of httpMessages) {
            const splitMsg = UtilHelper.splitInTwo(httpMsg, this.captionAndMessageSeparator);
            captionAndMessage = { caption: splitMsg.firstPart, message: splitMsg.secondPart ?? null };

            let messageToSearch = '';

            if (searchOptions.searchInCaption && searchOptions.searchInMessage)
                messageToSearch = httpMsg;
            else if (searchOptions.searchInCaption)
                messageToSearch = captionAndMessage.caption;
            else if (searchOptions.searchInMessage)
                messageToSearch = captionAndMessage.message ?? '';

            messageToSearch = messageToSearch.toUpperCase();

            if (searchOptions.exactMatch && messageToSearch === searchString) {
                result = httpMsg;
                break;
            }

            if (searchOptions.startsWith && messageToSearch.startsWith(searchString)) {
                result = httpMsg;
                break;
            }

            if (searchOptions.endsWith && messageToSearch.endsWith(searchString)) {
                result = httpMsg;
                break;
            }

            if (searchOptions.contains && messageToSearch.includes(searchString)) {
                result = httpMsg;
                break;
            }
        }

        if (result && searchOptions.resultType)
            switch (searchOptions.resultType) {
                case 'preferMessage':
                    return captionAndMessage.message ?? captionAndMessage.caption;
                case 'caption':
                    return captionAndMessage.caption;
                case 'both':
                    return result;
            }
        else
            return result;
    }

    public static getResponseData(response: HttpResponseBase) {
        let results;

        if (response instanceof HttpResponse) {
            results = response.body;
        }

        if (response instanceof HttpErrorResponse) {
            results = response.error || response.message || response.statusText;
        }

        return results;
    }

    public static checkNoNetwork(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) {
            return response.status === 0;
        }

        return false;
    }

    public static checkAccessDenied(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) {
            return response.status === 403;
        }

        return false;
    }

    public static checkNotFound(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) {
            return response.status === 404;
        }

        return false;
    }

    public static methodNotAllowed(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) {
            return response.status === 405;
        }

        return false;
    }

    public static checkIsLocalHost(url: string, base?: string) {
        if (url) {
            const location = new URL(url, base);
            const item = location.hostname.split('.');
            const lc = item[item.length-1];
            return (lc === 'localhost' || lc === '127.0.0.1');
        }

        return false;
    }

    public static getDomain(url, subdomain) {
        subdomain = subdomain || false;
        url = url.replace(/(https?:\/\/)?(www.)?/i, '');
        if (!subdomain) {
            url = url.split('.');

            url = url.slice(url.length - 2).join('.');
        }

        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }

        return url;
    }

    public static checkIsBaseDomain(url: string) {

        if (url) {
            const location = new URL(url);
            const item = location.hostname.split('.');
            return ('www' == item[0] && 3 == item.length) || 2 == item.length;
        }

        return false;
    }

    public static isOriginalDomain() {
        const origin = location.origin;//'http://enrator.com';
        const host = location.hostname;//'enrator.com';
        const isLocalHost = UtilHelper.checkIsLocalHost(origin);
        let hasOnlyBase = false;
        if(!isLocalHost){
            hasOnlyBase = UtilHelper.checkIsBaseDomain(origin);
        }
        const hostLength = host.split('.').length;
        const isOriginal = hasOnlyBase || (isLocalHost && hostLength == 1) || (!isLocalHost && hostLength == 2);
        return isOriginal;
    }

    public static getQueryParamsFromString(paramString: string) {
        const params: { [key: string]: string | undefined } = {};

        for (const param of paramString?.split('&')) {
            const keyValue = UtilHelper.splitInTwo(param, '=');
            params[keyValue.firstPart] = keyValue.secondPart;
        }

        return params;
    }

    public static splitInTwo(text: string, separator: string, splitFromEnd = false): { firstPart: string, secondPart: string | undefined } {
        let separatorIndex = -1;

        if (separator !== '') {
            if (!splitFromEnd)
                separatorIndex = text.indexOf(separator);
            else
                separatorIndex = text.lastIndexOf(separator);
        }

        if (separatorIndex === -1) {
            return { firstPart: text, secondPart: undefined };
        }

        const part1 = text.substring(0, separatorIndex).trim();
        const part2 = text.substring(separatorIndex + 1).trim();

        return { firstPart: part1, secondPart: part2 };
    }

    public static baseUrl() {
        let base = '';

        if (window.location.origin) {
            base = window.location.origin;
        } else {
            base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        return base.replace(/\/$/, '');
    }

    public static testIsAbsoluteUrl(url: string) {
        const r = new RegExp('^(?:[a-z]+:)?//', 'i');
        return r.test(url);
    }

    public static convertToAbsoluteUrl(url: string) {
        return UtilHelper.testIsAbsoluteUrl(url) ? url : '//' + url;
    }
}
