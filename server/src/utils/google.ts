import dotenv from 'dotenv';
import logger from 'src/log/logger';

dotenv.config();

export const searchGooglePlacesByText = async (
  textQuery: string,
  location: { latitude: number; longitude: number }
) => {
  const { latitude, longitude } = location;
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Google API key is not set');
  }

  // Using the new Places API endpoint
  const url = `https://places.googleapis.com/v1/places:searchText`;

  const requestBody = {
    textQuery,
    routingParameters: {
      origin: {
        latitude,
        longitude,
      },
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.priceLevel,routingSummaries,places.id,places.photos,places.googleMapsUri,places.websiteUri,places.location',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('Google Places API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      url,
      headers: response.headers,
    });
    throw new Error(
      `Google Places API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  logger.info(
    `Google Places API request successful: ${JSON.stringify(requestBody)}`
  );
  const data = await response.json();
  return data;
};
