import { useEffect, useRef } from "react";

export function useBarcodeScanner(onScan) {
  const bufferRef = useRef("");
  const timeoutRef = useRef(null);

  const SCAN_TIMEOUT = 120; // clave
  const MIN_LENGTH = 6;

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;

      // no interferir con inputs
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // solo caracteres válidos
      if (e.key.length !== 1) return;

      bufferRef.current += e.key;

      // reinicia el timer cada tecla
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const code = bufferRef.current;

        if (code.length >= MIN_LENGTH) {
          onScan(code);
        }

        bufferRef.current = "";
      }, SCAN_TIMEOUT);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onScan]);
}