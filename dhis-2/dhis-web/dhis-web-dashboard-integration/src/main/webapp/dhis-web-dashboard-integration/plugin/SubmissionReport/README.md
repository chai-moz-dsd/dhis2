# alert log page

2. open the page
    * sudo webpack-dev-server --cnofig  webpack.config.js --open --hot --port 80  --env dev

3. forward request
    * webpack-dev-server --cnofig  webpack.config.js --open --port 50000  --env dev

4. login the local website，using a browser open it and login
    * http://localhost/dhis-web-commons/security/login.action

5. refresh the page
PS：
you need to run this command，and add ‘dount.js’ and ‘dount.css' to your git.
    * npm run build
    * npm run dist
