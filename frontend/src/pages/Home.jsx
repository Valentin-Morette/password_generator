import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import Inputs from "../components/Inputs";

export default function Home() {
  const [password, setPassword] = useState("");
  const [maj, setMaj] = useState(true);
  const [min, setMin] = useState(true);
  const [chiffres, setChiffres] = useState(true);
  const [speciaux, setSpeciaux] = useState(false);
  const [nbCaracteres, setNbCaracteres] = useState(12);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayCopy, setDisplayCopy] = useState(false);

  function checkConditions(pass, conditions) {
    return conditions.every(({ enabled, charset }) => {
      return !enabled || pass.split("").some((c) => charset.includes(c));
    });
  }

  function generatePassword(minus, majus, numbers, specials, nbLetters) {
    const minuscules = "abcdefghijklmnopqrstuvwxyz";
    const majuscules = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const caracteresSpeciaux = "!@#$%^&*()_+";
    const numbersString = "0123456789";

    let pass = "";
    let characters = "";
    if (minus) characters += minuscules;
    if (majus) characters += majuscules;
    if (numbers) characters += numbersString;
    if (specials) characters += caracteresSpeciaux;

    const conditions = [
      { enabled: minus, charset: minuscules },
      { enabled: majus, charset: majuscules },
      { enabled: numbers, charset: numbersString },
      { enabled: specials, charset: caracteresSpeciaux },
    ];

    do {
      pass = "";
      for (let i = 0; i < nbLetters; i += 1) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pass += characters[randomIndex];
      }
    } while (!checkConditions(pass, conditions));

    setDisplayCopy(false);
    setPassword(pass);
  }

  function displayGeneratePassword() {
    setDisplayError(false);
    setDisplayPassword(true);
  }

  function generateAndDisplayPassword(
    minus,
    majus,
    numbers,
    specials,
    nbLetters
  ) {
    if (!minus && !majus && !numbers && !specials) {
      setDisplayPassword(false);
      setDisplayError(true);
      return;
    }
    generatePassword(minus, majus, numbers, specials, nbLetters);
    displayGeneratePassword();
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setDisplayCopy(true);
    } catch (err) {
      console.error("Erreur lors de la copie du mot de passe :", err);
    }
  };

  return (
    <div className="generator">
      <h1>Générateur de mot de passe</h1>
      <ul>
        <Inputs title="Majuscules" name="maj" checked={maj} setter={setMaj} />
        <Inputs title="Minuscules" name="min" checked={min} setter={setMin} />
        <Inputs
          title="Chiffres"
          name="chiffres"
          checked={chiffres}
          setter={setChiffres}
        />
        <Inputs
          title="Caractères spéciaux"
          name="speciaux"
          checked={speciaux}
          setter={setSpeciaux}
        />
        <li className="nbCaract">
          <select
            value={nbCaracteres}
            onChange={(event) => setNbCaracteres(event.target.value)}
          >
            {Array.from({ length: 121 }, (_, i) => i + 8).map((nb) => (
              <option key={nb} value={nb}>
                {nb}
              </option>
            ))}
          </select>
          <p>Nombre de caractères</p>
        </li>
      </ul>

      <button
        type="button"
        className="generate"
        onClick={() =>
          generateAndDisplayPassword(min, maj, chiffres, speciaux, nbCaracteres)
        }
      >
        Générer
      </button>
      {displayPassword && (
        <div className="passwordDiv">
          <p className="password">{password}</p>
          <FontAwesomeIcon
            className="copy"
            icon={faCopy}
            onClick={copyPassword}
            id={displayCopy ? "copied" : ""}
            title={
              displayCopy ? "Mot de passe copié !" : "Copier le mot de passe"
            }
          />
        </div>
      )}

      {displayError && (
        <div className="error">
          <p>Veuillez sélectionner au moins un type de caractères</p>
        </div>
      )}
    </div>
  );
}
