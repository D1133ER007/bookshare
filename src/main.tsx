import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

const basename = import.meta.env.BASE_URL;

// Configure future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <BrowserRouter basename={basename} future={router.future}>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
