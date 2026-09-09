const API_URL = process.env.REACT_APP_API_URL;

export async function loginService({ name, password }) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error("Request failed");

      error.status = response.status;

      switch (response.status) {
        case 400:
          error.code = "VALIDATION_ERROR";
          break;
        case 401:
          error.code = "INVALID_USER";
          break;
        case 403:
          error.code = "FORBIDDEN";
          break;
        case 404:
          error.code = "NOT_FOUND";
          break;
        case 500:
          error.code = "SERVER_ERROR";
        break;
      }
      //console.log("loginService:", error.code);
      throw error;
    }
    return data // { token, user }
  } catch (err) {
      // 👇 CLAVE
      if (err.code) {
        throw err;
      }

      throw {
        code: "NETWORK_ERROR",
      };
  }
}