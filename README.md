# Swim Test App for the Emilson Y
A simple web app designed to manage the swim test list at the Emilson Y. It pulls and adds data to a Google Sheet with a touch-friendly interface to reduce errors in accidental edits and duplicate additions. It uses Google Sheets API, Redis cache, and Pusher for real-time updates.

### Built With
- Frontend: Next.js with Tailwind CSS
- Backend: Next.js
- Data: Google Sheets API with Redis Cache
- Realtime Service: Pusher
- Hosting: Vercel
- Auth: Cloudflare Access


## Getting Started
### Prerequisites
- Node.js and npm installed on your system
- React/Next.js experience (for developers)

### Installation
1. Clone the repo and install dependencies 
```
git clone https://github.com/bmlui/emilsonyswimtest
cd swimtestapp
npm install
```
2. Then, setup the env based on the .env.example. A Google Cloud Service Account json secrect is needed. You must also share the Google Sheet with edit permissions to the email listed on the json secrect/service account. Redis and Pusher accounts are optional. 
3. Lastly, run development server.

```
npm run dev
```

### Deployment 
```
npm run build
npm start
```


## License
This project is licensed under the MIT License 
