export const Router = (routes, navigator) => {
    const root = '/';
    let current;
    const clearSlashes = path => path.toString()
        .replace(/\/$/, '')
        .replace(/^\//, '')
        .replace(/\?(.*)$/, '');
    const getFragment = () => root + clearSlashes(decodeURI(window.location.pathname + window.location.search));
    const listen = () => {
        if (current === getFragment()) return;
        current = getFragment();
        [...routes].reverse().some(({path, id}) => {
            const match = current.match(path);
            if (match) {
                match.shift();
                navigator.navigate(id);
                return true;
            }
            return false;
        });
    };
    const navigate = path => {
        window.history.pushState(null, null, root + clearSlashes(path));
        listen();
    }
    window.addEventListener('popstate', listen);
    return {
        navigate,
        listen,
        history
    };
};
