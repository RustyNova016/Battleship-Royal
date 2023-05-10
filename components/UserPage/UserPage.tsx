import "./UserPage.scss";
import React from "react";
import Classnames from "classnames";
import {PreviousGames} from "../PreviousGames/PreviousGames";

export interface UserPageProps {
    className?: string;
}

export const UserPage: React.FC<UserPageProps> = ({ className = "" }) => (
    <div className={Classnames(className, "Page")}>
        <h1>User</h1>
        <PreviousGames previousGames={[{ gameType: "1v1", date: new Date(), result:1 }]} />
    </div>
);