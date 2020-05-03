import '@webcomponents/webcomponentsjs';
import '../components/components';
import {TabView} from '../components/components';

const root = new TabView();
const title = document.createElement('h1');
title.innerText = 'Home of Hope';
root.build(title,
    {
    Home: 'home',
    Stories: 'book-open',
    Poems: 'pen-fancy',
    Music: 'guitar',
    Research: 'graduation-cap',
    Art: 'palette',
    Interpreting: 'hand-holding-heart',
    Asperger: 'puzzle-piece',
    Webshop: 'shopping-bag'
    }
);
document.body.appendChild(root);
