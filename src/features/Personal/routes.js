import React from 'react'
import * as containers from './containers'
import * as links from './links'
import { NotFound } from 'components'
 
const routes = [
  {
    path: links.PERSONAL.URL,
    component: containers.Layout,
    routes: [
      {
        path: links.PERSONAL.URL,
        exact: true,
        component: containers.MyData,
      },
      {
        path: links.FAVORITES.URL,
        component: containers.Favorites
      },
      {
        path: links.ORDERS.URL,
        component: containers.Orders
      },
      {
        path: '*',
        component: () => <NotFound />
      }
    ]
  }
]

export default routes
