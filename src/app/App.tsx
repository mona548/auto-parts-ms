import { RouterProvider } from "react-router";
import { router } from "./routes";
import { PartsProvider } from "./context/PartsContext";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <PartsProvider>
        <RouterProvider router={router} />
      </PartsProvider>
    </SettingsProvider>
  );
}