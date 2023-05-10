import React from "react";
import "./home-page.scss";
import Link from "next/link";
import Classnames from "classnames";

export interface HomePageLinkProps {
    className?: string;
    text: string;
}

export const HomePageLink: React.FC<HomePageLinkProps> = ({className = "", text}) => (
    <Link href={"/game/1v1/setup"} className={Classnames("Links", className)}>
        <span className="underline-animation">{text}</span>
    </Link>
);
