import logo from './logo.svg';
import './App.css';
import { createBrowserRouter,Router,RouterProvider } from 'react-router-dom';
import PostPageHome from './views/PostPageHome';
import LoginPage from './views/LoginPage';
import SignUpPage from './views/SignUpPage';
import PostPageAdd from "./views/PostPageAdd";
import PostPageDetails from "./views/PostPageDetails";
import PostPageUpdate from "./views/PostPageUpdate";


function App() {

  const router = createBrowserRouter([
    {path: "/", element: <PostPageHome />},
    {path: "/login", element: <LoginPage />},
    {path: "/signup", element: <SignUpPage />},
    {path: "/add", element: <PostPageAdd />},
    {path: "/post/:id", element: <PostPageDetails />},
    {path: "/update/:id", element:< PostPageUpdate />},
  ]);

  return (
    <RouterProvider router={router} />
  );
}
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
