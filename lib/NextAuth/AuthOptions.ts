import {NextAuthOptions} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import prisma from "../prismadb";
import {AuthProviders} from "./AuthProviders";
import {AuthCallbacks} from "./AuthCallbacks";

export const authOptions: NextAuthOptions = {
    providers: AuthProviders,
    callbacks: AuthCallbacks,
    secret: "test",
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(prisma),
};