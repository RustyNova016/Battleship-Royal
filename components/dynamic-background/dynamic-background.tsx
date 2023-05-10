import "./dynamic-background.scss";
import React, {PropsWithChildren} from "react";
import Classnames from "classnames";

export interface DynamicBackgroundProps extends PropsWithChildren {
    className?: string;
    colorA?: string;
    colorB?: string;
    posX?: string;
    posY?: string;
    wave?: {
        color: string
    },
    vignette?: {
        opacity: number
    }
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ className = "", vignette, wave, children, colorA, colorB, posX, posY }) => (
    <>
        <div className={Classnames(className, "Background")}>
            <div style={{overflow: "hidden"}}>
                <div className="Blur" />
                <div className="Blob" style={{
                    left: posX,
                    top: posY,
                    backgroundColor: `${colorA}`
                }}/>
                {vignette !== undefined && <div className="Frame" style={{opacity: vignette.opacity}}></div>}
                {/*{wave !== undefined && <div style={{backgroundColor: wave.color}} className="wave"/>}*/}
            </div>

            <div className="Content">
                {children}
            </div>
        </div>
    </>
);

