"use client";

import Input from "@mui/material/Input";
import styles from "./page.module.css";
import { Switch, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { encrypt } from "../services/cryptingService";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState(1);
  const [key, setKey] = useState("");

  useEffect(() => {
    const encryptedData = encrypt(input, direction, key);
    setOutput(encryptedData);
  }, [input, direction, key]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Harc Crypt: (Szyfr Playfair)</p>
      </div>
      <Typography variant="h1" component="h2">
        {output}
      </Typography>
      <div className={styles.center}>
        <div className={styles.col}>
          <Input
            id="outlined-basic"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <Switch
            defaultChecked
            onChange={(e) => {
              setDirection(e.target.checked ? 1 : -1);
            }}
          />
          {direction === 1 ? "PRAWO" : "LEWO"}
          {"   "}|| KLUCZ:
          <Input
            id="outlined-basic"
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
        </div>
      </div>
    </main>
  );
}
