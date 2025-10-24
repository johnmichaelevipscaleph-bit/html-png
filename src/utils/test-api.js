// Test script to debug the API endpoint
const testAPI = async () => {
  const testHTML = `
    <html>
      <head>
        <title>Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-box { 
            width: 300px; 
            height: 200px; 
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="test-box">Hello World!</div>
      </body>
    </html>
  `;

  try {
    console.log('Testing API endpoint...');
    
    const response = await fetch('/api/convert-to-png', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: testHTML,
        options: {
          width: 400,
          height: 300,
          scale: 2
        }
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Success! Result:', {
      success: result.success,
      method: result.method,
      dimensions: result.dimensions,
      dataUrlLength: result.dataUrl ? result.dataUrl.length : 0
    });

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run test if in browser
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
  console.log('Test function available as window.testAPI()');
}

export default testAPI;
