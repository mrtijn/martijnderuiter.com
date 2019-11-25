import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './navigation.module.scss';
export class Navigation extends Component {
         menuItems = [
           {
                label: "Home",
                url: '/'
           },
           {
                label: "Experiments",
                url: '/experiments'
           }
         ];

         render() {
           return (
             <div className={style.navigation}>
               <ul>
                 {this.menuItems.map(item => (
                   <li key={item.label}>
                     <Link to={item.url}>{item.label}</Link>
                   </li>
                 ))}
               </ul>
             </div>
           );
         }
       }

export default Navigation;
