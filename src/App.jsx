import "./App.css";
import { useState, useEffect } from "react";

function App() {
  // Stato per la lista delle task che fanno parte della toDo List
  const [toDo, setToDo] = useState([]);

  // Stato per gestire il valore dell'input testuale
  const [valoreInput, setValoreInput] = useState("");

  // Stato per gestire il loader
  const [caricamento, setCaricamento] = useState(false);

  /**
   *
   * Sistema CRUD
   * C - Create (POST)
   * R - Read (GET)
   * U - Update (PUT)
   * D - Delete (DELETE)
   *
   *
   */

  /**
   *
   *
   * READ
   *
   *
   */
  useEffect(() => {
    // Mostro il messaggio/spinner/loader di caricamento
    setCaricamento(true);

    // Fetch
    fetch("http://localhost:5001/toDo")
      .then((response) => response.json()) // Converto la risposta in formato JSON
      .then((data) => setToDo(data)) // Impostato lo "stato" toDo con i dati che ricevo
      .catch((error) => console.error("Errore nella fetch dei toDo:", error)) // Gestiamo gli errori
      .finally(() => {
        setCaricamento(false);
      });
  }, []);

  /**
   *
   *
   * CREATE - post
   *
   *
   */

  const creaToDo = () => {
    if (!valoreInput.trim()) return; // Evito l'aggiunta di task vuote al db.json

    const nuovaToDo = { titoloToDo: valoreInput };

    setCaricamento(true); // Mostro l'indicatore di caricamento

    // Fetch
    fetch("http://localhost:5001/toDo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuovaToDo),
    })
      .then((response) => response.json()) // Convertiamo la risposta in JSON
      .then((data) => {
        setToDo([...toDo, data]); // Aggiungo la nuova toDo alla lista esistente di toDo
        setValoreInput(""); // resetto il valore dell'input
      })
      .catch((error) =>
        console.error("Errore nella crazione della ToDo:", error)
      )
      .finally(() => {
        setCaricamento(false);
      });
  };

  /**
   *
   *
   * UPDATE - PUT
   *
   *
   */
  const modificaToDo = (id, toDoAggiornata) => {
    setCaricamento(true); // mostro il caricamento

    fetch(`http://localhost:5001/toDo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titoloToDo: toDoAggiornata }),
    })
      .then((response) => response.json())
      .then((data) =>
        setToDo(
          toDo.map((singoloElemento) =>
            singoloElemento.id === id ? data : singoloElemento
          )
        )
      )
      .catch((error) =>
        console.error("Errore nella modifica della todo:", error)
      )
      .finally(() => {
        setCaricamento(false);
      });
  };

  /**
   *
   *
   * DELETE
   *
   *
   */

  const cancellaToDo = (id) => {
    setCaricamento(true);

    fetch(`http://localhost:5001/toDo/${id}`, {
      method: "DELETE",
    })
      .then(() => setToDo(toDo.filter((singolaToDo) => singolaToDo.id !== id)))
      .catch((error) => console.error("Errore nell'eliminare la todo", error))
      .finally(() => setCaricamento(false));
  };

  return (
    <>
      <h1>ToDo List</h1>
      {/* BLOCCO INSERIMENTO TODO */}
      <div>
        <h2>Aggiungi una ToDo</h2>
        <input
          type="text"
          value={valoreInput}
          onChange={(e) => setValoreInput(e.target.value)}
        ></input>
        <button onClick={creaToDo} disabled={caricamento}>
          Aggiungi la ToDo
        </button>
      </div>

      {/* BLOCCO LISTA TODO */}
      <div>
        <h3>Lista delle task</h3>
        {/* RENDERING CONDIZIONALE */}
        {caricamento && <p>Caricamento...</p>}

        <ul>
          {toDo.map((singolaToDo) => (
            <li key={singolaToDo.id}>
              {singolaToDo.titoloToDo}
              {/* BOTTONE PER LA MODIFICA */}
              <button
                onClick={() =>
                  modificaToDo(
                    singolaToDo.id,
                    prompt(
                      "Aggiorna il nome della ToDo",
                      singolaToDo.titoloToDo
                    )
                  )
                }
              >
                Modifica
              </button>
              {/* BOTTONE PER ELIMINARE */}
              <button onClick={() => cancellaToDo(singolaToDo.id)}>
                Task Completata
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
