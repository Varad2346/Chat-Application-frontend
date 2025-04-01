import { NavLink } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      <div>
        <h2>404</h2>
        <h4>Page not Found</h4>
        <div>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/">Login</NavLink>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
