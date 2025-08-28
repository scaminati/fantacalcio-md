import { Type } from '@fastify/type-provider-typebox';
const plugin = async (fastify) => {
    fastify.get('/', {
        schema: {
            response: {
                200: Type.Object({
                    message: Type.String()
                })
            }
        }
    }, async function () {
        return { message: 'FantaMD server started!' };
    });
};
export default plugin;
