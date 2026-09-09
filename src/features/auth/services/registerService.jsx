const API_URL = process.env.REACT_APP_API_URL;

export async function registerService({name, password}){
    try{
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json" 
            },
            body: JSON.stringify({ name, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            const error = new Error("Request failed");

            error.status = response.status;

            switch (response.status) {
              case 422:
                error.code = "UNPROCESSABLE_ENTITY";
                break;
            }
            console.error(error);
            throw error;
        }

        // success
        let code;

        switch (response.status) {
          case 201:
            code = "RESOURCE_CREATED";
            break;
          case 200:
            code = "SUCCESS";
            break;
          case 204:
            code = "NO_CONTENT";
            break;
          default:
            code = "SUCCESS";
        }
        
        console.log(data);
        return {
          code,
          status: response.status,
          data
        };
    }catch(err){
      // 👇 CLAVE
      if (err.code) {
        throw err;
      }

      throw {
        code: "NETWORK_ERROR",
      };
    }
}