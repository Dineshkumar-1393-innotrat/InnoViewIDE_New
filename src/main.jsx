import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ProjectProvider } from "./ProjectContext.jsx";

// Uncomment the line below to enable LED blink integration with external hardware libraries
// See src/utils/README_LED_INTEGRATION.md for setup instructions
// import "./utils/ledBlinkIntegration";

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    const target = appState?.returnTo || "/editor";
    const navigationState =
      appState?.state && typeof appState.state === "object" ? appState.state : undefined;
    navigate(target, { replace: true, state: navigationState });
  };

  return (
    <Auth0Provider
      domain="dev-wktf4z85knmzd13k.us.auth0.com"
      clientId="LK8AcUmw9SrvIoGY9gtDrLApbKJrUo4S"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

const Root = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Auth0ProviderWithNavigate>
      <ChakraProvider theme={theme}>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </ChakraProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
