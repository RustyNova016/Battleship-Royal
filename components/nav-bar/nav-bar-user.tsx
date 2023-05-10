import {getServerSession} from "next-auth";
import {authOptions} from "../../lib/NextAuth/AuthOptions";
import {NavbarLoggedInStatus} from "../../lib/NextAuth/component/UserInfo";
import React from "react";

export async function NavBarUser() {
    const session = await getServerSession(authOptions);

    if (session === null) { return <>LogIn</>;}
    if (session.user === undefined) { return <>LogIn</>;}

    return <><NavbarLoggedInStatus user={session.user}/></>;
}