const einträgeArrayFürB = [];

const express = require("express");
// Holt die Express Bibliothek und speicher ihren inhalt in express vari

const cors = require("cors");

const expressApp = express();
// express(), erzeigt eine express anwednung gibt sie zurück, wird dann in app gespeichert 
// express liefert eine Funktion 

expressApp.use(cors());
expressApp.use(express.json());

 let saldo = 0
// Saldo muss außerhalb der Route stehen denn sonst wird es immer wieder auf null gesetzt
// saldo muss let sein weil später neue Zuordnung (saldoUpdate)

expressApp.post("/entries", (req, res) => {
  einträgeArrayFürB.push(req.body);

  eintragSpeichern.run(
  req.body.Betrag,
  req.body.Von,
  req.body.An
);
// führt die Funktion aus, die Einträge in Datenbank speichert

// Saldo wird berechnet von Nikos Perspektive
// Muss im Frontend noch umgedreht werden wenn User=Yelva


    let letzterBetrag = Number(letzteArrEigsch(einträgeArrayFürB, "Betrag"))
    let letztesVon = letzteArrEigsch(einträgeArrayFürB, "Von")
    let letztesAn =letzteArrEigsch(einträgeArrayFürB, "An")

    let richtigerBetrag = betragVorzeichen(letzterBetrag, letztesVon,letztesAn);

    saldo = saldoUpdate(richtigerBetrag, saldo)

  res.send(saldo);
});

// Wenn jemand eine POST-Anfrage an /entries sendet, füge den gesendeten Inhalt in mein Backend-Array ein, berechne Saldo aus Nikos Perspektive
// Eintrag vom Server kommt rein
// post sagt: reagiere auf die Post Anfrage mit der Route entries
// req = request (anfrage), hier findet der server ibformationen z.b über body
// res = response, damit antowrtet der server
// res.send(saldo) = schicke saldo zurück als Antowrt 





//Funktions Definitionen 

  let letzteArrEigsch = function (array, arrayEigenschaft) {
  let richtigeEigsch =  array[array.length-1][arrayEigenschaft]
    return richtigeEigsch
}
//Hole das letzte Element aus dem Array, hole xxx Eigenschaft raus, um zu wissen was "das letzte von, an und letzter Betrag sind"
// Alten Saldo mit neuem betrag verrechnen ist datensparsamer als ständig alles aus dem array zu berechnen um auf saldo zu kommen


let betragVorzeichen = function (betrag, von, an ) {
    let richtigerBetrag 
    if (von == "Yelva" && an == "Nikos") {
        richtigerBetrag = -betrag
    }

    else if (von == "Yelva" && an =="Beide") {
        richtigerBetrag = -(betrag/2)
    }

    else if (von == "Yelva" && an == "Yelva" ) {
        richtigerBetrag = 0
    }

    else if (von == "Nikos" && an == "Yelva") {
        richtigerBetrag = +betrag
    }
 
    else if (von == "Nikos" && an =="Beide") {
        richtigerBetrag = +(betrag/2)
    }

   else if (von == "Nikos" && an == "Nikos") {
     richtigerBetrag = 0
   }

    return richtigerBetrag
}
// Festlegung des Vorzeichens (aus Nikos Perspektive) des neu dazu gekommenen Betrags 


let saldoUpdate = function(richtigerBetrag, altSaldo) {
    let neuSaldo = altSaldo + richtigerBetrag
    return neuSaldo
}
//Eigentliche Verrechhnung: Alter Saldo mit neuem betrag




server.listen(3000);
// listen = Methode von Express, startet Server
// 3000 ist die PortNummer, unter der ist er erreichbar 


/* Für mich: Was habe ich installiert und warum? 
1. Node.js
2. Express
3. Cors

Warum 1.? Node ist die Laufzeit für JavaScript außrhalb des Browsers
Laufzeit = Programm, dass Code tatsächlich ausführt. Bei JS im Browser macht es der browser. JS außerhalb für z.b Server braucht ein eigenes Prorgamm -> NODE
Node wird gestartet über Terminal mit "node Backend/LaldoServer.js"
Beendet wird der Server mit Command C

Warum 2.? Express gibt Befehle/Methoden für Server Aufbau.
Express ist eine Bibliothek: fertiger Code von anderen Entwicklern der mir mein Leben leichter macht

Warum 3.? Auch Bib für Node
Gibt Methoden um Browser mitzuteilen: Dieses Backend darf mit mir (dem Frontend) kommunzieren obwohl wir unterschiedliche Ports haben. ICh (FrontEnd) darf Anfragen an Backend schicken
Port = Türnummer für programme auf meinem Computer. Programme die über ein Netzwerk erreichbar sein sollen - Server
localhost = mein Computer
localhost kann mehrere Programme haben
Portnummer sagt welcher lokale server die anfrage bekommen soll


*/

// Datenbank

const sqlite = require("node:sqlite");
// Datenbank Bib sqlite laden
// require lädt eine bereits runtergeladene Datei in eine variable 
// richtiges herunterladen durch npm install
// sqlite liefert ein Objekt mit Methoden

const datenbank = new sqlite.DatabaseSync("Backend/laldo.db");
// Klasse = Bauanleitung für objekte
// DatabaseSync ist eine klasse von sqlite, muss mit new aufgerufen werden, erzeugt ein neues objekt mit den eiegnscahften der klasse 
// Datenbank wird dadurch beim satrt des Backend erstellt

datenbank.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY,
    Betrag REAL NOT NULL,
    Von TEXT NOT NULL,
    An TEXT NOT NULL
  )
`);

//tabelle kommt in datenbank
// .exec() führe Befehl, der in Klammern, in meiner Datenbank aus
// Create Table IF not exist = erzeuge eine Tabelle, falss noch keine da ist
// Jedes ding am anfang definiert eine Spalte, id, betrag..., kommas trennen spalten
// text Not null ? hier wird text gespeichert, not null = darf nicht fehlen der eintrag

const eintragSpeichern = datenbank.prepare(`
  INSERT INTO entries (Betrag, Von, An)
  VALUES (?, ?, ?)
`);

// prepare() = bereite diesen SQL befehl vor aber führe ihn noch nicht aus