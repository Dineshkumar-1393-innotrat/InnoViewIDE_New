import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from "react-router-dom"; // Ensure BrowserRouter is imported
import { AuthProvider } from './contexts/AuthContext';
import "./index.css"; // Import Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="47164449257-filjohd7mh25crunonvqjv79io9vgjsp.apps.googleusercontent.com">
    <ChakraProvider theme={theme}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </GoogleOAuthProvider>
);
