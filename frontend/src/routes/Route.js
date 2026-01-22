import { createBrowserRouter, Navigate } from "react-router-dom"; // 👈 Import Navigate
import UseAuth from '../hooks/UseAuth';

// Layouts
import Main from "../layOut/Main";
import Dashboard from "../layOut/Dashboard";

// Public Pages
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import CustomerMenu from "../pages/CustomerMenu";

// Admin Pages
import AdminHome from "../adminPages/AdminHome";
import UsersManage from "../adminPages/UsersManage";
import AddIngredient from "../adminPages/AddIngredient";
import IngredientList from "../adminPages/IngredientList";
import PurchaseIngredient from "../adminPages/PurchaseIngredient";
import AddRecipe from "../adminPages/AddRecipe";
import RecipeList from "../adminPages/RecipeList";
import ProduceIceCream from "../adminPages/ProduceIceCream";
import ProductList from "../adminPages/ProductList";
import TableManager from "../adminPages/TableManager";
import POS from "../adminPages/POS";
import KitchenOrders from "../adminPages/KitchenOrders";

// Protection Wrapper
import PrivateRoute from "./PrivateRoute";

// 👇 NEW: Helper Component to Redirect Staff
const AdminDashboardRedirect = () => {
    const { user } = UseAuth();
    if (user?.role === 'staff') {
        return <Navigate to="/admin/pos" replace />;
    }
    return <AdminHome />;
};

const router = createBrowserRouter([
  // --- 1. PUBLIC ROUTES ---
  {
    path: "/",
    element: <Main />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: "/menu/table/:tableNo", element: <CustomerMenu /> },
    ]
  },

  // --- 2. ADMIN PANEL ROUTE ---
  {
    path: '/admin',
    // ✅ STEP 1: Staff IS ALLOWED into the Layout
    element: <PrivateRoute allowedRoles={['admin', 'owner', 'staff']}><Dashboard /></PrivateRoute>,
    children: [
      
      // ✅ STEP 2: The "Index" Route (what you see when you click "Overview")
      // If Admin -> Shows Dashboard. If Staff -> Redirects to POS.
      { 
        path: '', 
        element: <AdminDashboardRedirect /> 
      },

      // === SHARED ROUTES (Staff + Admin) ===
      { path: 'pos', element: <POS /> },
      { path: 'kitchen', element: <KitchenOrders /> },

      // === ADMIN ONLY ROUTES (Staff Blocked) ===
      { 
        path: 'user_manage', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><UsersManage /></PrivateRoute> 
      },
      { 
        path: 'add_ingredient', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><AddIngredient /></PrivateRoute> 
      },
      { 
        path: 'list_ingredient', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><IngredientList /></PrivateRoute> 
      },
      { 
        path: 'purchase_ingredient', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><PurchaseIngredient /></PrivateRoute> 
      },
      { 
        path: 'add_recipe', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><AddRecipe /></PrivateRoute> 
      },
      { 
        path: 'recipe_list', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><RecipeList /></PrivateRoute> 
      },
      { 
        path: 'produce', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><ProduceIceCream /></PrivateRoute> 
      },
      { 
        path: 'product_stock', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><ProductList /></PrivateRoute> 
      },
      { 
        path: 'tables', 
        element: <PrivateRoute allowedRoles={['admin', 'owner']}><TableManager /></PrivateRoute> 
      },
    ]
  }
]);

export default router;