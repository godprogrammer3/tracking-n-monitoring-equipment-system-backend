import { FirebaseAuthStrategy, FirebaseUser } from '@tfarras/nestjs-firebase-auth';
import { FirebaseAdminSDK } from '@tfarras/nestjs-firebase-admin';
declare const FirebaseStrategy_base: new (...args: any[]) => FirebaseAuthStrategy;
export declare class FirebaseStrategy extends FirebaseStrategy_base {
    private firebaseAdmin;
    constructor(firebaseAdmin: FirebaseAdminSDK);
    validate(user: FirebaseUser): Promise<any>;
}
export {};
