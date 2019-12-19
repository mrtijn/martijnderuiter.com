import React from "react";
import gsap from "gsap";
import Navigation from "./components/navigation/navigation";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./views/Home/Home";
import Experiments from "./views/Experiments/Experiments";
import Particles from "./views/Experiments/particlesystem";

function App() {
  const cursor = document.querySelector("#cursor") as HTMLElement;
  document.addEventListener("mousemove", e => {
    gsap.to(cursor, 0, { y: e.pageY, x: e.pageX, opacity: 1 });
  });
  const root: Element = document.querySelector("body") as Element;
  root.addEventListener("mouseover", (e: any) =>
    e.target.matches("a")
      ? gsap.to(cursor, 0.7, { scale: 2 })
      : gsap.to(cursor, 0.4, { scale: 1 })
  );

  return (
    <Router>
      <Navigation></Navigation>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/experiments" component={Experiments} />
        <Route exact path="/particles" component={Particles} />
      </Switch>
    </Router>
  );
}

export default App;
