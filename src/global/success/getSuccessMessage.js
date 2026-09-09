const successMessages = {
    RESOURCE_CREATED: "Usuario creado"
};

export function getSuccessMessage(code) {
  return successMessages[code] || "Operación exitosa";
}