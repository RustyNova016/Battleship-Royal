import './PreviousGameElement.scss';
import React from 'react';
import Classnames from 'classnames';

export interface PreviousGameElement {
    gameType: string;
    date: Date;
    result: number;
}

export interface PreviousGameElementProps extends PreviousGameElement {
    className?: string;
}

export const PreviousGameElement: React.FC<PreviousGameElementProps> = ({ className = '', gameType, date, result }) => (
    <div className={Classnames(className, 'Container')}>
        <span>{gameType}</span>
        |
        <span>{date.toLocaleTimeString()}</span>
        |
        <span>{result}</span>
        |
        <button>{">"}</button>
    </div>
);