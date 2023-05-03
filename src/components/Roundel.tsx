import React from 'react';
import clsx from 'clsx';
import styles from '../styles/Roundel.module.css';

/**
 * The roundel displaying a building’s code.
 */
export default function Roundel({ code }: { code: string }) {
  return (
    <div
      className={clsx(
        styles.roundel,
        code.length > 2 && styles.condensed,
        code === 'WWG' && styles['hyper-condensed'],
      )}
    >
      {code}
    </div>
  );
}
