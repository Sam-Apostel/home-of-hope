import '@webcomponents/webcomponentsjs';
import {TabView} from './../components/components';
import {initObjectIterators} from '../utils/developer';

initObjectIterators();

const title = document.createElement('h1');
title.innerText = 'Home of Hope';
const root = TabView.makeView(title,
    [
        {path: '/', id: 'Home', icon: 'home'},
        {path: '/poems', id: 'Poems', icon: 'pen-fancy'},
        {path: '/art', id: 'Art', icon: 'palette'},
        {path: '/asperger', id: 'Asperger', icon: 'puzzle-piece'},
        {path: '/shop', id: 'Webshop', icon: 'shopping-bag'}
    ]
);

document.body.appendChild(root);
root.router.listen();

//{ id: 'Stories', icon: 'book-open' },
//{ id: 'Music', icon: 'guitar' },
//{ id: 'Research', icon: 'graduation-cap' },
//{ id: 'Interpreting', icon: 'hand-holding-heart' },
