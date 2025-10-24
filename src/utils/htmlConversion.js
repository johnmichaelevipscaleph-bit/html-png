import * as htmlToImage from "html-to-image";
import { createFontAwesomeSVG } from "../components/FontAwesomeIcons";
import { preprocessHTMLForConversion } from "./cssFallbacks";

export const convertHTMLToPNG = async (
  htmlContent,
  previewRef,
  iframeRef,
  customSize = null
) => {
  // Preprocess HTML for CSS compatibility (re-enabled for glassmorphism fallback)
  console.log("=== CONVERSION DEBUG ===");
  console.log("About to preprocess HTML for conversion...");
  console.log("Original HTML length:", htmlContent.length);
  const processedHTML = preprocessHTMLForConversion(htmlContent);
  console.log("Processed HTML length:", processedHTML.length);
  console.log("HTML preprocessing completed, proceeding with conversion...");
  console.log("=== CONVERSION DEBUG COMPLETE ===");
  
  // Try using the iframe content first (this should work better)
  if (previewRef.current && iframeRef.current) {
    try {
      // Get the iframe content
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      if (iframeDoc && iframeDoc.body) {
        // Wait for fonts to load properly
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Force font loading
        if (iframeDoc.fonts && iframeDoc.fonts.ready) {
          await iframeDoc.fonts.ready;
        }

        // Additional wait for Font Awesome 7 to load
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if Font Awesome fonts are actually loaded
        const fontAwesomeLoaded =
          iframeDoc.fonts && iframeDoc.fonts.check('1em "Font Awesome 7 Free"');
        console.log("Font Awesome loaded:", fontAwesomeLoaded);

        // Debug: Check what fonts are actually available
        if (iframeDoc.fonts) {
          console.log(
            "Available fonts:",
            Array.from(iframeDoc.fonts.values()).map((f) => f.family)
          );
        }

        // Debug: Check if Font Awesome CSS is loaded
        const fontAwesomeLinks = iframeDoc.querySelectorAll(
          'link[href*="font-awesome"]'
        );
        console.log("Font Awesome CSS links found:", fontAwesomeLinks.length);
        fontAwesomeLinks.forEach((link) => console.log("FA Link:", link.href));

        // If Font Awesome fonts aren't loaded, try to force load them
        if (!fontAwesomeLoaded) {
          console.log("Font Awesome not loaded, attempting to force load...");
          const fontAwesomeLink = iframeDoc.createElement("link");
          fontAwesomeLink.rel = "stylesheet";
          fontAwesomeLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
          fontAwesomeLink.crossOrigin = "anonymous";
          iframeDoc.head.appendChild(fontAwesomeLink);

          // Wait for the new CSS to load
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Wait for all images to load
        const images = iframeDoc.querySelectorAll("img");
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          })
        );

        // Force reflow
        iframeDoc.body.offsetHeight;

        // Calculate dynamic dimensions
        let targetWidth, targetHeight;

        if (customSize) {
          // Use custom size if provided
          targetWidth = customSize.width;
          targetHeight = customSize.height;
        } else {
          // Calculate dimensions based on content
          const contentWidth =
            iframeDoc.body.scrollWidth || iframeDoc.body.offsetWidth;
          const contentHeight =
            iframeDoc.body.scrollHeight || iframeDoc.body.offsetHeight;

          // Default to 1080x1080 if content is too small
          const minSize = 400;
          const maxSize = 2048;

          targetWidth = Math.max(
            minSize,
            Math.min(maxSize, contentWidth || 1080)
          );
          targetHeight = Math.max(
            minSize,
            Math.min(maxSize, contentHeight || 1080)
          );

          console.log("Dynamic sizing:", {
            contentWidth,
            contentHeight,
            targetWidth,
            targetHeight,
          });
        }

        // DISABLED: Ensure body has no padding/margin for clean capture
        // This might be interfering with the layout
        /*
        iframeDoc.body.style.margin = "0";
        iframeDoc.body.style.padding = "0";
        iframeDoc.body.style.backgroundColor = "transparent";
        */

        // DISABLED: Remove any wrapper divs that might add unwanted space
        // This was potentially breaking the layout structure
        /*
        const bodyChildren = Array.from(iframeDoc.body.children);
        if (bodyChildren.length === 1 && bodyChildren[0].tagName === "DIV") {
          const wrapperDiv = bodyChildren[0];
          // Check if this div is just a wrapper (no specific styling)
          const computedStyle =
            iframeDoc.defaultView.getComputedStyle(wrapperDiv);
          if (
            computedStyle.margin === "0px" &&
            computedStyle.padding === "0px" &&
            computedStyle.border === "0px none rgb(0, 0, 0)"
          ) {
            // Move all children of the wrapper to body and remove wrapper
            while (wrapperDiv.firstChild) {
              iframeDoc.body.insertBefore(wrapperDiv.firstChild, wrapperDiv);
            }
            iframeDoc.body.removeChild(wrapperDiv);
          }
        }
        */

        // Debug: Test if we can see Font Awesome icons in the iframe
        const testIcon = iframeDoc.querySelector(
          ".fa-check, .fa-solid.fa-check"
        );
        if (testIcon) {
          console.log("Test icon found:", {
            className: testIcon.className,
            innerHTML: testIcon.innerHTML,
            fontFamily:
              iframeDoc.defaultView.getComputedStyle(testIcon).fontFamily,
            fontSize: iframeDoc.defaultView.getComputedStyle(testIcon).fontSize,
          });
        } else {
          console.log("No test icon found - checking all icons");
          const allIcons = iframeDoc.querySelectorAll('[class*="fa-"]');
          console.log("All FA elements:", allIcons.length);
          allIcons.forEach((icon, i) => {
            console.log(`FA Element ${i}:`, icon.className);
          });
        }

        // Try multiple conversion methods for better icon support
        let dataUrl;

        try {
          // Method 1: Try with font embedding and longer wait
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // First, try to convert any Font Awesome icons to SVG as a backup
          const iconElements = iframeDoc.querySelectorAll(
            ".fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands"
          );
          console.log(
            "Pre-conversion: Found icon elements:",
            iconElements.length
          );

          // Debug: Log each icon element found
          iconElements.forEach((icon, index) => {
            console.log(`Icon ${index}:`, {
              className: icon.className,
              innerHTML: icon.innerHTML,
              computedStyle:
                iframeDoc.defaultView.getComputedStyle(icon).fontFamily,
            });
          });

          // Store original content for potential restoration
          const originalIconContent = new Map();
          for (const icon of iconElements) {
            originalIconContent.set(icon, icon.innerHTML);
            // Extract the actual icon name, not the style class
            const iconNameMatch =
              icon.className.match(
                /fa-(?:solid|regular|light|thin|duotone|brands)\s+fa-([a-zA-Z0-9-]+)/
              ) || icon.className.match(/fa-([a-zA-Z0-9-]+)(?:\s|$)/);
            const iconName = iconNameMatch?.[1];
            if (iconName) {
              const svgIcon = createFontAwesomeSVG(
                iconName,
                icon.className.includes("fa-brands") ||
                  icon.className.includes("fab")
              );
              if (svgIcon) {
                console.log("Pre-converting icon to SVG:", iconName);
                // Clear any pseudo-element content by removing Font Awesome classes
                icon.className = icon.className
                  .replace(/fa-[a-z-]+/g, "")
                  .trim();
                icon.innerHTML = svgIcon;
                icon.style.fontFamily = "inherit";
                icon.style.display = "inline-block";
                icon.style.fontSize = "inherit";
                icon.style.width = "1em";
                icon.style.height = "1em";
              }
            }
          }

          dataUrl = await htmlToImage.toPng(iframeDoc.body, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: null,
            width: targetWidth,
            height: targetHeight,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
              margin: "0",
              padding: "0",
            },
            filter: (node) => {
              return node.tagName !== "SCRIPT";
            },
            useCORS: true,
            allowTaint: true,
            fontEmbedCSS: true,
            includeQueryParams: true,
            // Force font loading
            cacheBust: true,
            skipFonts: false,
            // Ensure clean capture
            removeContainer: true,
            skipAutoScale: true,
          });
        } catch (firstError) {
          console.log(
            "First conversion method failed, trying alternative:",
            firstError
          );

          // Method 2: Try converting Font Awesome icons to SVG first
          try {
            // Convert Font Awesome icons to SVG
            const iconElements = iframeDoc.querySelectorAll(
              ".fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands"
            );
            console.log("Found icon elements:", iconElements.length);
            for (const icon of iconElements) {
              // Extract the actual icon name, not the style class
              const iconNameMatch =
                icon.className.match(
                  /fa-(?:solid|regular|light|thin|duotone|brands)\s+fa-([a-zA-Z0-9-]+)/
                ) || icon.className.match(/fa-([a-zA-Z0-9-]+)(?:\s|$)/);
              const iconName = iconNameMatch?.[1];
              console.log(
                "Processing icon:",
                icon.className,
                "extracted name:",
                iconName
              );
              if (iconName) {
                const svgIcon = createFontAwesomeSVG(
                  iconName,
                  icon.className.includes("fa-brands") ||
                    icon.className.includes("fab")
                );
                if (svgIcon) {
                  console.log("Replacing with SVG for:", iconName);
                  // Clear any pseudo-element content by removing Font Awesome classes
                  icon.className = icon.className
                    .replace(/fa-[a-z-]+/g, "")
                    .trim();
                  icon.innerHTML = svgIcon;
                  icon.style.fontFamily = "inherit";
                  icon.style.display = "inline-block";
                  icon.style.fontSize = "inherit";
                  icon.style.width = "1em";
                  icon.style.height = "1em";
                } else {
                  console.log("No SVG found for:", iconName);
                }
              }
            }

            // Wait a bit for SVG rendering
            await new Promise((resolve) => setTimeout(resolve, 1000));

            dataUrl = await htmlToImage.toPng(iframeDoc.body, {
              quality: 1.0,
              pixelRatio: 2,
              backgroundColor: null,
              width: targetWidth,
              height: targetHeight,
              style: {
                margin: "0",
                padding: "0",
              },
              useCORS: true,
              allowTaint: true,
              removeContainer: true,
              skipAutoScale: true,
            });
          } catch (svgError) {
            console.log(
              "SVG conversion failed, trying basic method:",
              svgError
            );

            // Method 3: Basic conversion without font embedding
            dataUrl = await htmlToImage.toPng(iframeDoc.body, {
              quality: 1.0,
              pixelRatio: 2,
              backgroundColor: null,
              width: targetWidth,
              height: targetHeight,
              style: {
                margin: "0",
                padding: "0",
              },
              useCORS: true,
              allowTaint: true,
              removeContainer: true,
              skipAutoScale: true,
            });
          }
        }

        return dataUrl;
      }
    } catch (iframeError) {
      console.log(
        "Iframe conversion failed, trying temporary element:",
        iframeError
      );
    }
  }

  // Fallback: Create a temporary element to render the HTML
  const tempDiv = document.createElement("div");

  // Set up the element for proper rendering - make it visible but off-screen
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "-9999px";
  tempDiv.style.width = "auto";
  tempDiv.style.height = "auto";
  tempDiv.style.backgroundColor = "transparent"; // Don't override background
  tempDiv.style.visibility = "visible"; // Make it visible for rendering
  tempDiv.style.opacity = "1";
  tempDiv.style.pointerEvents = "none";
  tempDiv.style.zIndex = "9999";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.border = "none"; // Remove border to avoid interference
  tempDiv.style.margin = "0";
  tempDiv.style.padding = "0";

  // Set HTML content (use processed HTML for CSS compatibility)
  tempDiv.innerHTML = processedHTML;

  // DISABLED: Clean up any wrapper divs in the temporary element
  // This was potentially breaking the layout structure
  /*
  const tempChildren = Array.from(tempDiv.children);
  if (tempChildren.length === 1 && tempChildren[0].tagName === "DIV") {
    const wrapperDiv = tempChildren[0];
    // Check if this div is just a wrapper (no specific styling)
    const computedStyle = window.getComputedStyle(wrapperDiv);
    if (
      computedStyle.margin === "0px" &&
      computedStyle.padding === "0px" &&
      computedStyle.border === "0px none rgb(0, 0, 0)"
    ) {
      // Move all children of the wrapper to tempDiv and remove wrapper
      while (wrapperDiv.firstChild) {
        tempDiv.insertBefore(wrapperDiv.firstChild, wrapperDiv);
      }
      tempDiv.removeChild(wrapperDiv);
    }
  }
  */

  // Add to body temporarily
  document.body.appendChild(tempDiv);

  // Wait for rendering
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Force multiple reflows to ensure rendering
  tempDiv.offsetHeight;
  tempDiv.scrollWidth;
  tempDiv.scrollHeight;

  // Calculate dimensions
  let width, height;

  if (customSize) {
    width = customSize.width;
    height = customSize.height;
  } else {
    const contentWidth = Math.max(
      tempDiv.scrollWidth,
      tempDiv.offsetWidth,
      400
    );
    const contentHeight = Math.max(
      tempDiv.scrollHeight,
      tempDiv.offsetHeight,
      300
    );

    // Default to 1080x1080 if content is too small
    const minSize = 400;
    const maxSize = 2048;

    width = Math.max(minSize, Math.min(maxSize, contentWidth || 1080));
    height = Math.max(minSize, Math.min(maxSize, contentHeight || 1080));
  }

  // Debug: Log dimensions
  console.log("Element dimensions:", {
    scrollWidth: tempDiv.scrollWidth,
    scrollHeight: tempDiv.scrollHeight,
    offsetWidth: tempDiv.offsetWidth,
    offsetHeight: tempDiv.offsetHeight,
    clientWidth: tempDiv.clientWidth,
    clientHeight: tempDiv.clientHeight,
    finalWidth: width,
    finalHeight: height,
  });

  // Use html-to-image for client-side conversion with better options
  const dataUrl = await htmlToImage.toPng(tempDiv, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: null, // Don't override background
    width: width,
    height: height,
    style: {
      transform: "scale(1)",
      transformOrigin: "top left",
      margin: "0",
      padding: "0",
    },
    filter: (node) => {
      // Include all elements except script tags
      return node.tagName !== "SCRIPT";
    },
    useCORS: true,
    allowTaint: true,
    removeContainer: true,
    skipAutoScale: true,
  });

  // Clean up
  document.body.removeChild(tempDiv);

  return dataUrl;
};

export const downloadPNG = (convertedImageUrl) => {
  if (!convertedImageUrl) {
    throw new Error("No image to download");
  }

  // Create download link from the converted image URL
  const link = document.createElement("a");
  link.href = convertedImageUrl;
  link.download = "converted-html.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
