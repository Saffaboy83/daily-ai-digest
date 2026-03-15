import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Analytics } from "@vercel/analytics/react";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";

function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
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
