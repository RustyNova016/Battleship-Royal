import "./nav-bar.scss";
import React, {Suspense} from "react";
import Link from "next/link";
import classNames from "classnames";
import {NavBarUser} from "@/components/nav-bar/nav-bar-user";

export interface NavBarProps {
    className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({className = ""}) => {
    return (
        <div className={classNames(className, "NavBar")}>
            <div className="NavBarLeft">
                <Link className={classNames("NavLinkAnimation", "Brand")}
                    href={"/"}>
                    Battleship Royal
                </Link>
                <span className={"separator"}></span>
            </div>
            <div className="NavBarCenter">
                <Link className={classNames("Link", "NavLinkAnimation")} href={"/game/1v1/setup"}>1v1 Battle</Link>
                <Link className={classNames("Link", "NavLinkAnimation")} href={"/game/1v3/setup"}>1v3 Battle</Link>
                <Link className={classNames("Link", "NavLinkAnimation")} href={"/game/1v100/setup"}>1v100 Battle</Link>
            </div>
            <div className="NavBarRight">
                <Suspense fallback={<>Loading</>}>
                    <NavBarUser/>
                </Suspense>
            </div>
        </div>
    );
};