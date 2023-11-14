import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import { UserProvider } from "./contexts/user.context";
import Analytics from "./pages/Analytics.page";
import EditExpense from "./pages/EditExpense.page";
import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";
import Signup from "./pages/Signup.page";
import ForgotPassword from "./pages/ForgotPassword.page";
import CreateNewFood from "./pages/CreateNewFood.page";
import SearchFood from "./pages/SearchFood.page";

function App() {
  return (
    <BrowserRouter>
      {/* We are wrapping our whole app with UserProvider so that */}
      {/* our user is accessible through out the app from any page*/}
      <UserProvider>
        <NavBar/>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          {<Route exact path="/forgot" element={<ForgotPassword />} />}
          <Route exact path="/signup" element={<Signup />} />
          {/* We are protecting our Home Page from unauthenticated */}
          {/* users by wrapping it with PrivateRoute here. */}
          <Route element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/createNewFood" element={<CreateNewFood />} />
            <Route exact path="/searchFood" element={<SearchFood />} />
            <Route exact path="/expense/:id/edit" element={<EditExpense />} />
            <Route exact path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
