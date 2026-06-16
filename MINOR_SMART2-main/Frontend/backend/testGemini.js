require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing from .env');
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('Testing Gemini connection... this might take a few seconds.');
    const result = await model.generateContent('Say exactly: "Gemini is connected successfully!"');
    const response = await result.response;
    
    console.log('\n✅ Success! Gemini replied with:');
    console.log(response.text().trim());
  } catch (error) {
    console.error('\n❌ Gemini API test failed:');
    console.error(error.message);
  }
}

testGemini();
