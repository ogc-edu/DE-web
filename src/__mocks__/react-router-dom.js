import React from 'react';

const BrowserRouter = ({ children }) => <div>{children}</div>;
const Routes = ({ children }) => <div>{children}</div>;
const Route = () => null;
const Link = ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>;
const useNavigate = () => jest.fn();
const useLocation = () => ({ pathname: '/' });
const useParams = () => ({});
const useSearchParams = () => [new URLSearchParams(), jest.fn()];
const Navigate = () => null;
const useNavigateState = () => ({});

module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  useNavigateState,
};
