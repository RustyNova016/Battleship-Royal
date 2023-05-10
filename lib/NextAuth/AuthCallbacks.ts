import {CallbacksOptions} from "next-auth";

export const AuthCallbacks: Partial<CallbacksOptions> = {
    session: async ({session, token}) => {
        if (session?.user) {
            if (token?.sub !== undefined) {
                session.user.id = token.sub;
            }
        }
        return session;
    },
};