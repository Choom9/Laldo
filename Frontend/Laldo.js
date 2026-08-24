// Idee: ich baue den rechner so, dass davor gefragt wird welcher nutzer sich einloggt,
// je nachdem wir vorzeichen des saldos umgedreht
// Wichtig: rechner wird gebaut aus Perspektive WENN NIKOS YELVA 10€ SCHULDET -> SALDO -10€

let user = null
const form = document.getElementById("eintragForm")

const saldoHtml = document.getElementById("saldo")



const overlayHtml = document.getElementById("overlay")

const buttonOverlay =document.getElementById("startButton")

const userSelectHtml = document.getElementById("userHtml")

const userHtmlText = document.getElementById("userHtmlText")

const saldosText = document.getElementById("saldoText") 


buttonOverlay.addEventListener("click", async function () {
    overlayHtml.classList.add("hidden")
    user = userSelectHtml.value
    userHtmlText.textContent = "User: " + user
    console.log(overlayHtml.className)
    console.log(user)

    let antwortVomBackend = await fetch("http://localhost:3000/saldo", {
    method: "GET",
    // header mit JSON anweisung braucht man nicht, weil man keine Daten schickt
   // kein Body, braucht man nur wenn man neue daten schickt
    });
    let saldoVomBackendAlt = await  antwortVomBackend.json();
    // fetch gibt nur Response Objekt, mit json()-> antwort body auslesen und umwandeln in JS

let saldoRichtigAlt
    if (user == "Nikos") {
    saldoRichtigAlt = saldoVomBackendAlt
    }

    else if (user == "Yelva") {
    saldoRichtigAlt = -saldoVomBackendAlt
    }

    saldoText(saldosText, user, saldoRichtigAlt);
    //Text setzen
    saldoHtml.textContent = saldoRichtigAlt;
    // saldo setzen
})
// warum async und await?


let saldoVomBackend
let saldoRICHTIG

// async vor Funktion brauche ich, weil ich await benutze
// await brauche ich damit die funktion wartet bis server ergebnis da ist
form.addEventListener("submit", async function(e) {
    
    e.preventDefault(); // brauche ich weil sonst daten direkt an browser und weil sonst seite neu lädt

    const data = new FormData(form)

    const eintrag = Object.fromEntries(data.entries())
    // !!!!fetch -> Anfrage an Server (HTTP)
    // !! Fetch klärt 1. das was an backend geschickt wird und 2. der rückgabe wert davon ist die Antwort von Backend 
    // Post -> man sendet Daten an Server
    // JSON stringify -> Übersetzen von js Objekt in JSON, weil JSON verstanden wird von HTTP



    let antwortVomBackend = await fetch("http://localhost:3000/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Damit express im Backend weis dass das JSON ist
    body: JSON.stringify(eintrag), 
    });
    // POST = Daten senden und speichern 
    // GET = Daten vom Server anfordern

    saldoVomBackend = await antwortVomBackend.json();
    // !!!!kriegt saldo vom Backend
  

    if (user == "Nikos") {
    saldoRICHTIG = saldoVomBackend
    }

    else if (user == "Yelva") {
    saldoRICHTIG = -saldoVomBackend
    }
    //!! Vorzeichen des Saldos je nach User Umdrehen
    

    
    
    saldoText(saldosText, user, saldoRICHTIG);
    console.log("Saldo= " + saldoRICHTIG);

    saldoHtml.textContent = saldoRICHTIG;
    console.log(eintrag);
})

// Betrag Rechner Je nachdem .... an .... muss betrag vorzeichen passen
// Wenn nikos yelva 10€ schuldet (10€ von yelva an Nikos ) -> SaLdo -10€

let saldoText = function(div, user, saldo) {

    let betragOhneVorzeichen = Math.abs(saldo)

    if (user == "Yelva" && saldo < 0 ) {
    div.textContent = `Yelva schuldet Nikos ${betragOhneVorzeichen}€`
    }

    else if (user == "Yelva" && saldo > 0 ) {
    div.textContent = `Nikos schuldet Yelva ${betragOhneVorzeichen}€`
    }

    if (user == "Nikos" && saldo < 0 ){
    div.textContent = `Nikos schuldet Yelva ${betragOhneVorzeichen}€`
    }

    else if (user == "Nikos" && saldo > 0 ) {
    {div.textContent = `Yelva schuldet Nikos ${betragOhneVorzeichen}€`}    
    }

    else if( saldo == 0) {
    {div.textContent = `Ihr seid quitt`}
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