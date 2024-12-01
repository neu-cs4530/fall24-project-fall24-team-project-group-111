# CodeFlow
CodeFlow is a platform aimed to help users ask and answer questions related to code. Our project enhances user experience by integrating a user authentication feature, allowing them to create and save changes to their personal account. These changes include personal customization features such as changing: theme, font size, font style, line spacing, and font boldness. For accessibility, our platform implements a text-to-speech toggle as well. Since we aim to assist users in asking questions, our project integrates an AI chatbot to create sample questions based on a topic of the user’s liking.

## Steps to run locally
1. Create 2 files to store environment variables in the server and client directories (see the section below if you need to generate your own values)

`server/.env`
```
MONGODB_URI=
CLIENT_URL=http://localhost:3000
PORT=8000
JWT_SECRET=
GMAIL_USER=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
OPENAI_API_KEY=
```

`client/.env`
```
REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

2. Install all necessary dependencies
```
cd server
npm install
cd ../client
npm install
```

3. Start the server and client
```
cd ../server
npm run start

# open a new terminal
cd client
npm run start
```

## Environment variables

To run the project locally, you need to set up the following environment variables:

### Server Environment Variables (`server/.env`)

- `MONGODB_URI`: The connection string for your MongoDB database. You can create a free MongoDB cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get the connection string from there.
- `CLIENT_URL`: The URL where your client application is running. For local development, this is usually `http://localhost:3000`.
- `PORT`: The port on which your server will run. For local development, you can use `8000`.
- `JWT_SECRET`: A secret key for signing JSON Web Tokens. You can generate a random string using an online tool like [RandomKeygen](https://randomkeygen.com/).
- `GMAIL_USER`: A Gmail address used for sending emails.
- `GMAIL_CLIENT_ID`: The client ID for your Google application. You can create a new project and get the client ID from the [Google Cloud Console](https://console.cloud.google.com/).
- `GMAIL_CLIENT_SECRET`: The client secret for your Google application. You can get this from the [Google Cloud Console](https://console.cloud.google.com/).
- `GMAIL_REFRESH_TOKEN`: A refresh token for your Gmail account. Use the steps in the section below.
- `OPENAI_API_KEY`: Your API key for OpenAI. You can get this by signing up at [OpenAI](https://www.openai.com/).

### Client Environment Variables (`client/.env`)

- `REACT_APP_SERVER_URL`: The URL where your server application is running. For local development, this is usually `http://localhost:8000`.
- `REACT_APP_GOOGLE_CLIENT_ID`: The client ID for your Google application. You can create a new project and get the client ID from the [Google Cloud Console](https://console.cloud.google.com/).
- `REACT_APP_REDIRECT_URI`: The redirect URI for your Google OAuth2.0 authentication. For local development, this is usually `http://localhost:3000/auth/google/callback`.

### Generate GMAIL_REFRESH_TOKEN
1. Go to the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. In the settings, enter your ‘OAuth Client ID’ and ‘OAuth Client secret’
3. Input the scope `https://mail.google.com/`
4. Click ‘Authorize APIs’ and follow the steps that open
5. Once back in the playground, click ‘Exchange authorization code for tokens’
6. Copy the `refresh_token` from the response
