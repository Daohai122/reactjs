
import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import TheLe from "../Containers/Thele";
import KetQua from "../Containers/KetQua";
import DuThi from "../Containers/DuThi";
import TaiLieu from "../Containers/TaiLieu";
const routes = [
  {
    path: "/thele",
    component: TheLe
  },
  {
    path: "/duthi",
    component: DuThi,
  },
  {
    path: "/ketqua",
    component: KetQua,
  },
  {
    path: "/tailieu",
    component: TaiLieu,
  }
];

export default function RouteConfig({getRouter}) {
  return (
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} getRouter = {getRouter}/>
        ))}
        <Redirect to="/duthi" />
      </Switch>
  );
}
function RouteWithSubRoutes(route) { 
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route} />
      )}
    />
  );
}

