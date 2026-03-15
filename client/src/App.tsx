import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Analytics } from "@vercel/analytics/react";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route>
            <div className="flex items-center justify-center h-screen">
              <p className="text-muted-foreground">Page not found</p>
            </div>
          </Route>
        </Switch>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
