import React from 'react';
import './App.css';
import data from './links.json';
import SearchBar from './search_bar.tsx';
import { NavLink } from 'react-router-dom';

type Link = { name: string; href: string; };
const links = data.links;

const Links: React.FC<{ links: Link[] }> = ({ links }) => (
  <div className="links-container">
    {links.map((link) => (
      <div key={link.href} className="link">
        <NavLink
          to={link.href}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {link.name}
        </NavLink>
      </div>
    ))}
  </div>
);

const Nav: React.FC = () => (
  <nav className="topnav">
    <Links links={links} />
    <SearchBar />
  </nav>
);

export default Nav;
