// CSS compatibility utilities for HTML-to-PNG conversion
export const preprocessCSS = (htmlContent) => {
  console.log("=== CSS PREPROCESSING DEBUG ===");
  console.log("Starting CSS preprocessing...");
  console.log("Original HTML length:", htmlContent.length);
  
  // Check if .content class exists
  const contentClassMatch = htmlContent.match(/\.content\s*\{[^}]*\}/);
  if (contentClassMatch) {
    console.log("✅ Found .content class:", contentClassMatch[0]);
  } else {
    console.log("❌ No .content class found!");
  }
  
  // Check for backdrop-filter
  const backdropFilterMatch = htmlContent.match(/backdrop-filter:\s*[^;]+;/);
  if (backdropFilterMatch) {
    console.log("✅ Found backdrop-filter:", backdropFilterMatch[0]);
  } else {
    console.log("❌ No backdrop-filter found!");
  }
  
  // Check for color-mix
  const colorMixMatch = htmlContent.match(/color-mix\([^)]+\)/);
  if (colorMixMatch) {
    console.log("✅ Found color-mix:", colorMixMatch[0]);
  } else {
    console.log("❌ No color-mix found!");
  }
  
     // AGGRESSIVE: CSS-only glassmorphism with pseudo-elements
     const beforeReplacement = htmlContent;
     let processedHTML = htmlContent.replace(
       /\.content\s*\{[^}]*\}/g,
       `.content {
         position: relative;
         color: var(--text-color);
         padding: 64px;
         box-sizing: border-box;
         display: flex;
         align-items: center;
         background: 
           radial-gradient(circle at 30% 20%, rgba(247, 152, 44, 0.3) 0%, transparent 50%),
           radial-gradient(circle at 70% 80%, rgba(221, 170, 83, 0.2) 0%, transparent 50%),
           linear-gradient(135deg,
             rgba(247, 152, 44, 0.1) 0%,
             rgba(247, 152, 44, 0.2) 30%,
             rgba(221, 170, 83, 0.15) 70%,
             rgba(247, 152, 44, 0.1) 100%
           );
         backdrop-filter: none;
         -webkit-backdrop-filter: none;
         border-radius: 56px 56px 0 0;
         border: 1px solid rgba(255, 255, 255, 0.6);
         border-bottom: none;
         margin: 0 40px;
         box-shadow:
           0 8px 32px rgba(0, 0, 0, 0.3),
           inset 0 1px 0 rgba(255, 255, 255, 0.7),
           inset 0 -1px 0 rgba(0, 0, 0, 0.2);
         opacity: 0.85;
       }
       .content::before {
         content: '';
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: 
           repeating-linear-gradient(
             45deg,
             transparent,
             transparent 2px,
             rgba(255, 255, 255, 0.03) 2px,
             rgba(255, 255, 255, 0.03) 4px
           );
         border-radius: inherit;
         pointer-events: none;
       }
       .content::after {
         content: '';
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: 
           linear-gradient(135deg,
             rgba(255, 255, 255, 0.1) 0%,
             transparent 50%,
             rgba(0, 0, 0, 0.05) 100%
           );
         border-radius: inherit;
         pointer-events: none;
       }`
     );
  
  console.log("After .content class replacement:");
  console.log("HTML changed:", beforeReplacement !== processedHTML);
  console.log("Processed HTML length:", processedHTML.length);
  
  // Check if .content class still exists after replacement
  const contentClassMatchAfter = processedHTML.match(/\.content\s*\{[^}]*\}/);
  if (contentClassMatchAfter) {
    console.log("✅ After replacement - Found .content class:", contentClassMatchAfter[0]);
  } else {
    console.log("❌ After replacement - No .content class found!");
  }
  
  // Also replace any remaining color-mix and backdrop-filter
  processedHTML = processedHTML
    .replace(/color-mix\([^)]+\)/g, 'rgba(247, 152, 44, 0.2)')
    .replace(/backdrop-filter:\s*[^;]+;/g, 'backdrop-filter: none;')
    .replace(/-webkit-backdrop-filter:\s*[^;]+;/g, '-webkit-backdrop-filter: none;');

  console.log("Final processed HTML length:", processedHTML.length);
  console.log("=== CSS PREPROCESSING COMPLETE ===");
  return processedHTML;
};

