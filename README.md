# Swim Test App for the Emilson Y
A simple web app that pulls and adds data to a Google Sheet. 
Previously, we used a Google Sheet to manage the swim test list. I wanted a stable fallback that is readily available. After looking at the Google Sheets API and their rate limits, we would be well under the useage. So pulling and pushing data from there is not an issue. The main issue this is adressing is having the data in a touch-friendly interface, while reducing errors in accidental edits/duplicate additions.  

### Built With
	•	Frontend: Next.js with Tailwind CSS
	•	Backend: Next.js
	•	Data: Google Sheets API
  •	Hosting: Vercel
  •	Auth: Cloudflare Access
 

```
git clone [https://github.com/yourusername/swim-test-app.git](https://github.com/bmlui/emilsonyswimtest)
cd swimtestapp
npm install
```
Then, setup the env based on the .env.example. A Google Cloud Service Account json secrect is needed. 

Lastly, run development server.

```
npm run dev
```

Or build for production / start server for production

```
npm run build
npm start
```


### License
This project is licensed under the MIT License 
