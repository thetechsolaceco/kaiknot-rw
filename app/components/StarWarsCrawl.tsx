"use client";

import React, { forwardRef } from "react";
import styles from "./StarWarsCrawl.module.css";

interface StarWarsCrawlProps {
    containerRef?: React.RefObject<HTMLDivElement | null>;
}

const StarWarsCrawl = forwardRef<HTMLDivElement, StarWarsCrawlProps>(({ containerRef }, ref) => {
    return (
        <div ref={containerRef} className={styles.starWarsContainer}>
            <div className={styles.fade}></div>
            <section className={styles.starWars}>
                <div ref={ref} className={styles.crawl}>
                    <div className={styles.title}>
                        <p>KaiKnot</p>
                        <h1>Glimpse of What to Expect</h1>
                    </div>
                    <p>
                        We don't chase trends. We create <strong>rare, real apparel</strong> designed around <strong>quiet confidence</strong>, <strong>deep stories</strong>, and the <strong>beautiful contrast</strong> of who you are and who you are becoming.
                    </p>
                    <p>
                        Our first drop features <strong>four distinct concept designs</strong> prepare for pieces that <strong>demand attention without needing to shout</strong>.
                    </p>
                </div>
            </section>
        </div>
    );
});

StarWarsCrawl.displayName = "StarWarsCrawl";

export default StarWarsCrawl;
