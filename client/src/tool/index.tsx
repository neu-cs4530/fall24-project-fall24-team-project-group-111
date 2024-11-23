import React from 'react';

/**
 * Function to get a human-readable metadata string representing the time difference
 * between now and the given date.
 *
 * @param date - The date object to compare with the current date.
 */
const getMetaData = (date: Date): string => {
  const now = new Date();
  const diffs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffs < 60) {
    return 'just now';
  }
  if (diffs < 60 * 60) {
    const minutes = Math.floor(diffs / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  if (diffs < 60 * 60 * 24) {
    const hours = Math.floor(diffs / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (diffs < 60 * 60 * 24 * 30) {
    const days = Math.floor(diffs / (60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  if (diffs < 60 * 60 * 24 * 365) {
    const months = Math.floor(diffs / (60 * 60 * 24 * 30));
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffs / (60 * 60 * 24 * 365));
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

/**
 * Validates the hyperlinks present in the given text. It checks that:
 * - Each hyperlink has non-empty text and URL components.
 * - The URL starts with "https://".
 * - The URL contains at least one character after the scheme.
 *
 * @param text - The input text containing potential hyperlinks.
 * @returns {boolean} - Returns `true` if all hyperlinks are valid,
 *                      otherwise returns `false`.
 */
const validateHyperlink = (text: string): boolean => {
  const hyperlinkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;

  // Find all matches for hyperlinks in the text
  const matches = [...text.matchAll(hyperlinkPattern)];

  // If there are no matches, it's valid
  if (matches.length === 0) {
    return true;
  }

  // Check each match to see if the URL starts with https://
  for (const match of matches) {
    if (
      !match[1].length ||
      !match[2].length ||
      !match[2].startsWith('https://') ||
      !match[2].slice(8).length
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Function to validate hyperlinks within a given text.
 *
 * @param text - The text containing hyperlinks in the markdown format `[text](url)`.
 */
const handleHyperlink = (text: string) => {
  const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;

  // Split the text into parts based on the pattern
  const parts = text.split(pattern);

  // Map through the parts to render the links and text
  const content = parts.map((part, index) => {
    // If the index is even, it's plain text
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    }
    // If the index is odd and it's the text for the link
    if (index % 2 === 1) {
      const href = parts[index + 1];
      return (
        <a key={index} href={href} target='_blank' rel='noopener noreferrer'>
          {part}
        </a>
      );
    }
    // If it's the href part, skip it (already handled)
    return null;
  });

  return <div>{content}</div>;
};

export { getMetaData, handleHyperlink, validateHyperlink };
