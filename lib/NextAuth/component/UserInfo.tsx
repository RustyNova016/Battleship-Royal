"use client";//TODO: Convert Server Component
import {signOut} from "next-auth/react";
import classNames from "classnames";
import {DefaultUser} from "next-auth";
import Image from "next/image";
import "./Navigation.scss";
import React from "react";
import Link from "next/link";

export function NavbarLoggedInStatus({user}: { user: (DefaultUser & { id: string }) }) {
    return <>
        <p className={"separator"}></p>

        <Link className={classNames("Link", "NavLinkAnimation")} href={"/user"}>{user.name}</Link>

        <div className={"LogoContainer"}>
            {/*TODO: No avatar icon*/}
            <Image src={user.image ? user.image : "parsedSession.image"}
                alt={""}
                className={"Logo"}
                height={100}
                width={100}/>
        </div>

        <a
            href={"/api/auth/signout"} className={classNames("Link", "NavLinkAnimation")}
            onClick={(e) => {
                e.preventDefault();
                signOut();
            }}>
            Sign out
        </a>
    </>;
}