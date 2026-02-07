import axios from 'axios';
//import $ from 'jquery';
import Header from './Header';
import { useEffect, useState ,useRef} from 'react'; // Import useState for conditional rendering (optional)
import { useNavigate } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Optional state
  const [username,setUsername]=useState('');
  const [person_name,setNaam]=useState('');
  const navigate = useNavigate();
  const hasFetchedAuth = useRef(false);
  
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     localStorage.setItem('jwtToken',false);
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  
  // }, []); 


  useEffect(() => {
    const checkAuth = async () => {
      if (hasFetchedAuth.current) return; // Prevent second execution
      hasFetchedAuth.current = true; // Set ref to true to prevent re-fetching


      const token = localStorage.getItem('jwtToken');
      // Handle Missing or Invalid Token
      if (!token || token=='undefined') {
        
        navigate('/login'); // Redirect to login immediately
        return; // Exit the function if no token is found
      }

        try {
          const response = await axios.post('http://localhost:5000/api/check-session', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.type == true) {
            setIsAuthenticated(true);
            setUsername(response.data.banda);
            setNaam(response.data.banda_naam);
            
           
           return;
          } else {
            // Handle invalid token or other errors
            console.error('Invalid token or other error:', response.data.message);
            localStorage.removeItem('jwtToken'); 
            navigate('/login');
          }
        } catch (error) {
          console.error('Error checking session:', error);
          localStorage.removeItem('jwtToken'); 
          navigate('/login');
        }
      
    };

    checkAuth();
  }, [navigate]);
  
  return (
    isAuthenticated && ( // Only render children if authenticated
      <>
        <Header mobile={username} banda={person_name}/>
             {children}
        
        
      </>
    )
  );
};

export default ProtectedRoute;
