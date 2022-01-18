export class ResponseDto {
    successful: boolean;
    errorCode: string;
    message: string;
    data: any;
}


export function getResponse(errorCode: string, data: any): ResponseDto {
    const response = ResponseConstants.find((response) => {
        return response.errorCode === errorCode;
    });
    if(errorCode == '00') {
        response.data = data;
    }
    return response;
}

const ResponseConstants: ResponseDto[] = [
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
]
