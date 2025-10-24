// CSS compatibility utilities for HTML-to-PNG conversion
export const preprocessCSS = (htmlContent) => {
  // Replace color-mix() functions with rgba equivalents
  const processedHTML = htmlContent
    // Replace color-mix(in srgb, var(--primary-color) 20%, transparent) with rgba equivalent
    .replace(
      /color-mix\(in srgb, var\(--primary-color\) 20%, transparent\)/g,
      'rgba(247, 152, 44, 0.2)'
    )
    // Replace color-mix(in srgb, var(--primary-color) 100%, transparent) with rgba equivalent
    .replace(
      /color-mix\(in srgb, var\(--primary-color\) 100%, transparent\)/g,
      'rgba(247, 152, 44, 1)'
    )
    // Replace color-mix(in srgb, var(--primary-color) 5%, transparent) with rgba equivalent
    .replace(
      /color-mix\(in srgb, var\(--primary-color\) 5%, transparent\)/g,
      'rgba(247, 152, 44, 0.05)'
    )
    // Replace color-mix(in srgb, var(--primary-color) 0%, transparent) with transparent
    .replace(
      /color-mix\(in srgb, var\(--primary-color\) 0%, transparent\)/g,
      'transparent'
    )
    // Remove backdrop-filter as it's not supported in canvas rendering
    .replace(/backdrop-filter:\s*blur\([^)]+\);/g, '');

  return processedHTML;
};

// Add CSS fallbacks for modern features
export const addCSSFallbacks = (htmlContent) => {
  const fallbackCSS = `
    <style>
      /* CSS Fallbacks for conversion compatibility - minimal and targeted */
      .content {
        /* Only add fallback background if backdrop-filter was removed */
        background-color: rgba(247, 152, 44, 0.05);
        /* Remove backdrop-filter for conversion */
        backdrop-filter: none;
      }
    </style>
  `;

  // Insert fallback CSS before the closing head tag
  return htmlContent.replace('</head>', fallbackCSS + '</head>');
};

// Main preprocessing function
export const preprocessHTMLForConversion = (htmlContent) => {
  let processedHTML = htmlContent;
  
  // Step 1: Replace modern CSS functions with compatible alternatives
  processedHTML = preprocessCSS(processedHTML);
  
  // Step 2: Add CSS fallbacks
  processedHTML = addCSSFallbacks(processedHTML);
  
  return processedHTML;
};
