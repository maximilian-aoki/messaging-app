# Instant Messaging App

A real-time messaging app, powered by Express, MongoDB, Socket.io, ejs, and tailwind.

Users can log in, add new friends, and send messages with real-time updates on both sender and receiver end. Messages persist in the MongoDB database.

Front end is fully mobile-responsive.

### Demo

[Live App](https://message-app-maximilian.fly.dev/)

Product Features:

- REST API serving HTML with ejs templates
- Authentication with passport-local strategy, storing session data in MongoDB
- Socket.io integration with private real-time chat rooms

### Future Roadmap

- Add ability to atlas-search the messages db collection for text based on keywords
- Add ability to manage own profile
- Add ability to send images through Cloudinary URL generation
- Add video call functionality
- Separate backend and frontend - use React for web front
- Add microinteractions to improve UI
- Add apicache middleware to common routes
