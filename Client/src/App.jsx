import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProvider } from "./context/AppContext.jsx";

// create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppRoutes />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster position="top-center" />
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
