import React, { createContext, useContext, useState } from 'react';
import { USERS } from '@/constants/mockData';
import { User, CartContextItem } from '@/constants/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  signup: (email: string, pass: string, userName: string) => boolean;
  logout: () => void;
  // Giả lập Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  updateAvatar: (uri: string) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;

  // Cart Management
  cartItems: CartContextItem[];
  addToCart: (id: string, type: 'PRODUCT' | 'ASSET', quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartContextItem[]>([]);

  // Giả lập Login
  const login = (email: string, pass: string) => {
    // Tìm user trong mảng mock
    const foundUser = USERS.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (email: string, pass: string, userName: string) => {
    // Check trùng
    if (USERS.find(u => u.email === email)) return false;
    
    const newUser: User = {
      userId: `u${USERS.length + 1}`,
      email,
      password: pass,
      userName,
      role: 'user',
      trustScore: 100,
    };
    USERS.push(newUser); // Push mock
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setCartItems([]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateAvatar = (uri: string) => {
    if (user) {
      setUser({ ...user, avatarUrl: uri });
    }
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (user && user.password === oldPass) {
      setUser({ ...user, password: newPass });
      return true;
    }
    return false;
  };

  const addToCart = (id: string, type: 'PRODUCT' | 'ASSET', quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id, quantity: quantity, type }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems(prev => prev.map(item => {
       if (item.id === id) {
         return { ...item, quantity: Math.max(1, item.quantity + amount) };
       }
       return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, favorites, toggleFavorite, updateAvatar, changePassword,
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