// Add CSS fallbacks for modern features
export const addCSSFallbacks = (htmlContent) => {
  console.log("=== CSS FALLBACKS DEBUG ===");
  console.log("Adding CSS fallbacks...");
  console.log("HTML before fallbacks length:", htmlContent.length);
  
         const fallbackCSS = `
           <style id="conversion-fallbacks">
             /* CSS-only glassmorphism with pseudo-elements */
             .content {
               background: 
                 radial-gradient(circle at 30% 20%, rgba(247, 152, 44, 0.3) 0%, transparent 50%),
                 radial-gradient(circle at 70% 80%, rgba(221, 170, 83, 0.2) 0%, transparent 50%),
                 linear-gradient(135deg,
                   rgba(247, 152, 44, 0.1) 0%,
                   rgba(247, 152, 44, 0.2) 30%,
                   rgba(221, 170, 83, 0.15) 70%,
                   rgba(247, 152, 44, 0.1) 100%
                 ) !important;
               backdrop-filter: none !important;
               -webkit-backdrop-filter: none !important;
               border: 1px solid rgba(255, 255, 255, 0.6) !important;
               border-bottom: none !important;
               box-shadow:
                 0 8px 32px rgba(0, 0, 0, 0.3),
                 inset 0 1px 0 rgba(255, 255, 255, 0.7),
                 inset 0 -1px 0 rgba(0, 0, 0, 0.2) !important;
               opacity: 0.85 !important;
             }
             .content::before {
               content: '' !important;
               position: absolute !important;
               top: 0 !important;
               left: 0 !important;
               right: 0 !important;
               bottom: 0 !important;
               background: 
                 repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 2px,
                   rgba(255, 255, 255, 0.03) 2px,
                   rgba(255, 255, 255, 0.03) 4px
                 ) !important;
               border-radius: inherit !important;
               pointer-events: none !important;
             }
             .content::after {
               content: '' !important;
               position: absolute !important;
               top: 0 !important;
               left: 0 !important;
               right: 0 !important;
               bottom: 0 !important;
               background: 
                 linear-gradient(135deg,
                   rgba(255, 255, 255, 0.1) 0%,
                   transparent 50%,
                   rgba(0, 0, 0, 0.05) 100%
                 ) !important;
               border-radius: inherit !important;
               pointer-events: none !important;
             }
           </style>
         `;

  // Check if </head> exists
  if (htmlContent.includes('</head>')) {
    console.log("✅ Found </head> tag, inserting fallback CSS");
    const result = htmlContent.replace('</head>', fallbackCSS + '</head>');
    console.log("HTML after fallbacks length:", result.length);
    console.log("CSS fallbacks added successfully");
    console.log("=== CSS FALLBACKS COMPLETE ===");
    return result;
  } else {
    console.log("❌ No </head> tag found! Adding CSS to end of HTML");
    const result = htmlContent + fallbackCSS;
    console.log("HTML after fallbacks length:", result.length);
    console.log("CSS fallbacks added to end");
    console.log("=== CSS FALLBACKS COMPLETE ===");
    return result;
  }
};

// Main preprocessing function
export const preprocessHTMLForConversion = (htmlContent) => {
  console.log("=== MAIN PREPROCESSING DEBUG ===");
  console.log("Starting HTML preprocessing for conversion...");
  console.log("Input HTML length:", htmlContent.length);
  
  let processedHTML = htmlContent;
  
  // Step 1: Replace modern CSS functions with compatible alternatives
  console.log("Step 1: CSS preprocessing...");
  processedHTML = preprocessCSS(processedHTML);
  
  // Step 2: Add CSS fallbacks
  console.log("Step 2: Adding CSS fallbacks...");
  processedHTML = addCSSFallbacks(processedHTML);
  
  console.log("Final processed HTML length:", processedHTML.length);
  console.log("=== MAIN PREPROCESSING COMPLETE ===");
  return processedHTML;
};