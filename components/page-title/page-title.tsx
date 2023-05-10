import './page-title.scss';
import React, { PropsWithChildren } from "react";
import Classnames from 'classnames';

export interface PageTitleProps extends PropsWithChildren {
    className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ className = "", children }) => (
    <div className={Classnames(className, 'PageTitle')}>{children}</div>
);