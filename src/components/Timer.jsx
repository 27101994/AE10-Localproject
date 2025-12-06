import React, { useState, useEffect } from 'react';
import { formatTime } from '@utils/shootingUtils';

export default function Timer({ startTime, isRunning }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!isRunning || !startTime) {
            setElapsed(0);
            return;
        }

        const interval = setInterval(() => {
            setElapsed(Date.now() - startTime);
        }, 100);

        return () => clearInterval(interval);
    }, [startTime, isRunning]);

    return (
        <div className="font-mono text-2xl font-bold text-primary-400">
            {formatTime(elapsed)}
        </div>
    );
}
