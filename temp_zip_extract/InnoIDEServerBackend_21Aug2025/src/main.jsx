import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom"; // Ensure BrowserRouter is imported
import { ProjectProvider } from "./ProjectContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-wktf4z85knmzd13k.us.auth0.com"
    clientId="LK8AcUmw9SrvIoGY9gtDrLApbKJrUo4S"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <ChakraProvider theme={theme}>
      <ProjectProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProjectProvider>
    </ChakraProvider>
  </Auth0Provider>
);
