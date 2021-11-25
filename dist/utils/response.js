"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = void 0;
class ResponseDto {
}
function getResponse(errorCode, data) {
    const response = ResponseConstants.find((response) => {
        return response.errorCode === errorCode;
    });
    if (errorCode == '00') {
        response.data = data;
    }
    return response;
}
exports.getResponse = getResponse;
const ResponseConstants = [
    {
        successful: true,
        errorCode: '00',
        message: 'success',
        data: {},
    },
    {
        successful: false,
        errorCode: '01',
        message: 'Waiting for approve',
        data: {},
    },
    {
        successful: false,
        errorCode: '02',
        message: 'Email not verify',
        data: {},
    },
    {
        successful: false,
        errorCode: '03',
        message: 'Invalid email',
        data: {},
    },
    {
        successful: false,
        errorCode: '04',
        message: 'can not signin',
        data: {},
    },
    {
        successful: false,
        errorCode: '05',
        message: 'can not approve',
        data: {},
    },
    {
        successful: false,
        errorCode: '06',
        message: `user isn't blocked`,
        data: {},
    },
    {
        successful: false,
        errorCode: '07',
        message: `user has been already blocked`,
        data: {},
    }
];
//# sourceMappingURL=response.js.map