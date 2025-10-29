// Server-side conversion using Puppeteer (supports backdrop-filter and modern CSS)
export const convertHTMLToPNGServer = async (htmlContent, options = {}) => {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: htmlContent,
        options: {
          width: options.width || 1080,
          height: options.height || 1080,
          scale: options.scale || 2,
          format: 'png',
          fullPage: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.details || `Server error: ${response.status}`;
      const errorWithDebug = errorData.debug 
        ? `${errorMessage}\n\nDebug: ${errorData.debug}`
        : errorMessage;
      
      console.error('API Error Response:', {
        status: response.status,
        errorData,
        message: errorMessage,
      });
      
      throw new Error(errorWithDebug);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Server conversion failed');
    }

    return result.dataUrl;
  } catch (error) {
    console.error('Server conversion error:', error);
    throw error;
  }
};

