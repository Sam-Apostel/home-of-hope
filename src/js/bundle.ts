import '@webcomponents/webcomponentsjs';
import '../components/components';
import {TabView} from '../components/components';

const title = document.createElement('h1');
title.innerText = 'Home of Hope';
const root = TabView.makeView(title,
    [
        { id: 'Home', icon: 'home'},
        { id: 'Stories', icon: 'book-open' },
        { id: 'Poems', icon: 'pen-fancy' },
        { id: 'Music', icon: 'guitar' },
        { id: 'Research', icon: 'graduation-cap' },
        { id: 'Art', icon: 'palette' },
        { id: 'Interpreting', icon: 'hand-holding-heart' },
        { id: 'Asperger', icon: 'puzzle-piece' },
        { id: 'Webshop', icon: 'shopping-bag' }
    ]
);
document.body.appendChild(root);
