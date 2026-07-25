// Idee: ich baue den rechner so, dass davor gefragt wird welcher nutzer sich einloggt,
// je nachdem wir vorzeichen des saldos umgedreht
// Wichtig: rechner wird gebaut aus Perspektive WENN NIKOS YELVA 10€ SCHULDET -> SALDO -10€

let user = null
const form = document.getElementById("eintragForm")

const saldoHtml = document.getElementById("saldo")

let saldo = 0

const overlayHtml = document.getElementById("overlay")

const buttonOverlay =document.getElementById("startButton")

const userSelectHtml = document.getElementById("userHtml")

const userHtmlText = document.getElementById("userHtmlText")

const saldosText = document.getElementById("saldoText") 


buttonOverlay.addEventListener("click", function () {
    overlayHtml.classList.add("hidden")
    user = userSelectHtml.value
    userHtmlText.textContent = "User: " + user
    console.log(overlayHtml.className)
    console.log(user)
})



// async vor Funktion brauche ich, weil ich await benutze
// await brauche ich damit die funktion wartet bis server ergebnis da ist
form.addEventListener("submit", async function(e) {
    
    e.preventDefault(); // brauche ich weil sonst daten direkt an browser und weil sonst seite neu lädt

    const data = new FormData(form);

    const eintrag = Object.fromEntries(data.entries());

    // fetch -> Anfrage an Server (HTTP)
    // Post -> man sendet Daten an Server
    // JSON stringify -> Übersetzen von js Objekt in JSON, weil JSON verstanden wird von HTTP
    // das ergebnis, das was Server zurücksendet wird gespeichert in serverAntwortObjekt
    // aber serverAntwort enthält das ganze Respone Objekt, wir wollen davon nur text haben
    const serverAntwortObjekt = await fetch("http://localhost:3000/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eintrag)
    });

    const serverAntwortSaldo = await serverAntwortObjekt.json();
    // Json funktion bringt ein Promise (da kommt was). Der Vorgang ist asynchron? Deswegen awiat
    // Asynchron = der Vorgang braucht eventuell Zeit. JS kann währenddessen andere Sachen erledigen
    // await = alles unter der Funktion bleibt wird pausiert bis vorgang fertig; aber alles außerhalb nicht betroffen 


    console.log(serverAntwortSaldo);

    saldoAngepasstAnUser = saldoAngepassungAnUser(serverAntwortSaldo, user);
    
 
    saldoText(saldosText, user, saldoAngepasstAnUser)
    console.log("Saldo= " + saldoAngepasstAnUser)

    saldoHtml.textContent = saldoAngepasstAnUser
    console.log(eintrag)
})

// Betrag Rechner Je nachdem .... an .... muss betrag vorzeichen passen
// Wenn nikos yelva 10€ schuldet (10€ von yelva an Nikos ) -> SaLdo -10€
let saldoAngepasstAnUser

let saldoAngepassungAnUser = function (saldo, User) {

   if (user == "Yelva") {
    saldoAngepasstAnUser = -saldo
   }

   else {
    saldoAngepasstAnUser = saldo
   }

    return saldoAngepasstAnUser
};



let saldoText = function(div, user, saldoAngepasstAnUser) {

    let betragOhneVorzeichen = Math.abs(saldoAngepasstAnUser)

    if (user == "Yelva" && saldoAngepasstAnUser < 0 ) {
    div.textContent = `Yelva schuldet Nikos ${betragOhneVorzeichen}€`
    }

    else if (user == "Yelva" && saldoAngepasstAnUser > 0 ) {
    div.textContent = `Nikos schuldet Yelva ${betragOhneVorzeichen}€`
    }

    if (user == "Nikos" && saldoAngepasstAnUser < 0 ){
    div.textContent = `Nikos schuldet Yelva ${betragOhneVorzeichen}€`
    }

    else if (user == "Nikos" && saldoAngepasstAnUser > 0 ) {
    {div.textContent = `Yelva schuldet Nikos ${betragOhneVorzeichen}€`}    
    }
}

//Du kannst const nehmen weil die refernz gleich bleibt. Form zeigt immer auf das gleiche 
// Nach einem Event listener kommt in die Function das "Event-object"
// Document Object model -> Browser verwandelt html in Baumstrutkur auf die JS zugreifen kann
// "DOM-Elemente sind normale JavaScript-Objekte, aber sie stammen aus der Browser API."
// "	•	HTML wird vom Browser in einen DOM-Baum verwandelt
//	•	die Knoten im Baum heißen Nodes
//	•	HTML-Tags werden zu DOM-Elementen
//	•	diese sind JavaScript-Objekt"
//DOM=DOCUMENT OBJECT MODEL
// FormData ist ein Bauplan zum erstellen eines objekts. Zb.gibt auch Date
// new erstellt ein konkretes objekt
// Form Data macht dann daraus schlüssrl wert paare
// JS speichert die Schlüssel intern immer als Strings deswegen geht "Von"
/*Primitive Werte (Zahl, String, Boolean) → werden beim Übergeben als Argument kopiert → Änderungen in der Funktion betreffen nur die Kopie, nicht die originale Variable.
	•	Objekte/Arrays → werden als Referenz übergeben → Änderungen wirken auf das Original. */
//21.03.26: als nächstes mechanismus bauen, der optionen sperrt, wenn eins gewählt ist
// zb von yelva an yelva soll nicht gehen (eventuell einfach if bedingungen anpassen)
// zusärtlich an beide mechanismus einbauen (rcihtiger wert wird habiert)