# Overview

## Original Application

`EatWhatNow` initially started as a project that helped user looked for restaurants around them. I wanted to build an ecosystem of restaurants within my own database. In order to do so, I had features that allowed user to add restaurants to our database where they acted as contributors.

However, this has proved to be very inefficient and realistically no one has the time and effort to do something like this.

## New Proposed Ideas

1. Use Google Places API to find restaurants around them. Since API is expensive, this would be achieved by minimizing number of API calls that will actually hit Google's server.

2. Users will be able to save and store their favorite restaurants. These data will be cached for 30 days.

## User Experience Flow

1. Upon opening the site, it will find user's location and scan for restaurants within a fixed radius.
2. In order to provide optimal result, it will scan a batch and filter out only based on set criteria. These can be displayed as a carousel.
3. Users can favorite their restaurant, which will then be bookmarked.
