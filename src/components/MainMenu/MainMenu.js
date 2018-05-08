import React from 'react'

export default () =>
  <div className="mainmenu">
    <div className="menubody">
    	<div className="l_grad"></div>
      <div className="r_grad"></div>
      <ul className="mmenu">
        <li>
          <a href="http://cityparkvip.ru/" className="first active">Главная</a>
        </li>
        <li>
          <a href="rest/">Ресторан и летнее кафе</a>
          <ul className="sub">
            <li>
              <a href="rest/restaurant.html" className="first">Ресторан</a>
            </li>
            <li>
              <a href="rest/kafe.html">Летнее кафе</a>
            </li>
            <li>
              <a href="rest/news/">Новости и мероприятия</a>
            </li>
            <li>
              <a href="rest/menu/">Меню</a>
            </li>
            <li>
              <a href="rest/shefblog/" className="last">Блог шеф-повара</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="hotel/">Отель-люкс</a>
          <ul className="sub">
            <li>
              <a href="hotel/katalog-nomerov/" className="first">Каталог номеров</a>
            </li>
            <li>
              <a href="hotel/test0.html" className="last">Документация</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="contacts.html" className="last">Контакты</a>
        </li>
		    <div id="menu-btn">
			    <div id="mn1"></div>
			    <div id="mn2"></div>
			    <div id="mn3"></div>
		    </div>
      </ul>
    </div>
  </div>