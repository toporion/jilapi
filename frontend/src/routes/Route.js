import {
  createBrowserRouter
} from "react-router-dom";
import Main from "../layOut/Main";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../layOut/Dashboard";
import AdminHome from "../adminPages/AdminHome";
import PrivateRoute from "./PrivateRoute";
import UsersManage from "../adminPages/UsersManage";
import AddIngredient from "../adminPages/AddIngredient";
import IngredientList from "../adminPages/IngredientList";
import PurchaseIngredient from "../adminPages/PurchaseIngredient";
import AddRecipe from "../adminPages/AddRecipe";
import ProduceIceCream from "../adminPages/ProduceIceCream";
import ProductList from "../adminPages/ProductList";
import POS from "../adminPages/POS";
import TableManager from "../adminPages/TableManager";
import CustomerMenu from "../pages/CustomerMenu";
import KitchenOrders from "../adminPages/KitchenOrders";
import RecipeList from "../adminPages/RecipeList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      {path: "/menu/table/:tableNo",element: <CustomerMenu />},
    ]
  },
  {
    path: '/admin',
    element: <PrivateRoute allowedRoles={['admin', 'owner', 'user']}><Dashboard /></PrivateRoute>,
    children: [
      { path: '', element: <AdminHome /> },
      { path: 'user_manage', element: <UsersManage /> },
      { path: 'add_ingredient', element: <AddIngredient /> },
      { path: 'list_ingredient', element: <IngredientList /> },
      { path: 'purchase_ingredient', element: <PurchaseIngredient /> },
      { path: 'add_recipe', element: <AddRecipe /> },
      { path: 'produce', element: <ProduceIceCream /> },
      { path: 'product_stock', element: <ProductList /> },
      { path: 'pos', element: <POS /> },
      { path: 'tables', element: <TableManager /> },
      { path: 'kitchen', element: <KitchenOrders/> },
      { path: 'recipe_list', element: <RecipeList /> },

    ]
  }
]);
export default router;
