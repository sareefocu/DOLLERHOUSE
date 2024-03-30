import util from 'util';
import moment from 'moment';

const stringifiedMessage = (message, type) => {

    if ( type === 'ERROR' ) {
        message.message = util.format(message.message);
    }

    try {
        switch ( typeof message ) {
        case 'string':
            return message;
        case 'object':
            return JSON.stringify(message, null, 2);
        default:
            return String(message);
        }
    } catch ( error ) {
        console.log('ERROR while formatting message in logHelper');
        return message;
    }
};

export default ( () => {

    let loggerInstance;

    let create = ({ appName }) => {

        let __appName__ = appName;

        let logit = (type, data) => {
            data.__appName__ = __appName__;
            console.log(`${ moment().format('YYYY-MM-DD|HH:mm:ss') } ${ type }:::${ stringifiedMessage(data, type) }`);
        };

        return {
            log: (data) => {
                logit('LOG', data);
            },
            info: (data) => {
                logit('INFO', data);
            },
            event: (data) => {
                logit('EVENT', data);
            },
            alert: (data) => {
                logit('ALERT', data);
            },
            request: (data) => {
                logit('REQUEST', data);
            },
            response: (data) => {
                logit('RESPONSE', data);
            },
            error: (data) => {
                logit('ERROR', data);
            },
            dataError: (data) => {
                logit('DATA_ERROR', data);
            }
        };
    };

    return {
        getInstance: ({ appName }) => {
            if ( !loggerInstance ) {
                loggerInstance = create({ appName });
            }
            return loggerInstance;
        }
    };
} )();
