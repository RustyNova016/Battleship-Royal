import "./win-overlay.scss";
import React, {PropsWithChildren} from "react";
import Classnames from "classnames";

export interface WinOverlayProps extends PropsWithChildren {
    className?: string;
}

export const EndGameOverlay: React.FC<WinOverlayProps> = ({className = "", children}) => (
    <div className={Classnames(className, "Background")}>
        <div className="Modal">
            {children}
        </div>
    </div>
);