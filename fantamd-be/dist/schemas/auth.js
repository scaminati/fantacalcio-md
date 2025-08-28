import { Type } from '@sinclair/typebox';
import { StringSchema } from './common.js';
export const CredentialsSchema = Type.Object({
    username: StringSchema,
    password: StringSchema
});
