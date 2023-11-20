import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import TabBar from "./components/TabBar.component";
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
import AddFood from "./pages/AddFood.page";
import EditFood from "./pages/EditFood.page";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <NavBar />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/createNewFood" element={<CreateNewFood />} />
                <Route path="/searchFood" element={<SearchFood />} />
                <Route path="/expense/:id/edit" element={<EditExpense />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/addFood" element={<AddFood />} />
                <Route path="/editFood" element={<EditFood />} />
              </Route>
            </Routes>
          </div>
          <TabBar />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
