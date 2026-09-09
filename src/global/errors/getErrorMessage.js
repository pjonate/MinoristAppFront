const errorMessages = {
  INVALID_USER: "Usuario o contraseña incorrectos",
  UNPROCESSABLE_ENTITY: "Usuario ya existe",
  NETWORK_ERROR: "Problema de conexión",
  SERVER_ERROR: "Error del servidor",
  PRODUCT_NOT_FOUND: "Producto no encontrado"
};

export function getErrorMessage(code) {
  return errorMessages[code] || "Ocurrió un error inesperado";
}