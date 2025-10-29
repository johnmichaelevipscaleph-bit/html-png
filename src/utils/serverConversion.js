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
    
    // Log the API URL for debugging
    console.log('[Client] Calling API at:', apiUrl);
    console.log('[Client] Request details:', {
      method: 'POST',
      url: apiUrl,
      contentType: 'application/json',
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure credentials are not sent for CORS
      credentials: 'omit',
      // Cache control to avoid caching issues
      cache: 'no-store',
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
      // Try to get response as text first to see what we're actually getting
      const responseText = await response.text();
      console.error('API Error Response (raw):', responseText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse error response as JSON:', e);
        console.error('Response text was:', responseText);
      }
      
      const errorMessage = errorData.error || errorData.details || `Server error: ${response.status}`;
      
      // Log full error details
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        errorData: errorData,
        errorDataString: JSON.stringify(errorData, null, 2),
        rawResponse: responseText,
        receivedMethod: errorData.receivedMethod,
        debug: errorData.debug,
      });
      
      // Build detailed error message
      let errorDetails = errorMessage;
      if (errorData.receivedMethod) {
        errorDetails += ` (Received method: ${errorData.receivedMethod})`;
      }
      if (errorData.debug) {
        errorDetails += `\n\nDebug info: ${JSON.stringify(errorData.debug, null, 2)}`;
      }
      
      throw new Error(errorDetails);
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

