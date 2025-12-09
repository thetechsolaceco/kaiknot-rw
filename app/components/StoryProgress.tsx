'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export interface StoryProgressHandle {
    setProgress: (value: number) => void;
}

interface StoryProgressProps {
    count?: number;
}

const StoryProgress = forwardRef<StoryProgressHandle, StoryProgressProps>(({ count = 7 }, ref) => {
    const segmentsRef = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
        setProgress: (totalProgress: number) => {
            // totalProgress is 0 to 1
            // We verify count is valid
            if (count <= 0) return;

            // Map 0-1 to 0-count
            const scaledProgress = totalProgress * count;

            segmentsRef.current.forEach((el, index) => {
                if (!el) return;

                // Calculate progress for this specific segment
                // If scaledProgress is 2.5:
                // index 0: full (2.5 > 1) -> 100%
                // index 1: full (2.5 > 2) -> 100%
                // index 2: partial (2.5 - 2 = 0.5) -> 50%
                // index 3: empty (2.5 < 3) -> 0%

                let segmentProgress = 0;
                if (scaledProgress >= index + 1) {
                    segmentProgress = 100;
                } else if (scaledProgress > index) {
                    segmentProgress = (scaledProgress - index) * 100;
                } else {
                    segmentProgress = 0;
                }

                el.style.width = `${segmentProgress}%`;
            });
        }
    }));

    return (
        <div className="fixed top-4 left-0 w-full px-4 z-[100] flex gap-2 pointer-events-none mix-blend-difference">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        ref={(el) => { segmentsRef.current[i] = el; }}
                        className="h-full bg-white w-0"
                        style={{ width: '0%' }}
                    />
                </div>
            ))}
        </div>
    );
});

StoryProgress.displayName = 'StoryProgress';

export default StoryProgress;
