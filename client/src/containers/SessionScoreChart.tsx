import React from 'react';
import { Session } from '../store/session/types';

interface Props {
    session : Session | undefined
}

const SessionScoreChart: React.FC<Props> = ({ session }) => {
    return (
        <div> Session score chart </div>
    )
}

export default SessionScoreChart;