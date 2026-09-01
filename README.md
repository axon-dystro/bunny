# Bunny's Little Garden

Eine kleine mobile PWA mit zwei gemeinsamen mechanischen Zählern.

- Startstand: 5 Punkte / 2 Striche
- App-Port: 2909
- Bunny: `bunny.dnd-tools.de` (nur ansehen)
- Pookie: `pookie.dnd-tools.de` (Counter ändern)

## Start mit PM2

1. `npm install`
2. Mit PM2 starten.

Beispiel:
`PORT=2909 pm2 start server.js --name bunny-garden --update-env && pm2 save`

Die nginx-Beispieldatei liegt als `nginx.conf.example` bei. Beide DNS-Records müssen auf deinen Server zeigen.

Die Pookie-Ansicht wird anhand des Hostnamens erkannt. Wie gewünscht gibt es
keinen PIN und keine Anmeldung. Deshalb sollte Port 2909 nicht öffentlich
freigegeben werden, sondern nur über nginx erreichbar sein.
