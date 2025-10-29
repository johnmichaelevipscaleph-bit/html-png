// Server-side conversion using Puppeteer (supports backdrop-filter and modern CSS)
export const convertHTMLToPNGServer = async (htmlContent, options = {}) => {
  try {
    // Dynamically determine the API URL based on the current origin
    // This ensures it works in both development and production (Vercel)
    const getApiUrl = () => {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/api/convert`;
      }
      // For server-side rendering (unlikely but safe fallback)
      return process.env.NEXT_PUBLIC_API_URL || '/api/convert';
    };
    
    const apiUrl = getApiUrl();
    
    // Log the API URL for debugging (only in development)
    if (process.env.NODE_ENV === 'development' || typeof window !== 'undefined') {
      console.log('[Client] Calling API at:', apiUrl);
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure credentials are not sent for CORS
      credentials: 'omit',
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

