# chat
Chat room server written with Node.js 10, Express, Socket.io, TingoDB and Moment inspired by Fazt video (thank you very much). It can be compiled with Pkg and pass, or not, a parameter with which it will be used to record a .json file with the data. The server run on port 3000 and records a .json for each day by concatenating the name "root" with the date, example: "ACME_2019_01_15.json", with "ACME" being the parameter. If the parameter is not passed, nothing is recorded. Regards !!!

<p>
// Development:<br/>
<b>npm run dev</b>
</p>

<p>
// Uncompile production:<br/>
<b>npm start</b>
</p>

<p>
// To compile with Pkg:<br/>
<b>npm run comp</b>
</p>

<p>
// Compile production:<br/>
<b>chat.exe [name_database_root]</b>
</p>
