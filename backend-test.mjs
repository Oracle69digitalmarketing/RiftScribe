import axios from 'axios';

const apiEndpoint = 'https://l8vqribcql.execute-api.eu-central-1.amazonaws.com/Prod/generate-saga/';

const testData = {
  summonerName: 'PlayerOne',
  persona: {
    name: 'Braum, the Heart of the Freljord',
    description: 'A brave and kind-hearted hero who protects the weak and fights for justice.',
    style: 'A heartwarming and inspiring tale of heroism and friendship.',
    image: 'braum.png'
  }
};

async function testBackend() {
  console.log('Testing backend connection...');
  try {
    const response = await axios.post(apiEndpoint, testData);
    console.log('Backend connection successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Backend connection failed:');
    if (axios.isAxiosError(error)) {
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

testBackend();
