import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSessions } from '../store/session/actions';

const OfflineSessionPage: React.FC = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchSessions)
    })
    return (
        <div>
            Welcome to the offline analytics page!
        </div>
    )
}

export default OfflineSessionPage;