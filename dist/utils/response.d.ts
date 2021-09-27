declare class ResponseDto {
    successful: boolean;
    errorCode: string;
    message: string;
    data: any;
}
export declare function getResponse(errorCode: string, data: any): ResponseDto;
export {};
