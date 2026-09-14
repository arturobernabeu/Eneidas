---
description: Levanta un servidor estático local en el puerto 5173 y muestra la URL
allowed-tools: Bash(npx serve:*), Bash(npx http-server:*)
---

Levanta un servidor estático sobre la raíz del proyecto en el puerto 5173,
en segundo plano, y dime la URL para abrir la landing en el navegador.

Usa `npx --yes serve . -l 5173`. Si falla, prueba con
`npx --yes http-server . -p 5173`.
