# Test script for the HTML to PNG API

const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing HTML to PNG API...\n');

  // Test 1: Health check
  console.log('1. Testing health check...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: API documentation
  console.log('\n2. Testing API documentation...');
  try {
    const response = await fetch(`${API_URL}/api`);
    const data = await response.json();
    console.log('✅ API docs available:', data.name, data.version);
  } catch (error) {
    console.log('❌ API docs failed:', error.message);
  }

  // Test 3: Basic HTML conversion
  console.log('\n3. Testing basic HTML conversion...');
  try {
    const response = await fetch(`${API_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: '<h1 style="color: red;">Hello World!</h1><p>This is a test conversion.</p>'
      })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('✅ Basic conversion successful');
      console.log('   Dimensions:', data.dimensions);
      console.log('   Processing time:', data.processingTime);
      console.log('   Data URL length:', data.dataUrl.length);
    } else {
      console.log('❌ Basic conversion failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Basic conversion error:', error.message);
  }

  // Test 4: Custom options
  console.log('\n4. Testing custom options...');
  try {
    const response = await fetch(`${API_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: '<div style="width: 800px; height: 600px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); display: flex; align-items: center; justify-content: center;"><h1 style="color: white; font-size: 48px;">Custom Size Test</h1></div>',
        options: {
          width: 800,
          height: 600,
          scale: 1,
          format: 'png'
        }
      })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('✅ Custom options successful');
      console.log('   Dimensions:', data.dimensions);
      console.log('   Processing time:', data.processingTime);
    } else {
      console.log('❌ Custom options failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Custom options error:', error.message);
  }

  // Test 5: Error handling
  console.log('\n5. Testing error handling...');
  try {
    const response = await fetch(`${API_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing htmlContent
      })
    });
    
    const data = await response.json();
    if (!data.success) {
      console.log('✅ Error handling working:', data.error, data.code);
    } else {
      console.log('❌ Error handling failed - should have returned error');
    }
  } catch (error) {
    console.log('❌ Error handling test error:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Run tests
testAPI().catch(console.error);
