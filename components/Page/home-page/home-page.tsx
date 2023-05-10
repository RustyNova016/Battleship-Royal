import "./home-page.scss";
import React from "react";
import Classnames from "classnames";
import { HomePageLink } from "@/components/Page/home-page/home-page-link";
import { HomePageLink as HomePageLink0 } from './home-page-link';

export interface HomePageProps {
    className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ className = "" }) => (
    <div className={Classnames(className, "PageContainer")}>
        <div className="content">
            <h1 className="Tittle">Battleship Royal</h1>
            <h2 className="subtext">100 players game of battleship. Last one standing wins!</h2>
            <div className="LinkSection">
                <HomePageLink0 text="Play 1v1" />
                <HomePageLink text="Play 1v100" />
                </div>
                </div>
    </div>
);
