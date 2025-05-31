import { useEffect, useRef, useState } from 'react';


export const useWebSocket = (userId, locationContext) => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [cartActionInProgress, setCartActionInProgress] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const wsRef = useRef(null);
  // const location = useLocation();
  const isOnChatPage = location.pathname === '/Chat' || location.pathname === '/RecipesArticles';

  const [recipe, setRecipe] = useState(null);

  const handleViewRecipe = async (recipeId) => {
    try {
      // Use the API endpoint instead of local JSON file
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/recipes/${recipeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
      }
      
      const selectedRecipe = await response.json();
      console.log('Selected Recipe:', selectedRecipe);
      setRecipe(selectedRecipe);
      return selectedRecipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  };


  const handleCartAction = async (action) => {
    // if (!user || user.role !== 'Customer') {
    //   setError('Please log in as a customer to add items to cart');
    //   return;
    // }

    try {
      setCartActionInProgress(true);
      console.log('Processing cart action:', action);
      const success = await addToCart(userId, action.product.id, action.product.quantity, locationContext);
      
      if (success) {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `✅ Successfully added product to your cart!`
        }]);
      }
    } catch (err) {
      console.error('Error processing cart action:', err);
      setError('Failed to add item to cart');
    } finally {
      setCartActionInProgress(false);
    }
  };

  // Add a function to handle shop recipe confirmation
  const handleShopRecipeConfirm = async (shopRecipeItems) => {
    try {
      setCartActionInProgress(true);
      
      // Filter only selected items
      const selectedItems = shopRecipeItems.filter(item => item.selected);
      
      // Process each selected item
      for (const item of selectedItems) {
        await addToCart(
          userId, 
          item.product.id, 
          item.product.quantity, 
          locationContext
        );
      }
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `✅ Successfully added ${selectedItems.length} items to your cart!`
      }]);
      
    } catch (error) {
      console.error('Error adding recipe items to cart:', error);
      setError('Failed to add some recipe items to cart');
    } finally {
      setCartActionInProgress(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    let reconnectTimeout;

    const connectWebSocket = () => {
      // Only connect on Chat page
      console.log('Checking WebSocket connection...');
      // if (!isOnChatPage || !userId) {
      //   console.log('Not connecting WebSocket - not on chat page or no user');
      //   return;
      // }
      
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }
      
      console.log('Connecting WebSocket...');
      const ws = new WebSocket(`ws://localhost:5001`);
      
      ws.onopen = () => {
        if (!isSubscribed) return;
        console.log('WebSocket Connected');
        setWsStatus('connected');
      };

      ws.onmessage = async (event) => {
        if (!isSubscribed || !isOnChatPage) return;
        const data = JSON.parse(event.data);
        console.log('WebSocket Message:', data);
        
        // Set botTyping to false when response is received
        setBotTyping(false);
        
        if (data.error) {
          console.error('WebSocket error:', data.error);
          setError(data.error);
          return;
        }

        // Count recipe actions to determine how to display them
        const recipeActions = data.actions?.filter(action => action.action === 'view_recipe') || [];
        const hasRecipes = recipeActions.length > 0;

        // First, add the text message without recipes
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: data.message,
          // Don't set any recipes yet
        }]);

        // Process any actions
        if (data.actions && data.actions.length > 0) {
          // Handle cart actions
          const cartActions = data.actions.filter(action => action.action === 'add_to_cart');
          for (const action of cartActions) {
            await handleCartAction(action);
          }
          
          // Then handle recipe actions - fetch all recipe data first
          const recipePromises = recipeActions.map(action => 
            handleViewRecipe(action.recipe_id)
          );
          
          const recipes = await Promise.all(recipePromises);
          const validRecipes = recipes.filter(Boolean); // Remove any null results
          
          if (validRecipes.length > 0) {
            // Add each recipe as a separate message after the text
            validRecipes.forEach(recipeData => {
              setMessages(prev => [...prev, {
                sender: 'bot',
                recipeOnly: true, // Flag to indicate this is just a recipe with no text
                recipe: recipeData
              }]);
            });
          }

          // Handle shop_recipe action
          const shopRecipeAction = data.actions.find(action => action.action === 'shop_recipe');
          if (shopRecipeAction) {
            // Set shop recipe data including items with selected state (all true by default)
            const itemsWithSelection = shopRecipeAction.cart_actions.map(item => ({
              ...item,
              selected: true // Default all to selected
            }));

            setMessages(prev => [...prev, {
              sender: 'bot',
              shopRecipe: {
                ...shopRecipeAction,
                cart_actions: itemsWithSelection
              }
            }]);
          }
        }
      };

      ws.onclose = () => {
        console.log('WebSocket Closed');
        setWsStatus('disconnected');
        if (isOnChatPage && isSubscribed) {
          console.log('Scheduling reconnect...');
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setWsStatus('error');
      };

      wsRef.current = ws;
    };

    if (isOnChatPage) {
      connectWebSocket();
    }

    return () => {
      console.log('Cleanup - Disconnecting WebSocket');
      isSubscribed = false;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsStatus('disconnected');
    };
  }, [userId, isOnChatPage]);

  return { 
    wsStatus, 
    messages, 
    wsRef, 
    setMessages, 
    error,
    setError,
    cartActionInProgress,
    botTyping,
    setBotTyping,
    handleShopRecipeConfirm
  };
};